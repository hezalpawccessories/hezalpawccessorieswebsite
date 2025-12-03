import NewLayout from './newlayout'
import { getLandingMainServer } from '@/integrations/firebase/firestoreCollections'

export default async function TestPage() {
  const record = await getLandingMainServer()
     const landingImageUrl = record?.url || null
  return <NewLayout landingImageUrl={landingImageUrl} />
}
