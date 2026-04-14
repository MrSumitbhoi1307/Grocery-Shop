import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const BestSeller = () => {
    const { products } = useAppContext();
    
    // Sirf top 5 ya best sellers filter kar lo (Example logic)
    const bestSellers = products.slice(0, 5); 

    return (
        <div className='mt-10 flex flex-col items-center w-full px-4 md:px-10'>
            {/* Ye container niche wale AllProduct se match karega */}
            <div className='w-full max-w-[1450px]'>
                <div className='flex flex-col items-start mb-10'> 
                    <h2 className='text-3xl font-extrabold uppercase text-gray-800 tracking-tight'>
                        Best Sellers
                    </h2>
                    <div className='w-20 h-1.5 bg-green-600 rounded-full mt-1'></div>
                </div>

                {/* Gap-x-12 aur gap-y-12 wahi hai jo tune AllProduct mein use kiya hai */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-12 gap-y-12'>
                    {bestSellers.map((product, index) => (
                        <div key={index} className="flex justify-center transition-all duration-500 hover:-translate-y-2">
                            <ProductCard product={product}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BestSeller;