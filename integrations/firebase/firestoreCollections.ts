import { db } from './firebaseconfig'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore'

export interface SizePricing {
   size: string
   price: number
   originalPrice?: number
}

export interface Product {
   id: string
   title: string
   price: number
   originalPrice?: number
   sizePricing?: SizePricing[] // Array of size-based pricing
   image: string
   category: string
   collection?: string // New field for collections
   description: string
   details: string[]
   inStock: boolean
   onSale?: boolean // New field for sale status
   saleQuantity?: number // New field for sale quantity
   rating: number
   reviews: number
}

export interface Banner {
   id: string
   title: string
   subtitle: string
   description: string
   imageUrl: string
   linkUrl: string
   type: 'festival' | 'new-launch' | 'sale' | 'general'
   isActive: boolean
   createdAt: Date
   updatedAt: Date
}

export interface Collection {
   id: string
   name: string
   createdAt: Date
   updatedAt: Date
}

export interface Coupon {
   id: string
   name: string
   code: string
   discountType: 'percentage' | 'flat'
   discountValue: number
   applicableCategories: string[]
   applicableCollections: string[]
   isActive: boolean
   createdAt: Date
   updatedAt: Date
}

interface Order {
   id: string
   customerName: string
   email: string
   phone: string
   address: string
   items: any[]
   total: number
   status: 'Not Initiated' | 'Progress' | 'Completed'
   date: string
}

const productsCollection = collection(db, 'products')
const paymentsCollection = collection(db, 'payments')
const ordersCollection = collection(db, 'orders')
const bannersCollection = collection(db, 'banners')
const collectionsCollection = collection(db, 'collections')
const couponsCollection = collection(db, 'coupons')
const landingPageCollection = collection(db, 'landing page')

// export const addProduct = async (product: Product) => {
//    const docRef = await addDoc(productsCollection, product)
//    return docRef.id
// }

export const addProduct = async (product: Product) => {
   const docRef = doc(db, 'products', product.id) // Use your product's id as the document ID
   await setDoc(docRef, product)
   return product.id
}

export const getProducts = async () => {
   const snapshot = await getDocs(productsCollection)
   return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return { id: docSnap.id, ...data } as Product
   })
}

export const updateProduct = async (id: string, updatedData: Partial<Product>) => {
   const docRef = doc(db, 'products', id)
   await updateDoc(docRef, updatedData)
}

export const deleteProduct = async (id: string) => {
   const docRef = doc(db, 'products', id)
   await deleteDoc(docRef)
}

// Banner management functions
export const addBanner = async (banner: Banner) => {
   const docRef = doc(db, 'banners', banner.id)
   await setDoc(docRef, banner)
   return banner.id
}

export const getBanners = async () => {
   const snapshot = await getDocs(bannersCollection)
   return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return { 
         id: docSnap.id, 
         ...data,
         createdAt: data.createdAt?.toDate?.() || new Date(),
         updatedAt: data.updatedAt?.toDate?.() || new Date()
      } as Banner
   })
}

export const updateBanner = async (id: string, updatedData: Partial<Banner>) => {
   const docRef = doc(db, 'banners', id)
   await updateDoc(docRef, { ...updatedData, updatedAt: new Date() })
}

export const deleteBanner = async (id: string) => {
   const docRef = doc(db, 'banners', id)
   await deleteDoc(docRef)
}

// Collection management functions
export const addCollection = async (collection: Collection) => {
   const docRef = doc(db, 'collections', collection.id)
   await setDoc(docRef, collection)
   return collection.id
}

export const getCollections = async () => {
   const snapshot = await getDocs(collectionsCollection)
   return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return { 
         id: docSnap.id, 
         ...data,
         createdAt: data.createdAt?.toDate?.() || new Date(),
         updatedAt: data.updatedAt?.toDate?.() || new Date()
      } as Collection
   })
}

export const updateCollection = async (id: string, updatedData: Partial<Collection>) => {
   const docRef = doc(db, 'collections', id)
   await updateDoc(docRef, { ...updatedData, updatedAt: new Date() })
}

export const deleteCollection = async (id: string) => {
   const docRef = doc(db, 'collections', id)
   await deleteDoc(docRef)
}

// Coupon management functions
export const addCoupon = async (coupon: Coupon) => {
   const docRef = doc(db, 'coupons', coupon.id)
   await setDoc(docRef, coupon)
   return coupon.id
}

export const getCoupons = async () => {
   const snapshot = await getDocs(couponsCollection)
   return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return { 
         id: docSnap.id, 
         ...data,
         createdAt: data.createdAt?.toDate?.() || new Date(),
         updatedAt: data.updatedAt?.toDate?.() || new Date()
      } as Coupon
   })
}

export const updateCoupon = async (id: string, updatedData: Partial<Coupon>) => {
   const docRef = doc(db, 'coupons', id)
   await updateDoc(docRef, { ...updatedData, updatedAt: new Date() })
}

export const deleteCoupon = async (id: string) => {
   const docRef = doc(db, 'coupons', id)
   await deleteDoc(docRef)
}

// Landing page management functions
export interface LandingPageRecord {
   id: string
   url: string
   createdAt: Date
}


// Use a fixed doc id for landing image
export const LANDING_MAIN_DOC_ID = 'main';

export const setLandingMain = async (url: string) => {
   const docRef = doc(db, 'landing page', LANDING_MAIN_DOC_ID);
   const landing: LandingPageRecord = {
      id: LANDING_MAIN_DOC_ID,
      url,
      createdAt: new Date(),
   };
   await setDoc(docRef, landing);
   return LANDING_MAIN_DOC_ID;
};

export const getLandingMain = async (): Promise<LandingPageRecord | null> => {
   const snap = await getDocs(landingPageCollection);
   const docs = snap.docs.filter(d => d.id === LANDING_MAIN_DOC_ID);
   if (docs.length === 0) return null;
   const data = docs[0].data();
   return {
      id: docs[0].id,
      url: data.url || '',
      createdAt: data.createdAt?.toDate?.() || new Date(),
   };
};
