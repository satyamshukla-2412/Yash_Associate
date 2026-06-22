const { getAdminState, updateAdminState } = require('./admin-state');

module.exports = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, code, password } = req.body || {};
    const adminState = await getAdminState();
    const now = Date.now();
    const expiresAt = adminState.resetExpiresAt ? new Date(adminState.resetExpiresAt).getTime() : 0;

    if (!token || !code || !password) {
      return res.status(400).json({ success: false, error: 'Missing reset details' });
    }

    if (!adminState.resetToken || !adminState.resetCode || adminState.resetToken !== token || adminState.resetCode !== code) {
      return res.status(401).json({ success: false, error: 'Invalid reset code or link' });
    }

    if (!expiresAt || now > expiresAt) {
      return res.status(400).json({ success: false, error: 'Reset code expired. Request a new one.' });
    }

    await updateAdminState({
      password,
      resetToken: '',
      resetCode: '',
      resetExpiresAt: null
    });

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset failed:', error);
    return res.status(500).json({ success: false, error: 'Unable to update password' });
  }
};
