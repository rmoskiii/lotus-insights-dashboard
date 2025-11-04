// Minimal Event model stub
module.exports = {
  name: 'Event',
  fields: ['id', 'userId', 'type', 'metadata', 'createdAt'],
  create: (obj) => ({
    id: obj.id || null,
    userId: obj.userId || null,
    type: obj.type || 'unknown',
    metadata: obj.metadata || {},
    createdAt: obj.createdAt || new Date().toISOString()
  }),
  validate: (obj) => {
    return obj && typeof obj.id === 'string' && typeof obj.userId === 'string';
  }
};

