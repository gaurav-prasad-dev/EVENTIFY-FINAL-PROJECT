import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">

      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* LOGO + DESC */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">🎬 MyApp</h2>
          <p className="text-sm">
            Discover and book tickets for movies, events, and experiences near you.
          </p>
        </div>

        {/* MOVIES */}
        <div>
          <h3 className="text-white font-semibold mb-3">Movies</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Now Showing</li>
            <li className="hover:text-white cursor-pointer">Coming Soon</li>
            <li className="hover:text-white cursor-pointer">Top Rated</li>
          </ul>
        </div>

        {/* EVENTS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Events</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Music</li>
            <li className="hover:text-white cursor-pointer">Sports</li>
            <li className="hover:text-white cursor-pointer">Workshops</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-700" />

      {/* BOTTOM SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* COPYRIGHT */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </p>

        {/* SOCIAL ICONS */}
        <div className="flex gap-4">
          <div className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer">
            <FaFacebookF size={14} />
          </div>
          <div className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer">
            <FaTwitter size={14} />
          </div>
          <div className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer">
            <FaInstagram size={14} />
          </div>
          <div className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer">
            <FaYoutube size={14} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;