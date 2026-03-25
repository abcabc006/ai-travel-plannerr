import { Link, useLocation } from "react-router-dom";
import { MapPin, Rocket, Activity } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const isScrolled = false; // In a real app, we'd use a scroll hook

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-light transition-all duration-300",
      isScrolled && "backdrop-blur-header bg-white/80 shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="text-primary-red w-6 h-6" />
            <span className="font-display italic font-bold text-2xl text-deep-navy">Start2Destiny</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["How it Works", "Features", "Community Plans"].map((item) => (
              <Link
                key={item}
                to={item === "Community Plans" ? "/community" : "/#"}
                className="text-sm font-medium text-muted-text hover:text-core-blue transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-core-blue transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-api-diagnostics'))}
              className="text-sm font-medium text-muted-text hover:text-primary-red transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              API Status
            </button>
          </div>

          <Link
            to="/create"
            className="bg-primary-red text-white px-6 py-2.5 rounded-pill font-medium flex items-center gap-2 hover:bg-[#C1121F] hover:-translate-y-0.5 transition-all shadow-red"
          >
            <Rocket className="w-4 h-4" />
            Plan My Trip
          </Link>
        </div>
      </div>
    </nav>
  );
}
