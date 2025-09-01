import { redirect } from 'next/navigation'

export default async function CategoryRedirect({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  // Redirect to main products page with category as a query parameter.
  redirect(`/products?category=${encodeURIComponent(category)}`)
}
