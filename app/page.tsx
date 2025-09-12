import HomeClient from './HomeClient'
import { getLandingMainServer } from '@/integrations/firebase/firestoreCollections'

export default async function Home() {
   const record = await getLandingMainServer()
   const landingImageUrl = record?.url || null
   return <HomeClient landingImageUrl={landingImageUrl} />
}



