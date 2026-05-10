import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Loading(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className='gradient-bg min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse'>
          <div className='mb-4 h-5 w-56 rounded bg-pink-100/70' aria-hidden='true' />
          <div className='mb-6 h-10 w-40 rounded bg-rose-100/60' aria-hidden='true' />

          <section className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12' aria-hidden='true'>
            <div className='space-y-4'>
              <div className='h-[420px] rounded-xl border border-gray-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 shadow-sm' />
              <div className='grid grid-cols-4 gap-3'>
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className='h-20 rounded-lg border border-gray-200 bg-white' />
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='h-9 w-4/5 rounded bg-pink-100/70' />
              <div className='h-5 w-2/5 rounded bg-rose-100/60' />
              <div className='h-8 w-1/3 rounded bg-pink-50 border border-pink-100' />
              <div className='h-20 w-full rounded border border-gray-200 bg-white' />
              <div className='h-12 w-full rounded-lg bg-pink-200/70' />
            </div>
          </section>

          <div className='mb-4 h-8 w-56 rounded bg-pink-100/70' aria-hidden='true' />
          <section className='grid grid-cols-2 md:grid-cols-4 gap-4' aria-hidden='true'>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className='rounded-xl border border-gray-200 bg-white p-3 space-y-3 shadow-sm'>
                <div className='h-36 rounded-lg bg-gradient-to-br from-white via-rose-50 to-pink-50' />
                <div className='h-4 w-3/4 rounded bg-pink-100/70' />
                <div className='h-4 w-1/3 rounded bg-rose-100/60' />
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
