import dotenv from 'dotenv';
import { connect, close } from './db.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

function parseArg(name, fallback) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!arg) return fallback;
  return arg.split('=')[1];
}

const USERS = Number(parseArg('users', 2000));
const EVENTS = Number(parseArg('events', 50000));
const TRANSACTIONS = Number(parseArg('transactions', 8000));
const SESSIONS = Number(parseArg('sessions', 10000));
const APPEND = parseArg('append', 'false') === 'true';

// Resolve data dir relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'sandbox-data');

const SEGMENTS = ['student','business','elderly','young_professional','premium'];

// Per-segment feature affinities (higher weight => more likely to generate that event)
const SEGMENT_AFFINITIES = {
  student: { airtime_purchase: 30, savings_goal: 20, login: 30, fund_transfer: 10, bill_payment: 5, travel: 2, loan_request: 3 },
  business: { fund_transfer: 40, login: 25, bill_payment: 15, airtime_purchase: 5, savings_goal: 5, travel: 5, loan_request: 5 },
  elderly: { bill_payment: 30, login: 30, zakat: 10, airtime_purchase: 10, savings_goal: 10, fund_transfer: 5 },
  young_professional: { login: 30, fund_transfer: 25, airtime_purchase: 15, savings_goal: 10, travel: 10, loan_request: 5 },
  premium: { travel: 30, savings_goal: 25, fund_transfer: 15, login: 10, airtime_purchase: 5, loan_request: 10 }
};

const FEATURES = [
  'login',
  'fund_transfer',
  'bill_payment',
  'airtime_purchase',
  'travel',
  'savings_goal',
  'loan_request',
  'zakat',
  'quran_daily'
];

function weightedPick(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((s,[,w])=>s+w,0);
  let r = Math.random() * total;
  for (const [k,w] of entries) {
    if (r < w) return k;
    r -= w;
  }
  return entries[0][0];
}

