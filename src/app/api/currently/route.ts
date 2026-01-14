import { NextResponse } from 'next/server'
import { getCurrentlyItems } from '@/lib/notion'

export async function GET() {
  try {
    const items = await getCurrentlyItems()

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching currently items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}
