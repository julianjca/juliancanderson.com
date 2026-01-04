import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret token to prevent unauthorized revalidation
  const secret = req.query.secret || req.headers['x-revalidate-secret']

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Get path to revalidate (default to common pages)
  const path = req.query.path as string

  try {
    if (path) {
      // Revalidate specific path
      await res.revalidate(path)
      return res.json({ revalidated: true, path })
    }

    // Revalidate all main pages
    const paths = ['/', '/bookshelf', '/blog', '/uses']

    for (const p of paths) {
      try {
        await res.revalidate(p)
      } catch (err) {
        // Page might not exist, continue
      }
    }

    return res.json({ revalidated: true, paths })
  } catch (err) {
    return res.status(500).json({ message: 'Error revalidating', error: String(err) })
  }
}
