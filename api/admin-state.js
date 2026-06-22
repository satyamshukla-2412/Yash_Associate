const { getDb } = require('./db');
const { ADMIN_ID, ADMIN_PASSWORD, ADMIN_EMAIL } = require('./admin-config');

const ADMIN_DOC_ID = 'admin_security';

async function getAdminState() {
  const db = await getDb();
  const collection = db.collection('admin_settings');
  let state = await collection.findOne({ _id: ADMIN_DOC_ID });

  if (!state) {
    state = {
      _id: ADMIN_DOC_ID,
      adminId: ADMIN_ID,
      password: ADMIN_PASSWORD,
      email: ADMIN_EMAIL,
      resetToken: '',
      resetCode: '',
      resetExpiresAt: null,
      updatedAt: new Date().toISOString()
    };
    await collection.insertOne(state);
  }

  return state;
}

async function updateAdminState(patch) {
  const db = await getDb();
  const collection = db.collection('admin_settings');
  const $set = { ...patch, updatedAt: new Date().toISOString() };
  await collection.updateOne({ _id: ADMIN_DOC_ID }, { $set }, { upsert: true });
  return collection.findOne({ _id: ADMIN_DOC_ID });
}

module.exports = {
  getAdminState,
  updateAdminState
};
