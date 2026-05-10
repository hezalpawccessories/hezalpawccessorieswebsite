import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function ProductCardSkeleton({ index }: { index: number }): JSX.Element {
  return (
    <div
      className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm shadow-gray-200/60 animate-pulse'
      aria-hidden='true'
      key={index}
    >
      <div className='relative h-64 sm:h-64 bg-gradient-to-br from-white via-rose-50 to-pink-50'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(253,242,248,0.95),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(252,231,243,0.9),_transparent_24%)]' aria-hidden='true' />
        <div className='absolute top-3 left-3 h-5 w-14 rounded-full bg-pink-100/70' />
        <div className='absolute top-3 right-3 h-5 w-14 rounded-full bg-rose-100/70' />
      </div>
      <div className='p-3 sm:p-5 space-y-3'>
        <div className='h-4 sm:h-5 w-3/4 rounded bg-pink-100/80' />
        <div className='h-4 w-1/3 rounded bg-rose-100/80' />
        <div className='h-8 w-full rounded-lg bg-pink-200/70' />
      </div>
    </div>
  )
}

export default function Loading(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className='gradient-bg min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-8 h-12 rounded-xl border border-pink-100 bg-white shadow-sm shadow-gray-100 animate-pulse' aria-hidden='true' />
          <div className='text-center mb-8 space-y-3'>
            <div className='mx-auto h-8 w-72 rounded bg-pink-100/70 animate-pulse' aria-hidden='true' />
            <div className='mx-auto h-5 w-96 max-w-full rounded bg-rose-50 border border-pink-100 animate-pulse' aria-hidden='true' />
          </div>
          <div className='mb-6 h-12 rounded-lg border border-gray-200 bg-white shadow-sm animate-pulse' aria-hidden='true' />
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-12'>
            {Array.from({ length: 8 }, (_, index) => (
              <ProductCardSkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
