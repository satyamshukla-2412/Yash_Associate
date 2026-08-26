const { ObjectId } = require('mongodb');
const { getDb } = require('./db');
const { AUTH_COOKIE } = require('./admin-config');
const { getAdminState, updateAdminState } = require('./admin-state');

const FIRM_START_YEAR = 2005;

function getFirmExperienceYears(referenceDate = new Date()) {
  return Math.max(0, referenceDate.getFullYear() - FIRM_START_YEAR);
}

function normalizeFirmExperienceText(value, years = getFirmExperienceYears()) {
  return String(value || '').replace(/\b\d+\+?\s+years\b/gi, `${years}+ years`);
}

function normalizeContent(content) {
  const normalized = { ...content };
  Object.keys(normalized).forEach(key => {
    if (typeof normalized[key] === 'string') {
      normalized[key] = normalizeFirmExperienceText(normalized[key]);
    }
  });
  return normalized;
}

function json(res, status, payload) {
  return res.status(status).json(payload);
}

function isAuthed(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('auth_token=yash_secure_token_xyz123');
}

function routePath(req) {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  return pathname.replace(/^\/api\/?/, '');
}

function defaultContent() {
  const experienceYears = getFirmExperienceYears();
  return {
    _id: 'website_content',
    heroTitle: 'Yash Associate',
    heroSubtitle: 'JUSTICE â€¢ INTEGRITY â€¢ DEDICATION',
    heroDescription: `Led by ADV. Dilip H. Shukla, delivering ${experienceYears}+ years of unwavering legal counsel across civil, criminal, corporate, and constitutional law.`,
    aboutTitle: 'About Our Firm',
    aboutText: `As the founder of Yash Associates, he continues to lead with a vision of delivering accessible, reliable, and high-quality legal services while upholding the highest standards of the legal profession.  
With over ${experienceYears} years of experience in the legal profession, he has built a reputation for providing practical legal advice, strategic representation, and unwavering dedication to his clients. His approach combines deep legal knowledge with a thorough understanding of each client's unique circumstances, ensuring effective and result-oriented solutions.

Throughout his career, Advocate Shukla has handled matters across various areas of law, representing individuals, businesses, and organizations before different courts and legal forums. Known for his professionalism, integrity, and attention to detail, he remains committed to protecting the rights and interests of those he represents.`,
    address: '24-BD, Rajbhadur Compound, Opposite to BSE, Fort, Mumbai â€” 400001',
    phone: '9323282940 / 9821248856',
    email: 'yashassociate2005@gmail.com',
    heroBgImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Supreme_Court_of_India_01.jpg/1280px-Supreme_Court_of_India_01.jpg',
    heroPortraitImg: 'ASSETS/hero_advocate_portrait.png',
    aboutBgImg: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bombay_High_Court.jpg',
    aboutPortraitImg: 'ASSETS/about_portrait.png',
    practiceBgImg: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Supreme_Court_of_India_02.jpg',
    courtsBgImg: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bombay_High_Court_1.jpg',
    clientsBgImg: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Supreme_Court_of_India_Building.jpg',
    teamBgImg: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Supreme_Court_of_India_01.jpg',
    teamImage: 'ASSETS/team_firm_thumbnail.webp',
    dividerBgImg: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bombay_High_Court.jpg',
    linkedinUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    xUrl: '',
    practiceAreasText: 'Criminal Law|Robust criminal defense and prosecution counsel, bail applications, and trial representation.\nCivil Law|Property disputes, contracts, succession, and civil rights protection with meticulous legal representation.\nConstitutional Law|Writ petitions, fundamental rights litigation, and constitutional remedies before High Court and Supreme Court.\nCorporate Law|Company formation, mergers & acquisitions, compliance, shareholder agreements, and corporate governance.\nBanking & Finance Law|Debt recovery, SARFAESI proceedings, banking disputes, financial fraud, and DRT matters.\nFamily Law|Divorce, custody, maintenance, domestic violence cases, and matrimonial dispute resolution.\nProperty / Real Estate Law|Land acquisition, title verification, property registration, RERA disputes, and real estate litigation.\nCommercial & Business Litigation|Partnership disputes, trade disputes, contractual claims, and arbitration proceedings.\nConsumer & Small Claims|Consumer protection cases, deficiency of service, unfair trade practices, and small claims resolution.',
    courtsText: 'Supreme Court|The Apex Court of India\nHigh Court|Bombay High Court\nSession Court|Criminal Sessions\nMagistrate Court|Metropolitan Magistrate\nNCLT|National Company Law Tribunal\nDRT|Debt Recovery Tribunal\nFamily Court|Family Disputes Tribunal\nSmall Causes Court|Small Claims Jurisdiction',
    clientsText: 'Lotus Refinery, NSEL, Kamla Group, RNA Builder, Baba Siddiqui Murder Case, Rohit Shetty Firing Case',
    teamCount: '11+',
    teamText: 'Founded in 2005, Yash Associate has grown into a trusted legal institution with a team of 11+ dedicated legal professionals. Under the leadership of ADV. Dilip H. Shukla, the firm handles complex legal matters across civil, criminal, corporate, and family law.\n\nOur team brings together diverse expertise and shared values of integrity, diligence, and an unwavering commitment to client success.'
  };
}

