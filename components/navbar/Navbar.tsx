import Brand from './Brand'
import { Button } from '../ui/button'
import { User } from 'lucide-react'

const Navbar = () => {
    return (
        <nav className="w-full">
            <div className='p-3 border-b'>
                <div className='flex items-center justify-between'>
                    <Brand />

                    <Button variant="outline" size="icon" className='cursor-pointer hover:text-white'>
                        <User />
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar