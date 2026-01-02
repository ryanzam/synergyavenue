import Brand from './Brand'
import { User } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => {
    return (
        <nav className="w-full">
            <div className='p-3 border-b'>
                <div className='flex items-center justify-between'>
                    <Brand />

                    <Link href={"/login"} className='cursor-pointer border rounded-2xl border-gray-400 p-1 text-gray-500 hover:bg-primary'>
                        <User />
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar