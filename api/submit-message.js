const { getDb } = require('./db');

module.exports = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const db = await getDb();
    const collection = db.collection('messages');
    
    const newMessage = {
      name,
      email,
      phone: phone || '',
      message,
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
