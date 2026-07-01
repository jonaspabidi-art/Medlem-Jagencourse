import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Next.js 16 renamed `middleware.ts`/`middleware()` to `proxy.ts`/`proxy()`.
// This still does the same job: refresh the Supabase session cookie on every
// matched request, then redirect based on auth/admin state. Each protected
// route (page or API handler) must ALSO verify the session itself — this is
// only the optimistic, first line of defense (see lib/supabase/server.ts usages).

const PUBLIC_PATHS = new Set(['/login'])

function isProtectedPath(pathname: string) {
  if (pathname === '/') return true
  if (pathname.startsWith('/lektion')) return true
  if (pathname.startsWith('/admin')) return true
  if (pathname.startsWith('/api/lessons')) return true
  if (pathname.startsWith('/api/admin')) return true
  return false
}

function isAdminPath(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() (not getSession()) revalidates the token against
  // Supabase Auth on every request — this is what actually refreshes the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && PUBLIC_PATHS.has(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user && isAdminPath(pathname)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
