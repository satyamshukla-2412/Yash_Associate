const { getDb } = require('./db');

module.exports = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, path } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID required' });
    }

    const db = await getDb();
    const collection = db.collection('visits');
    const now = new Date().toISOString();

    await collection.updateOne(
      { sessionId },
      {
        $set: {
          sessionId,
          path: path || '/',
          lastSeenAt: now
        },
        $setOnInsert: {
          firstSeenAt: now,
          createdAt: now
        }
      },
      { upsert: true }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Visit tracking failed:', error);
    return res.status(500).json({ success: false, error: 'Failed to track visit' });
  }
};
