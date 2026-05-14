const { getDb } = require('./db');

module.exports = async function(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const collection = db.collection('content');
    
    // We store all website text in a single document with _id: 'website_content'
    let content = await collection.findOne({ _id: 'website_content' });
    
    if (!content) {
      // Default content if database is empty
      content = {
        _id: 'website_content',
        heroTitle: 'Yash Associate',
        heroSubtitle: 'JUSTICE • INTEGRITY • DEDICATION',
        heroDescription: 'Led by ADV. Dilip H. Shukla, delivering 20+ years of unwavering legal counsel across civil, criminal, corporate, and constitutional law.',
        aboutTitle: 'About Our Firm',
        aboutText: 'Yash Associates has been a beacon of legal excellence since 2005. We provide comprehensive legal services to individuals and corporations.',
        address: 'Mumbai, India',
        phone: '+91 98765 43210',
        email: 'contact@yashassociate.com'
      };
      await collection.insertOne(content);
    }
    
    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, error: 'Database connection error' });
  }
};
