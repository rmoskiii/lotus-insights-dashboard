// Minimal Session model stub
module.exports = {
  name: 'Session',
  fields: ['id', 'userId', 'durationSeconds', 'active', 'startedAt'],
  create: (obj) => ({
    id: obj.id || null,
    userId: obj.userId || null,
    durationSeconds: Number(obj.durationSeconds) || 0,
    active: Boolean(obj.active),
    startedAt: obj.startedAt || new Date().toISOString()
  }),
  validate: (obj) => {
    return obj && typeof obj.id === 'string' && typeof obj.userId === 'string';
  }
};

