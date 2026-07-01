import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-16 border-t border-stone-800">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10">

          {/* Brand Section - Left Side */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-bronze-DEFAULT rounded-sm flex items-center justify-center">
                <span className="font-display text-white text-lg font-light">S</span>
              </div>
              <span 
                className="font-display text-2xl text-arch-cream"
                style={{ fontFamily: "'Saira', sans-serif" }}
              >
                SmartArch
              </span>
            </div>

            <p 
              className="text-stone-400 leading-relaxed max-w-md"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Intelligent floor plan analysis for modern architects. 
              Extract dimensions, detect elements, and share instantly.
            </p>

            <p className="mt-6 text-xs text-stone-500 font-mono">
              © {new Date().getFullYear()} SmartArch. All rights reserved.
            </p>
          </div>

          {/* Links Sections - Better Balanced */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-3 gap-10">
              
              {/* Product */}
              <div>
                <h4 
                  className="font-display text-lg text-arch-cream mb-4"
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  Product
                </h4>
                <ul className="space-y-2.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {["Features", "How it works", "Pricing", "Changelog"].map((item) => (
                    <li key={item}>
                      <Link 
                        to="#" 
                        className="hover:text-white transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 
                  className="font-display text-lg text-arch-cream mb-4"
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  Company
                </h4>
                <ul className="space-y-2.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {["About", "Blog", "Privacy", "Terms"].map((item) => (
                    <li key={item}>
                      <Link 
                        to="#" 
                        className="hover:text-white transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 
                  className="font-display text-lg text-arch-cream mb-4"
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  Support
                </h4>
                <ul className="space-y-2.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {["Contact", "Help Center", "Feedback"].map((item) => (
                    <li key={item}>
                      <Link 
                        to="#" 
                        className="hover:text-white transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800 mt-12 pt-8 text-center text-xs text-stone-500 font-mono">
          Made for architects who value speed and intelligence.
        </div>
      </div>
    </footer>
  );
}