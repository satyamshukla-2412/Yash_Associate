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
        heroDescription: 'Led by ADV. Dilip H. Shukla, delivering 21+ years of unwavering legal counsel across civil, criminal, corporate, and constitutional law.',
        aboutTitle: 'About Our Firm',
        aboutText: `As the founder of Yash Associates, he continues to lead with a vision of delivering accessible, reliable, and high-quality legal services while upholding the highest standards of the legal profession.  
With over 21 years of experience in the legal profession, he has built a reputation for providing practical legal advice, strategic representation, and unwavering dedication to his clients. His approach combines deep legal knowledge with a thorough understanding of each client's unique circumstances, ensuring effective and result-oriented solutions.

Throughout his career, Advocate Shukla has handled matters across various areas of law, representing individuals, businesses, and organizations before different courts and legal forums. Known for his professionalism, integrity, and attention to detail, he remains committed to protecting the rights and interests of those he represents.`,
        address: '24-BD, Rajbhadur Compound, Opposite to BSE, Fort, Mumbai — 400001',
        phone: '9323282940 / 9821248856',
        email: 'yashassociate2005@gmail.com',
        heroBgImg: 'ASSETS/hero_reference_bg.webp',
        heroPortraitImg: 'ASSETS/hero_advocate_portrait.png',
        aboutBgImg: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bombay_High_Court.jpg',
        aboutPortraitImg: 'ASSETS/about_portrait.png',
        practiceBgImg: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Supreme_Court_of_India_02.jpg',
        courtsBgImg: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bombay_High_Court_1.jpg',
        clientsBgImg: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Supreme_Court_of_India_Building.jpg',
        teamBgImg: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Supreme_Court_of_India_01.jpg',
        dividerBgImg: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bombay_High_Court.jpg',
        practiceAreasText: 'Criminal Law|Robust criminal defense and prosecution counsel, bail applications, and trial representation.\nCivil Law|Property disputes, contracts, succession, and civil rights protection with meticulous legal representation.\nConstitutional Law|Writ petitions, fundamental rights litigation, and constitutional remedies before High Court and Supreme Court.\nCorporate Law|Company formation, mergers & acquisitions, compliance, shareholder agreements, and corporate governance.\nBanking & Finance Law|Debt recovery, SARFAESI proceedings, banking disputes, financial fraud, and DRT matters.\nFamily Law|Divorce, custody, maintenance, domestic violence cases, and matrimonial dispute resolution.\nProperty / Real Estate Law|Land acquisition, title verification, property registration, RERA disputes, and real estate litigation.\nCommercial & Business Litigation|Partnership disputes, trade disputes, contractual claims, and arbitration proceedings.\nConsumer & Small Claims|Consumer protection cases, deficiency of service, unfair trade practices, and small claims resolution.',
        courtsText: 'Supreme Court|The Apex Court of India\nHigh Court|Bombay High Court\nSession Court|Criminal Sessions\nMagistrate Court|Metropolitan Magistrate\nNCLT|National Company Law Tribunal\nDRT|Debt Recovery Tribunal\nFamily Court|Family Disputes Tribunal\nSmall Causes Court|Small Claims Jurisdiction',
        clientsText: 'Lotus Refinery, NSEL, Kamla Group, RNA Builder, Baba Siddiqui Murder Case, Rohit Shetty Firing Case',
        teamCount: '11+',
        teamText: 'Founded in 2005, Yash Associate has grown into a trusted legal institution with a team of 11+ dedicated legal professionals. Under the leadership of ADV. Dilip H. Shukla, the firm handles complex legal matters across civil, criminal, corporate, and family law.\n\nOur team brings together diverse expertise and shared values of integrity, diligence, and an unwavering commitment to client success.'
      };
      await collection.insertOne(content);
    }
    
    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ success: false, error: 'Database connection error' });
  }
};
