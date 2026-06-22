const { getDb } = require('./db');

module.exports = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const db = await getDb();
    const collection = db.collection('messages');
    
    const newMessage = {
      name,
      email: email || '',
      phone,
      message: message || '',
      source: source || (String(message || '').includes('Internship Application') ? 'internship' : 'consultation'),
      date: new Date().toISOString(),
      status: 'new' // 'new', 'read', 'replied'
    };

    await collection.insertOne(newMessage);
    
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};
