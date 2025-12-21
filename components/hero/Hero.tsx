import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const Hero = () => {
    return (<div className="min-h-screen bg-linear-to-b">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-r from-secondary to-secondary/80 text-white">
            <div className="absolute inset-0 bg-grid-white/10" />
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

            {/* Decorative wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F3E8FF" />
                </svg>
            </div>
        </section>
    </div>
    )
}

export default Hero