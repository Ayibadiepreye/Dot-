import { Link } from "react-router";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#0d0d0d] font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold">DOT</span>
            </div>
            <p className="text-sm text-neutral-400 mb-4">
              Africa's largest builder ecosystem. Connecting founders, creators, and entrepreneurs.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-white transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-neutral-400 hover:text-white transition"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-neutral-400 hover:text-white transition"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Platform</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link to="/join" className="hover:text-white transition">Pricing</Link></li>
              <li><Link to="/become-affiliate" className="hover:text-white transition">Affiliate Program</Link></li>
              <li><Link to="/become-partner" className="hover:text-white transition">Become a Partner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Community</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Whop Community</a></li>
              <li><a href="#" className="hover:text-white transition">Events</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Support</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500">
          <p>&copy; 2026 DOT (joindot.africa). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
