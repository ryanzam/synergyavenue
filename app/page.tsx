import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import RoomCard from "@/components/room/RoomCard";
import { Button } from "@/components/ui/button";
import { rooms } from "@/data";

export default function Home() {
  return (
    <div className="min-h-screen dark:bg-black">
      <Navbar />

      <Hero />

      {/* Stats Section */}
      <section className="py-12 bg-foreground/5">
        <div className="container mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">{5}</div>
              <div className="mt-2 text-accent">Available Spaces</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="mt-2 text-accent">Tenant Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="mt-2 text-accent">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Rooms Section */}
      <section id="available-rooms" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary">Available Shop Spaces</h2>
            <p className="mt-4 text-xl text-accent">
              Choose from our selection of premium retail locations
            </p>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No rooms available at the moment.</p>
              <p className="mt-2 text-gray-400">Check back soon for new listings!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-secondary to-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold">Ready to Start Your Business?</h2>
          <p className="mt-4 text-xl text-blue-100">
            Apply now and get a response within 48 hours
          </p>
          <Button size="lg" variant="default" className="mt-8 hover:bg-primary/50" asChild>
            <a href="#available-rooms">Apply Today</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