async function handleGetContent(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  try {
    const db = await getDb();
    const collection = db.collection('content');
    let content = await collection.findOne({ _id: 'website_content' });
    if (!content) {
      content = defaultContent();
      await collection.insertOne(content);
    }
    return json(res, 200, { success: true, data: normalizeContent(content) });
  } catch (error) {
    console.error('Database Error:', error);
    return json(res, 500, { success: false, error: 'Database connection error' });
  }
}

async function handleUpdateContent(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!isAuthed(req)) return json(res, 401, { error: 'Unauthorized' });
  try {
    const db = await getDb();
    const collection = db.collection('content');
    const newContent = normalizeContent({ ...(req.body || {}) });
    delete newContent._id;
    await collection.updateOne({ _id: 'website_content' }, { $set: newContent }, { upsert: true });
    return json(res, 200, { success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return json(res, 500, { success: false, error: 'Database update failed' });
  }
}

async function handleGetMessages(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  if (!isAuthed(req)) return json(res, 401, { error: 'Unauthorized' });
  try {
    const db = await getDb();
    const collection = db.collection('messages');
    const messages = await collection.find({}).sort({ date: -1 }).toArray();
    return json(res, 200, { success: true, data: messages });
  } catch (error) {
    console.error('Database Error:', error);
    return json(res, 500, { success: false, error: 'Failed to retrieve messages' });
  }
}

async function handleUpdateMessageStatus(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!isAuthed(req)) return json(res, 401, { error: 'Unauthorized' });
  try {
    const { id, status } = req.body || {};
    if (!id || !status) return json(res, 400, { error: 'ID and Status required' });
    const db = await getDb();
    const collection = db.collection('messages');
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
    return json(res, 200, { success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Database Error:', error);
    return json(res, 500, { success: false, error: 'Failed to update message' });
  }
}

async function handleGetVisitors(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  if (!isAuthed(req)) return json(res, 401, { error: 'Unauthorized' });
  try {
    const db = await getDb();
    const collection = db.collection('visits');
    const visitors = await collection.countDocuments({});
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await collection.countDocuments({ lastSeenAt: { $gte: today.toISOString() } });
    return json(res, 200, { success: true, data: { visitors, todayVisitors } });
  } catch (error) {
    console.error('Failed to load visitors:', error);
    return json(res, 500, { success: false, error: 'Failed to load visitors' });
  }
}

async function handleSubmitMessage(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const { name, email, phone, message, source } = req.body || {};
    if (!name || !phone) return json(res, 400, { error: 'Name and phone are required' });
    const db = await getDb();
    const collection = db.collection('messages');
    const newMessage = {
      name,
      email: email || '',
      phone,
      message: message || '',
      source: source || (String(message || '').includes('Internship Application') ? 'internship' : 'consultation'),
      date: new Date().toISOString(),
      status: 'new'
    };
    await collection.insertOne(newMessage);
    return json(res, 200, { success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return json(res, 500, { success: false, error: 'Failed to send message' });
  }
}

async function handleTrackVisit(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const { sessionId, path } = req.body || {};
    if (!sessionId) return json(res, 400, { success: false, error: 'Session ID required' });
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
    return json(res, 200, { success: true });
  } catch (error) {
    console.error('Visit tracking failed:', error);
    return json(res, 500, { success: false, error: 'Failed to track visit' });
  }
}

async function handleLogin(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const { username, password } = req.body || {};
    const adminState = await getAdminState();
    if (username === adminState.adminId && password === adminState.password) {
      res.setHeader('Set-Cookie', `${AUTH_COOKIE}; Path=/; HttpOnly; Secure; Max-Age=86400; SameSite=Strict`);
      return json(res, 200, { success: true });
    }
    return json(res, 401, { success: false, error: 'Invalid credentials' });
  } catch (error) {
    return json(res, 500, { success: false, error: 'Server error' });
  }
}

async function handleLogout(req, res) {
  res.setHeader('Set-Cookie', `${AUTH_COOKIE.split(';')[0]}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict`);
  if (req.method === 'POST') return json(res, 200, { success: true });
  res.writeHead(302, { Location: '/admin/login.html' });
  res.end();
}

function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function makeToken() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function handleRequestPasswordReset(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const { email } = req.body || {};
    const adminState = await getAdminState();
    const requestedEmail = String(email || '').trim().toLowerCase();
    const configuredEmail = String(adminState.email || '').trim().toLowerCase();
    if (!requestedEmail || requestedEmail !== configuredEmail) {
      return json(res, 400, { success: false, error: 'Enter the admin recovery email.' });
    }
    const resetCode = makeCode();
    const resetToken = makeToken();
    const resetExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const resetLink = `/admin/login.html?reset=1&token=${encodeURIComponent(resetToken)}`;
    await updateAdminState({ resetCode, resetToken, resetExpiresAt });
    return json(res, 200, {
      success: true,
      message: 'Reset code generated. Use the code or the link to set a new password.',
      resetCode,
      resetLink,
      resetEmail: adminState.email
    });
  } catch (error) {
    console.error('Password reset request failed:', error);
    return json(res, 500, { success: false, error: 'Unable to create reset code' });
  }
}

