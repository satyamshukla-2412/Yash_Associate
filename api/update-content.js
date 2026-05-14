const { getDb } = require('./db');

module.exports = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security Check: Only allow if authenticated
  const cookies = req.headers.cookie || '';
  if (!cookies.includes('auth_token=yash_secure_token_xyz123')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = await getDb();
    const collection = db.collection('content');
    
    // We expect the whole content object in req.body
    const newContent = req.body;
    // Don't override _id
    delete newContent._id;

    await collection.updateOne(
      { _id: 'website_content' },
      { $set: newContent },
      { upsert: true }
    );
    
    return res.status(200).json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, error: 'Database update failed' });
  }
};
