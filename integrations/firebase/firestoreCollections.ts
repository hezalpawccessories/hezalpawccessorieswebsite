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
   description: string
   details: string[]
   inStock: boolean
   rating: number
   reviews: number
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
