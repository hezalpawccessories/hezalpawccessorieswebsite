import HomeClient from './HomeClient'
import { getLandingMainServer } from '@/integrations/firebase/firestoreCollections'

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60

export default async function Home() {
   const record = await getLandingMainServer()
   const landingImageUrl = record?.url || null
   return <HomeClient landingImageUrl={landingImageUrl} />
}



