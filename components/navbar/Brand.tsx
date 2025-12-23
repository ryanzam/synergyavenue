import Link from 'next/link';

const Brand = () => {
  return (
    <div className='cursor-pointer'>
      <Link href='/'>
        <h3 className="text-2xl font-bold">Synergy<span className='text-secondary'>Avenue</span></h3>
      </Link>
    </div>
  )
}

export default Brand