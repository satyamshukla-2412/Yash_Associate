export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  
  // By default /admin should point to /admin/index.html
  if (url.pathname === '/admin') {
    url.pathname = '/admin/index.html';
  }

  // Allow access to the login page and its assets
  if (url.pathname === '/admin/login.html' || url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.includes('/ASSETS/')) {
    // If user is already logged in and tries to access login.html, redirect to dashboard
    const cookies = request.headers.get('cookie') || '';
    if (url.pathname === '/admin/login.html' && cookies.includes('auth_token=yash_secure_token_xyz123')) {
      url.pathname = '/admin/index.html';
      return Response.redirect(url, 302);
    }
    return;
  }

  // Check for the authentication cookie for all other /admin routes
  const cookieHeader = request.headers.get('cookie') || '';
  if (!cookieHeader.includes('auth_token=yash_secure_token_xyz123')) {
    // Redirect to login page if not authenticated
    url.pathname = '/admin/login.html';
    return Response.redirect(url, 302);
  }

  // User is authenticated, allow request
  return;
}
