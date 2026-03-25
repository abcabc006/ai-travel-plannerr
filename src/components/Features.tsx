import { motion } from "motion/react";
import { Star, Utensils, Sparkles, Landmark, Map as MapIcon, Clock, Cpu, Wallet, Link as LinkIcon, Plane, Hotel, Ticket } from "lucide-react";
import { cn } from "@/src/lib/utils";

const features = [
  {
    icon: Star,
    title: "Top Spots Unveiled",
    description: "Discover the must-see attractions and hidden gems at your destination, curated for your travel theme.",
    color: "yellow",
    glow: "rgba(244,162,97,0.15)"
  },
  {
    icon: Utensils,
    title: "Foodie Hotspots",
    description: "Find the best local eats — from street food stalls to fine dining — matched to your food preferences.",
    color: "red",
    glow: "rgba(230,57,70,0.15)"
  },
  {
    icon: Sparkles,
    title: "Prime Experiences",
    description: "Curated activities beyond sightseeing — cultural shows, adventure sports, local workshops, sunset spots.",
    color: "blue",
    glow: "rgba(69,123,157,0.15)"
  },
  {
    icon: Landmark,
    title: "City & Country Guides",
    description: "Rich destination overviews — weather, local customs, transport tips, currency, and safety notes.",
    color: "navy",
    glow: "rgba(29,53,87,0.15)"
  },
  {
    icon: MapIcon,
    title: "Tailored Itineraries",
    description: "Complete day-by-day schedules with Morning / Afternoon / Evening / Night breakdowns, balanced for pace, theme, and your personal preferences.",
    color: "green",
    glow: "rgba(42,157,143,0.15)",
    large: true,
    badges: ["Multi-city ✓", "Custom dates ✓", "Theme-based ✓"]
  },
  {
    icon: Clock,
    title: "Optimal Timing",
    description: "Smart scheduling that avoids crowds, accounts for travel time between spots, and fits everything into your day without rushing.",
    color: "blue",
    glow: "rgba(69,123,157,0.15)"
  },
  {
    icon: Cpu,
    title: "Smart Travel Optimization",
    description: "AI continuously balances your must-sees, hidden gems, budget, and downtime to maximize every hour of your trip.",
    color: "red",
    glow: "rgba(230,57,70,0.15)"
  },
  {
    icon: Wallet,
    title: "Expense Tracking",
    description: "Visual budget breakdown across Accommodation, Food, Activities, Transport, and Contingency — with estimated cost ranges per category.",
    color: "yellow",
    glow: "rgba(244,162,97,0.15)",
    preview: true
  },
  {
    icon: LinkIcon,
    title: "Aggregated Booking Links",
    description: "One-click access to metasearched deals across all major platforms — no tab-hopping required. We surface the best prices across booking providers so you save time and money.",
    color: "navy",
    glow: "rgba(29,53,87,0.15)",
    full: true,
    bookingPills: [
      { icon: Plane, label: "Flights", color: "bg-core-blue" },
      { icon: Hotel, label: "Hotels", color: "bg-primary-red" },
      { icon: Ticket, label: "Activities", color: "bg-fresh-green" }
    ]
  }
];

const colorMap: any = {
  yellow: "text-accent-yellow bg-accent-yellow/10 border-accent-yellow",
  red: "text-primary-red bg-primary-red/10 border-primary-red",
  blue: "text-core-blue bg-core-blue/10 border-core-blue",
  navy: "text-deep-navy bg-deep-navy/10 border-deep-navy",
  green: "text-fresh-green bg-fresh-green/10 border-fresh-green"
};

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-primary-red text-[13px] font-bold uppercase tracking-widest">What's Included</span>
          <h2 className="text-deep-navy text-4xl font-bold mt-4">Everything you need, nothing you don't</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "bg-white p-8 rounded-[20px] border border-border-light shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card group",
                feature.large && "lg:col-span-2",
                feature.full && "lg:col-span-4"
              )}
              style={{ '--hover-glow': feature.glow } as any}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:ring-8",
                colorMap[feature.color].split(' ').slice(0, 2).join(' '),
                `group-hover:ring-[${feature.glow}]`
              )}>
                <feature.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-text text-sm leading-relaxed mb-6">
                {feature.description}
              </p>

              {feature.badges && (
                <div className="flex flex-wrap gap-2">
                  {feature.badges.map(badge => (
                    <span key={badge} className="px-3 py-1 rounded-pill border border-fresh-green text-fresh-green text-[12px] font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {feature.preview && (
                <div className="space-y-2 mt-4">
                  {[
                    { color: "bg-core-blue", w: "70%" },
                    { color: "bg-accent-yellow", w: "45%" },
                    { color: "bg-fresh-green", w: "60%" },
                    { color: "bg-primary-red", w: "30%" }
                  ].map((bar, i) => (
                    <div key={i} className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", bar.color)} style={{ width: bar.w }} />
                    </div>
                  ))}
                </div>
              )}

              {feature.bookingPills && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {feature.bookingPills.map(pill => (
                    <div key={pill.label} className={cn("flex items-center gap-2 px-4 py-2 rounded-pill text-white text-sm font-medium", pill.color)}>
                      <pill.icon className="w-4 h-4" />
                      {pill.label}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
