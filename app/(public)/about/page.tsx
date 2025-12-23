import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AboutPage = () => {
    return (
        <div className='min-h-screen'>
            <div className='container mx-auto'>
                <h1 className='text-4xl font-bold text-center mt-20 text-primary'>About Synergy<span className='text-secondary'>Avenue</span></h1>
                <p className='mt-6 text-lg text-accent text-center px-4'>
                    SynergyAvenue is dedicated to providing premium retail spaces for businesses to thrive. Our mission is to connect entrepreneurs with the perfect locations to help their ventures succeed.
                </p>
                <div className='flex justify-center my-7'>
                    <Button size="lg" variant="default" className="text-white hover:bg-primary/50" asChild>
                        <Link href="/rooms">Browse Rooms</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AboutPage