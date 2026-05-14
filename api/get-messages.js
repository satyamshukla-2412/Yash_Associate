const { getDb } = require('./db');

module.exports = async function(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security Check
  const cookies = req.headers.cookie || '';
  if (!cookies.includes('auth_token=yash_secure_token_xyz123')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = await getDb();
    const collection = db.collection('messages');
    
    const messages = await collection.find({}).sort({ date: -1 }).toArray();
    
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve messages' });
  }
};
