import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Rocket, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-height-[100vh] bg-off-white flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-fresh-green text-white px-3 py-1 rounded-pill text-[12px] font-bold uppercase tracking-wider">
            Free · No Sign-up Required
          </div>
          
          <h1 className="text-deep-navy text-5xl md:text-7xl font-bold leading-tight">
            Your Perfect Trip,<br />
            <span className="text-primary-red italic font-bold">Built For You</span>
          </h1>

          <p className="text-muted-text text-lg max-w-lg leading-relaxed">
            Effortlessly plan personalized itineraries that match your travel style, budget, and time — completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link
              to="/create"
              className="bg-primary-red text-white px-8 py-4 rounded-pill font-bold text-lg hover:bg-[#C1121F] hover:scale-105 transition-all shadow-red"
            >
              🚀 Start Planning — It's Free
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 text-[12px] text-[#9CA3AF]">
            {["No account needed", "No credit card", "Instant results"].map((text) => (
              <div key={text} className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-fresh-green/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-fresh-green" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* SVG Illustration Placeholder */}
          <div className="relative w-full aspect-square flex items-center justify-center">
            <motion.div className="animate-float relative z-10">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Balloon Body */}
                <path d="M200 40C130 40 80 90 80 160C80 230 140 280 200 320C260 280 320 230 320 160C320 90 270 40 200 40Z" fill="url(#balloonGradient)" />
                {/* Basket */}
                <rect x="180" y="330" width="40" height="30" rx="4" fill="#1D3557" />
                {/* Ropes */}
                <path d="M100 180L180 330M300 180L220 330" stroke="#1D3557" strokeWidth="2" strokeDasharray="4 4" />
                {/* Silhouettes */}
                <circle cx="190" cy="325" r="6" fill="#1D3557" />
                <circle cx="210" cy="325" r="6" fill="#1D3557" />
                
                <defs>
                  <linearGradient id="balloonGradient" x1="200" y1="40" x2="200" y2="320" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E63946" />
                    <stop offset="1" stopColor="#C1121F" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            
            {/* Clouds */}
            <motion.div 
              animate={{ x: [-20, 20, -20] }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 -left-10 opacity-30"
            >
              <svg width="100" height="60" viewBox="0 0 100 60" fill="#E9ECEF">
                <circle cx="20" cy="40" r="20" />
                <circle cx="50" cy="30" r="30" />
                <circle cx="80" cy="40" r="20" />
              </svg>
            </motion.div>

            <div className="absolute top-1/4 right-0 w-32 h-32 bg-gray-200/50 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-primary-red/5 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
