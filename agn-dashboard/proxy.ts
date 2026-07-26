import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Proxy: missing Supabase env vars', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
      });
      return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isLoginPage = path.startsWith('/login');
    const isPublicAuthRoute =
      path.startsWith('/auth/confirm') || path.startsWith('/reset-password');

    if (!user && !isLoginPage && !isPublicAuthRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user && isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  } catch (err) {
    console.error('Proxy error:', err);
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};