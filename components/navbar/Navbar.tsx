import Container from '../Container'
import Brand from './Brand'
import { Button } from '../ui/button'
import { User } from 'lucide-react'

const Navbar = () => {
    return (
        <nav className="w-full">
            <div className='py-3 border-b'>
                <Container>
                    <div className='flex items-center justify-between'>
                        <Brand />

                        <Button variant="outline" size="icon" className='cursor-pointer'>
                            <User />
                        </Button>
                    </div>
                </Container>
            </div>
        </nav>
    )
}

export default Navbar