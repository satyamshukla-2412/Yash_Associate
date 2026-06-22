const { updateAdminState, getAdminState } = require('./admin-state');

function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function makeToken() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

module.exports = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    const adminState = await getAdminState();
    const requestedEmail = String(email || '').trim().toLowerCase();
    const configuredEmail = String(adminState.email || '').trim().toLowerCase();

    if (!requestedEmail || requestedEmail !== configuredEmail) {
      return res.status(400).json({ success: false, error: 'Enter the admin recovery email.' });
    }

    const resetCode = makeCode();
    const resetToken = makeToken();
    const resetExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const resetLink = `/admin/login.html?reset=1&token=${encodeURIComponent(resetToken)}`;

    await updateAdminState({ resetCode, resetToken, resetExpiresAt });

    return res.status(200).json({
      success: true,
      message: 'Reset code generated. Use the code or the link to set a new password.',
      resetCode,
      resetLink,
      resetEmail: adminState.email
    });
  } catch (error) {
    console.error('Password reset request failed:', error);
    return res.status(500).json({ success: false, error: 'Unable to create reset code' });
  }
};
