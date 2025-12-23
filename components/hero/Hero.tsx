import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const Hero = () => {
    return (<div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-r from-secondary to-primary text-white">
            <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Find Your Perfect
                        <span className="block text-accent">Shop Space</span>
                    </h1>
                    <p className="mt-6 text-xl text-primary-foreground">
                        Premium retail spaces in prime locations. Start your business journey with us today.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Button size="lg" variant="default" asChild className='hover:bg-primary/10'>
                            <a href="#available-rooms">Browse Rooms</a>
                        </Button>
                        <Button size="lg" variant="outline" className="text-primary hover:bg-primary/10" asChild>
                            <Link href="/about">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    </div>
    )
}

export default Hero