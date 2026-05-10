import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Loading(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className='gradient-bg min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse'>
          <div className='mb-8 h-10 w-64 rounded bg-pink-100/70' aria-hidden='true' />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <section className='lg:col-span-2 space-y-4' aria-hidden='true'>
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className='rounded-xl bg-white border border-gray-200 p-4 flex items-center gap-4 shadow-sm'>
                  <div className='h-20 w-20 rounded-lg bg-gradient-to-br from-white via-rose-50 to-pink-50 border border-gray-100' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 w-3/4 rounded bg-pink-100/70' />
                    <div className='h-4 w-1/3 rounded bg-rose-100/60' />
                  </div>
                  <div className='h-9 w-20 rounded bg-pink-200/70' />
                </div>
              ))}
            </section>
            <aside className='rounded-xl bg-white border border-gray-200 p-4 space-y-3 h-fit shadow-sm' aria-hidden='true'>
              <div className='h-5 w-1/2 rounded bg-pink-100/70' />
              <div className='h-4 w-full rounded bg-rose-50 border border-pink-100' />
              <div className='h-4 w-4/5 rounded bg-pink-50 border border-gray-100' />
              <div className='h-10 w-full rounded-lg bg-pink-200/70' />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
