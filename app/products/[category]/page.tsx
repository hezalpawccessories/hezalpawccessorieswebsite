import { redirect } from 'next/navigation'

export default function CategoryRedirect({ params }: { params: { category: string } }) {
  const slug = params.category
  // Redirect to main products page with category as a query parameter.
  redirect(`/products?category=${encodeURIComponent(slug)}`)
}
