const { AUTH_COOKIE } = require('./admin-config');
const { getAdminState } = require('./admin-state');

module.exports = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    const adminState = await getAdminState();

    if (username === adminState.adminId && password === adminState.password) {
      // Set secure HTTP-only cookie, valid for 1 day
      res.setHeader('Set-Cookie', `${AUTH_COOKIE}; Path=/; HttpOnly; Secure; Max-Age=86400; SameSite=Strict`);
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
