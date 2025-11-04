// Minimal User model stub (no DB dependency)
module.exports = {
  name: 'User',
  fields: ['id', 'name', 'email', 'createdAt'],
  create: (obj) => ({
    id: obj.id || null,
    name: obj.name || null,
    email: obj.email || null,
    createdAt: obj.createdAt || new Date().toISOString()
  }),
  validate: (obj) => {
    return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
  }
};

