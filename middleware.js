export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

export default function middleware(request) {
  const basicAuth = request.headers.get('authorization');
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const decodedValue = atob(authValue);
    const [user, pwd] = decodedValue.split(':');
    
    // Login Credentials
    if (user === 'admin' && pwd === 'Yash@2026') {
      return; // Authentication successful, let the request pass through
    }
  }

  // If not authenticated, prompt for credentials
  return new Response('Authentication required to access the Admin Panel.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Admin Area"'
    }
  });
}