async function handleResetPassword(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const { token, code, password } = req.body || {};
    const adminState = await getAdminState();
    const now = Date.now();
    const expiresAt = adminState.resetExpiresAt ? new Date(adminState.resetExpiresAt).getTime() : 0;
    if (!token || !code || !password) {
      return json(res, 400, { success: false, error: 'Missing reset details' });
    }
    if (!adminState.resetToken || !adminState.resetCode || adminState.resetToken !== token || adminState.resetCode !== code) {
      return json(res, 401, { success: false, error: 'Invalid reset code or link' });
    }
    if (!expiresAt || now > expiresAt) {
      return json(res, 400, { success: false, error: 'Reset code expired. Request a new one.' });
    }
    await updateAdminState({
      password,
      resetToken: '',
      resetCode: '',
      resetExpiresAt: null
    });
    return json(res, 200, { success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset failed:', error);
    return json(res, 500, { success: false, error: 'Unable to update password' });
  }
}

module.exports = async function(req, res) {
  const route = routePath(req);

  switch (route) {
    case 'get-content':
      return handleGetContent(req, res);
    case 'update-content':
      return handleUpdateContent(req, res);
    case 'get-messages':
      return handleGetMessages(req, res);
    case 'update-message-status':
      return handleUpdateMessageStatus(req, res);
    case 'get-visitors':
      return handleGetVisitors(req, res);
    case 'submit-message':
      return handleSubmitMessage(req, res);
    case 'track-visit':
      return handleTrackVisit(req, res);
    case 'login':
      return handleLogin(req, res);
    case 'logout':
      return handleLogout(req, res);
    case 'request-password-reset':
      return handleRequestPasswordReset(req, res);
    case 'reset-password':
      return handleResetPassword(req, res);
    default:
      return json(res, 404, { success: false, error: 'Not found' });
  }
};
