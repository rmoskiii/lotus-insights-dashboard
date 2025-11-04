// Minimal Transaction model stub
module.exports = {
  name: 'Transaction',
  fields: ['id', 'userId', 'amount', 'currency', 'createdAt'],
  create: (obj) => ({
    id: obj.id || null,
    userId: obj.userId || null,
    amount: Number(obj.amount) || 0,
    currency: obj.currency || 'USD',
    createdAt: obj.createdAt || new Date().toISOString()
  }),
  validate: (obj) => {
    return obj && typeof obj.id === 'string' && typeof obj.userId === 'string';
  }
};