function randomDateBetween(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function iso(d){ return d.toISOString(); }

async function seed() {
  let client, db;
  try {
    ({ client, db } = await connect());
  } catch (err) {
    console.error('Could not connect to MongoDB, aborting seed:', err.message);
    process.exit(1);
  }

  try {
    const usersCol = db.collection('users');
    const eventsCol = db.collection('feature_logs');
    const txCol = db.collection('transactions');
    const sessionsCol = db.collection('sessions');
    const onbCol = db.collection('onboarding');
    const seasonsCol = db.collection('seasons');

    if (!APPEND) {
      console.log('Dropping existing collections (users, feature_logs, transactions, sessions, onboarding, seasons)');
      await Promise.all([
        usersCol.deleteMany({}),
        eventsCol.deleteMany({}),
        txCol.deleteMany({}),
        sessionsCol.deleteMany({}),
        onbCol.deleteMany({}),
        seasonsCol.deleteMany({})
      ]);
    }

    // Load seasons from file (if present)
    let seasons = [];
    try {
      seasons = await fs.readJson(`${DATA_DIR}/seasons.json`);
      if (seasons && seasons.length) {
        await seasonsCol.insertMany(seasons);
        console.log(`Inserted ${seasons.length} seasons`);
      }
    } catch (e) {
      console.log('No seasons.json found in sandbox-data, continuing without seasons file.');
    }

    // Generate users
    console.log(`Generating ${USERS} users...`);
    const users = [];
    const startJoin = new Date();
    startJoin.setFullYear(startJoin.getFullYear() - 2); // joined within last 2 years

    for (let i=0;i<USERS;i++){
      const id = `u${String(i+1).padStart(5,'0')}`;
      const segment = SEGMENTS[Math.floor(Math.random()*SEGMENTS.length)];
      const joined = iso(randomDateBetween(startJoin, new Date()));
      users.push({ id, name: `User ${i+1}`, email: `user${i+1}@example.com`, segment, joined, active: Math.random() > 0.15, createdAt: joined });
    }
    await usersCol.insertMany(users);
    console.log(`Inserted ${users.length} users`);

    // generate sessions
    console.log(`Generating ${SESSIONS} sessions...`);
    const sessions = [];
    for (let i=0;i<SESSIONS;i++){
      const user = users[Math.floor(Math.random()*users.length)];
      const startedAt = randomDateBetween(new Date(Date.now() - 365*24*3600*1000), new Date());
      const duration = Math.floor(Math.random()*1800);
      const device = Math.random() > 0.6 ? 'android' : 'ios';
      sessions.push({ id: `sess_${i+1}`, userId: user.id, startedAt: iso(startedAt), durationSeconds: duration, device, appVersion: `1.${Math.floor(Math.random()*10)}` });
    }
    if (sessions.length) await sessionsCol.insertMany(sessions);
    console.log(`Inserted ${sessions.length} sessions`);

    // generate events with per-segment affinities and seasonal boosts
    console.log(`Generating ${EVENTS} feature events...`);
    const events = [];
    const seasonsRanges = (seasons || []).map(s => ({ name: s.name, start: new Date(s.startDate), end: new Date(s.endDate), boosts: s.boosts || [] }));
    const eventStart = new Date(); eventStart.setFullYear(eventStart.getFullYear() - 1);

    for (let i=0;i<EVENTS;i++){
      const user = users[Math.floor(Math.random()*users.length)];
      const segAff = SEGMENT_AFFINITIES[user.segment] || SEGMENT_AFFINITIES['young_professional'];
      // seasonal boost: if timestamp falls within a season, temporarily boost some features
      const ts = randomDateBetween(eventStart, new Date());
      let weights = { ...segAff };
      for (const s of seasonsRanges){
        if (ts >= s.start && ts <= s.end){
          // boost weights for seasonal features if provided in seasons mapping
          if (s.boosts && Array.isArray(s.boosts)){
            for (const f of s.boosts){ weights[f] = (weights[f] || 0) + 10; }
          }
        }
      }
      const feature = weightedPick(weights);
      const sessionId = `sess_${Math.floor(Math.random()*SESSIONS)+1}`;
      events.push({ id: `e${i+1}`, userId: user.id, feature, timestamp: iso(ts), sessionId, metadata: {} });
    }
    if (events.length) await eventsCol.insertMany(events);
    console.log(`Inserted ${events.length} feature events`);

    // generate transactions: tie some events to transactions by probability
    console.log(`Generating ${TRANSACTIONS} transactions...`);
    const products = ['Recharge','Savings Goal','Travel','Mudarabah','Fund Transfer','Bill Payment'];
    const transactions = [];
    for (let i=0;i<TRANSACTIONS;i++){
      const user = users[Math.floor(Math.random()*users.length)];
      const createdAt = randomDateBetween(new Date(Date.now() - 365*24*3600*1000), new Date());
      const product = products[Math.floor(Math.random()*products.length)];
      const amount = Math.round((Math.random()*500 + 5) * 100)/100;
      const status = Math.random() > 0.02 ? 'success' : 'failed';
      transactions.push({ id: `t${i+1}`, userId: user.id, amount, currency: 'NGN', product, status, createdAt: iso(createdAt) });
    }
    if (transactions.length) await txCol.insertMany(transactions);
    console.log(`Inserted ${transactions.length} transactions`);

    // onboarding records
    console.log('Generating onboarding records...');
    const onboards = users.map((u, i) => ({ id: `o${i+1}`, userId: u.id, step: Math.floor(Math.random()*5)+1, completed: Math.random() > 0.4, updatedAt: u.joined }));
    if (onboards.length) await onbCol.insertMany(onboards);
    console.log(`Inserted ${onboards.length} onboarding records`);

    console.log('✅ Seeding complete. Summary:');
    const counts = {
      users: await usersCol.countDocuments(),
      sessions: await sessionsCol.countDocuments(),
      events: await eventsCol.countDocuments(),
      transactions: await txCol.countDocuments(),
      onboarding: await onbCol.countDocuments(),
      seasons: await seasonsCol.countDocuments()
    };
    console.table(counts);

  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await close();
  }
}

seed();
