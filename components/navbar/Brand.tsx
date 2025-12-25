import { Building2 } from 'lucide-react';
import Link from 'next/link';

const Brand = () => {
  return (
    <div className='cursor-pointer'>
      <Link href='/' className='flex items-center gap-1'>
        <Building2 className="h-8 w-8 text-primary" />
        <h3 className="text-2xl font-bold text-primary">Synergy<span className='text-secondary'>Avenue</span></h3>
      </Link>
    </div>
  )
}

export default Brand