const { getDb } = require('./db');
const { ObjectId } = require('mongodb');

module.exports = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security Check
  const cookies = req.headers.cookie || '';
  if (!cookies.includes('auth_token=yash_secure_token_xyz123')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id, status } = req.body;
    
    if (!id || !status) {
      return res.status(400).json({ error: 'ID and Status required' });
    }

    const db = await getDb();
    const collection = db.collection('messages');
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    
    return res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update message' });
  }
};
