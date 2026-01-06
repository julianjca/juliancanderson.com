import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type GetServerSidePropsContext, type NextApiRequest, type NextApiResponse } from 'next'

// For getServerSideProps
export function createServerSupabaseClient(context: GetServerSidePropsContext) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return context.req.cookies[name]
        },
        set(name: string, value: string, options: CookieOptions) {
          context.res.setHeader('Set-Cookie', serializeCookie(name, value, options))
        },
        remove(name: string, options: CookieOptions) {
          context.res.setHeader('Set-Cookie', serializeCookie(name, '', { ...options, maxAge: 0 }))
        },
      },
    }
  )
}

function serializeCookie(name: string, value: string, options: CookieOptions): string {
  let cookie = `${name}=${encodeURIComponent(value)}`

  if (options.maxAge !== undefined) {
    cookie += `; Max-Age=${options.maxAge}`
  }
  if (options.domain) {
    cookie += `; Domain=${options.domain}`
  }
  if (options.path) {
    cookie += `; Path=${options.path}`
  } else {
    cookie += `; Path=/`
  }
  if (options.httpOnly) {
    cookie += `; HttpOnly`
  }
  if (options.secure) {
    cookie += `; Secure`
  }
  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`
  }

  return cookie
}

// For API routes
export function createClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name]
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', serializeCookie(name, value, options))
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', serializeCookie(name, '', { ...options, maxAge: 0 }))
        },
      },
    }
  )
}
