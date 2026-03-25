import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, MapPin, Calendar } from "lucide-react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { cn } from "@/src/lib/utils";

const mockCommunityPlans = [
  { id: "tokyo-1", name: "Tokyo, Japan", dates: "Apr 12 - Apr 20, 2026", theme: "Nightlife", themeColor: "bg-core-blue", image: "https://picsum.photos/seed/tokyo/800/600" },
  { id: "paris-1", name: "Paris, France", dates: "May 5 - May 12, 2026", theme: "Historical", themeColor: "bg-deep-navy", image: "https://picsum.photos/seed/paris/800/600" },
  { id: "bali-1", name: "Bali, Indonesia", dates: "Jun 10 - Jun 20, 2026", theme: "Beaches", themeColor: "bg-core-blue", image: "https://picsum.photos/seed/bali/800/600" },
  { id: "swiss-1", name: "Swiss Alps", dates: "Jul 1 - Jul 10, 2026", theme: "Adventure", themeColor: "bg-primary-red", image: "https://picsum.photos/seed/alps/800/600" },
  { id: "nyc-1", name: "New York, USA", dates: "Aug 15 - Aug 22, 2026", theme: "Shopping", themeColor: "bg-accent-yellow", image: "https://picsum.photos/seed/nyc/800/600" },
  { id: "rome-1", name: "Rome, Italy", dates: "Sep 10 - Sep 18, 2026", theme: "Historical", themeColor: "bg-deep-navy", image: "https://picsum.photos/seed/rome/800/600" },
  { id: "kyoto-1", name: "Kyoto, Japan", dates: "Oct 5 - Oct 12, 2026", theme: "Culture", themeColor: "bg-fresh-green", image: "https://picsum.photos/seed/kyoto/800/600" },
  { id: "london-1", name: "London, UK", dates: "Nov 1 - Nov 8, 2026", theme: "Nightlife", themeColor: "bg-core-blue", image: "https://picsum.photos/seed/london/800/600" },
];

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("All");

  const themes = ["All", "Historical", "Adventure", "Culture", "Beaches", "Wildlife", "Nightlife", "Gram", "Shopping"];

  const filteredPlans = mockCommunityPlans.filter(plan => 
    (selectedTheme === "All" || plan.theme === selectedTheme) &&
    plan.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="mb-12">
          <span className="text-fresh-green text-[13px] font-bold uppercase tracking-widest">Community Plans</span>
          <h2 className="text-deep-navy text-4xl font-bold mt-4">Trips planned by fellow travelers</h2>
          <p className="text-muted-text mt-2">Get inspired — then plan your own.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-60 shrink-0 space-y-8">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-deep-navy mb-4">Filters</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted-text mb-2">Destination Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-border-light rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-red"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-text mb-2">Themes</label>
                  <div className="space-y-2">
                    {themes.map(theme => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                          selectedTheme === theme ? "bg-primary-red text-white font-bold" : "text-muted-text hover:bg-gray-100"
                        )}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((trip) => (
                <motion.div
                  key={trip.id}
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-[3/4] rounded-card overflow-hidden group cursor-pointer border-2 border-transparent hover:border-accent-yellow transition-all shadow-sm"
                >
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 right-4">
                    <span className={cn(trip.themeColor, "text-white text-[10px] font-bold px-2 py-1 rounded-pill uppercase")}>
                      {trip.theme}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="font-bold text-lg">{trip.name}</h3>
                    <div className="flex items-center gap-2 text-white/70 text-xs mt-1">
                      <Calendar className="w-3 h-3" />
                      {trip.dates}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-text">No plans found matching your filters.</p>
              </div>
            )}

            <div className="mt-12 text-center">
              <button className="px-8 py-3 rounded-pill border border-core-blue text-core-blue font-bold hover:bg-core-blue hover:text-white transition-all">
                Load More Plans
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
