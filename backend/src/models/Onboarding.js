// Minimal Onboarding model stub
module.exports = {
  name: 'Onboarding',
  fields: ['id', 'userId', 'step', 'completed', 'updatedAt'],
  create: (obj) => ({
    id: obj.id || null,
    userId: obj.userId || null,
    step: Number(obj.step) || 1,
    completed: Boolean(obj.completed),
    updatedAt: obj.updatedAt || new Date().toISOString()
  }),
  validate: (obj) => {
    return obj && typeof obj.id === 'string' && typeof obj.userId === 'string';
  }
};

