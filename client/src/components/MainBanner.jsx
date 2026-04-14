import React from 'react';
import { Link } from 'react-router-dom';
import mainBannerDesktop from '../assets/main_banner_bg.png';
import mainBannerMobile from '../assets/main_banner_bg_sm.png';
import { assets } from '../assets/assets'; // Check karo ki assets import sahi hai

const MainBanner = () => {
  return (
    <div className="w-full relative overflow-hidden rounded-xl"> 
      {/* 1. Background Images */}
      <img
        src={mainBannerDesktop}
        alt="Banner"
        className="w-full hidden md:block object-cover min-h-[300px]"
      />
      <img
        src={mainBannerMobile}
        alt="Banner"
        className="w-full md:hidden object-cover min-h-[250px]"
      />

      {/* 2. Overlay Content (Text & Buttons) */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        
        {/* H1 Heading - Styled exactly like your image */}
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] max-w-[300px] md:max-w-[450px] leading-tight">
          Freshness You Can Trust, Savings You will Love!
        </h1>

        {/* Buttons Row */}
        <div className="flex items-center gap-4 mt-6 md:mt-8">
          
          {/* Shop Now Button */}
          <Link 
            to="/product" 
            className="px-6 py-2.5 md:px-8 md:py-3 bg-[#3BB77E] hover:bg-[#2d9a68] text-white font-medium rounded-md transition-all text-sm md:text-base"
          >
            Shop now
          </Link>

          {/* Explore Deals Link */}
          <Link 
            to="/product" 
            className="group flex items-center gap-2 font-semibold text-[#1a1a1a] hover:text-[#3BB77E] transition-all text-sm md:text-base"
          >
            Explore deals 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default MainBanner;