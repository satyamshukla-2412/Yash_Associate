module.exports = function(req, res) {
  // Clear the cookie by setting Max-Age to 0
  res.setHeader('Set-Cookie', 'auth_token=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict');
  
  if (req.method === 'POST') {
    return res.status(200).json({ success: true });
  } else {
    // If accessed via GET, redirect to login page
    res.writeHead(302, { Location: '/admin/login.html' });
    res.end();
  }
}
