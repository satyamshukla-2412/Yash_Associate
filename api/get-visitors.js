const { getDb } = require('./db');

module.exports = async function(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = req.headers.cookie || '';
  if (!cookies.includes('auth_token=yash_secure_token_xyz123')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = await getDb();
    const collection = db.collection('visits');
    const visitors = await collection.countDocuments({});
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await collection.countDocuments({ lastSeenAt: { $gte: today.toISOString() } });

    return res.status(200).json({
      success: true,
      data: {
        visitors,
        todayVisitors
      }
    });
  } catch (error) {
    console.error('Failed to load visitors:', error);
    return res.status(500).json({ success: false, error: 'Failed to load visitors' });
  }
};
