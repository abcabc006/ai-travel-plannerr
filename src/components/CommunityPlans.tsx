import { motion } from "motion/react";
import { Link } from "react-router-dom";

const mockTrips = [
  { id: 1, name: "Tokyo, Japan", dates: "Apr 12 - Apr 20, 2026", theme: "Nightlife", color: "bg-core-blue", image: "https://picsum.photos/seed/tokyo/800/600" },
  { id: 2, name: "Paris, France", dates: "May 5 - May 12, 2026", theme: "Historical", color: "bg-deep-navy", image: "https://picsum.photos/seed/paris/800/600" },
  { id: 3, name: "Bali, Indonesia", dates: "Jun 10 - Jun 20, 2026", theme: "Beaches", color: "bg-core-blue", image: "https://picsum.photos/seed/bali/800/600" },
  { id: 4, name: "Swiss Alps", dates: "Jul 1 - Jul 10, 2026", theme: "Adventure", color: "bg-primary-red", image: "https://picsum.photos/seed/alps/800/600" },
];

export default function CommunityPlans() {
  return (
    <section className="py-24 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-fresh-green text-[13px] font-bold uppercase tracking-widest">Community Plans</span>
            <h2 className="text-deep-navy text-4xl font-bold mt-4">Trips planned by fellow travelers</h2>
            <p className="text-muted-text mt-2">Get inspired — then plan your own.</p>
          </div>
          <Link to="/community" className="text-primary-red font-bold hover:underline flex items-center gap-1">
            Browse All Plans →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockTrips.map((trip) => (
            <motion.div
              key={trip.id}
              whileHover={{ scale: 1.03 }}
              className="relative aspect-[3/4] rounded-card overflow-hidden group cursor-pointer border-2 border-transparent hover:border-accent-yellow transition-all"
            >
              <img
                src={trip.image}
                alt={trip.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-4 right-4">
                <span className={trip.color + " text-white text-[10px] font-bold px-2 py-1 rounded-pill uppercase"}>
                  {trip.theme}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-bold text-lg">{trip.name}</h3>
                <p className="text-white/70 text-xs mt-1">{trip.dates}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
