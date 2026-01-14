import { Subscribe, Header } from '@/components'
import { PageLayout } from '../components/PageLayout'

import 'react-toggle/style.css'

export const metadata = {
  title: 'Subscribe',
  description: 'Subscribe to updates from Julian Christian Anderson',
}

export default function SubscribePage() {
  return (
    <PageLayout>
      <Header />
      <Subscribe subscribePage />
    </PageLayout>
  )
}
