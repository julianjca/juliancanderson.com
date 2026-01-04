import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentlyItems } from '@/lib/notion'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const items = await getCurrentlyItems()

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json(items)
  } catch (error) {
    console.error('Error fetching currently items:', error)
    return res.status(500).json({ error: 'Failed to fetch items' })
  }
}
