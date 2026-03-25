import { MapPin, Instagram, Twitter, Linkedin, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-deep-navy text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <MapPin className="text-primary-red w-6 h-6" />
              <span className="font-display italic font-bold text-2xl">Start2Destiny</span>
            </div>
            <p className="text-[#6C8AA0] text-sm leading-relaxed">
              Your perfect trip, built for you. Free, always.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-white hover:text-primary-red transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-[#6C8AA0]">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community Plans</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Info</h4>
            <ul className="space-y-4 text-sm text-[#6C8AA0]">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-[#6C8AA0] mb-4">Get travel inspiration</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-[#2D4A6A] border-none rounded-lg px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-primary-red outline-none"
              />
              <button className="bg-primary-red p-2 rounded-lg hover:bg-[#C1121F] transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-[#6C8AA0] mt-2">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2D4A6A] text-center">
          <p className="text-[12px] text-[#6C8AA0]">
            © {new Date().getFullYear()} Start2Destiny. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
