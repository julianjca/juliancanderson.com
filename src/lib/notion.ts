import { Client } from '@notionhq/client'
import type { CurrentlyItem } from '@/components/Currently'

type NotionPropertyValue = {
  type: string
  title?: Array<{ plain_text: string }>
  select?: { name: string } | null
  rich_text?: Array<{ plain_text: string }>
  url?: string | null
  number?: number | null
  checkbox?: boolean
  date?: { start: string } | null
}

type NotionPage = {
  properties: Record<string, NotionPropertyValue>
}

export interface BookItem {
  title: string
  author: string
  status: 'reading' | 'completed' | 'want-to-read'
  rating: number | null
  cover: string | null
  link: string | null
  notes: string | null
  dateFinished: string | null
}

export interface UsesItem {
  name: string
  category: string
  description: string | null
  link: string | null
  icon: string | null
}

export interface UsesCategory {
  name: string
  items: UsesItem[]
}

export async function getCurrentlyItems(): Promise<CurrentlyItem[]> {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_CURRENTLY_DATABASE_ID

  if (!apiKey || !databaseId) {
    return []
  }

  try {
    const notion = new Client({ auth: apiKey })
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Active',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    })

    return response.results.map((page: unknown) => {
      const properties = (page as NotionPage).properties

      const title = properties.Title?.title?.[0]?.plain_text || 'Untitled'
      const type =
        (properties.Type?.select?.name?.toLowerCase() as CurrentlyItem['type']) ||
        'reading'
      const subtitle = properties.Subtitle?.rich_text?.[0]?.plain_text ?? null
      const link = properties.Link?.url ?? null
      const progress = properties.Progress?.number ?? null

      return {
        type,
        title,
        subtitle,
        link,
        progress,
      }
    })
  } catch (error) {
    console.error('Error fetching from Notion:', error)
    return []
  }
}

export async function getBookshelfItems(): Promise<BookItem[]> {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_BOOKSHELF_DATABASE_ID

  if (!apiKey || !databaseId) {
    return []
  }

  try {
    const notion = new Client({ auth: apiKey })
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        { property: 'Status', direction: 'ascending' },
        { property: 'Order', direction: 'ascending' },
      ],
    })

    return response.results.map((page: unknown) => {
      const properties = (page as NotionPage).properties

      return {
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        author: properties.Author?.rich_text?.[0]?.plain_text || 'Unknown',
        status:
          (properties.Status?.select?.name
            ?.toLowerCase()
            .replace(' ', '-') as BookItem['status']) || 'want-to-read',
        rating: properties.Rating?.number ?? null,
        cover: properties.Cover?.url ?? null,
        link: properties.Link?.url ?? null,
        notes: properties.Notes?.rich_text?.[0]?.plain_text ?? null,
        dateFinished: properties['Date Finished']?.date?.start ?? null,
      }
    })
  } catch (error) {
    console.error('Error fetching bookshelf from Notion:', error)
    return []
  }
}

export async function getUsesItems(): Promise<UsesCategory[]> {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_USES_DATABASE_ID

  if (!apiKey || !databaseId) {
    return []
  }

  try {
    const notion = new Client({ auth: apiKey })
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        { property: 'Category', direction: 'ascending' },
        { property: 'Order', direction: 'ascending' },
      ],
    })

    const items = response.results.map((page: unknown) => {
      const properties = (page as NotionPage).properties

      return {
        name: properties.Name?.title?.[0]?.plain_text || 'Untitled',
        category: properties.Category?.select?.name || 'Other',
        description: properties.Description?.rich_text?.[0]?.plain_text ?? null,
        link: properties.Link?.url ?? null,
        icon: properties.Icon?.url ?? null,
      }
    })

    const categoryMap = new Map<string, UsesItem[]>()
    items.forEach((item) => {
      const existing = categoryMap.get(item.category) || []
      existing.push(item)
      categoryMap.set(item.category, existing)
    })

    return Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      items,
    }))
  } catch (error) {
    console.error('Error fetching uses from Notion:', error)
    return []
  }
}
