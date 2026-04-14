import React from 'react';
import { assets, features } from '../assets/assets'; 

const BottomBanner = () => {
  return (
    /* Margin top ko wapas mt-4 kar diya hai jaisa pehle tha */
    <div className="w-full relative overflow-hidden rounded-xl mt-4 px-4 md:px-0"> 
      
      {/* Background Images - No Filters, Original Colors */}
      <img
        src={assets.bottom_banner_image}
        alt="Desktop Banner"
        className="w-full hidden md:block object-cover min-h-[300px]" 
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="Mobile Banner"
        className="w-full md:hidden object-cover min-h-[250px]"
      />

      {/* Overlay Content - Original Positioning */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md md:ml-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-6 leading-tight">
            Why We Are The Best?
          </h2>
          
          <div className="flex flex-col gap-5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <img 
                  src={feature.icon} 
                  alt={feature.title} 
                  className="w-8 h-8 md:w-10 md:h-10 shrink-0" 
                />
                <div className="flex flex-col">
                  <h3 className="text-sm md:text-base font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm font-medium leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;