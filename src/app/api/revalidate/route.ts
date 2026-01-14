import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get('secret') ||
    request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  const path = request.nextUrl.searchParams.get('path')

  try {
    if (path) {
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    }

    // Revalidate all main pages
    const paths = ['/', '/bookshelf', '/blog', '/uses']

    for (const p of paths) {
      try {
        revalidatePath(p)
      } catch {
        // Page might not exist, continue
      }
    }

    return NextResponse.json({ revalidated: true, paths })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    )
  }
}
