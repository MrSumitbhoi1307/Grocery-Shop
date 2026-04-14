import React from 'react';
import { categories } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        // ✅ convert to URL safe format
        const formatted = category.text
            .toLowerCase()
            .replace(/\s+/g, "-"); // spaces → dash

        navigate(`/products/${formatted}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className='mt-10 flex flex-col items-center w-full px-4 md:px-10'>
            <div className='w-full max-w-[1450px]'>

                <div className='flex flex-col items-start mb-10'> 
                    <h2 className='text-3xl font-extrabold uppercase text-gray-800 tracking-tight'>
                        Shop by Categories
                    </h2>
                    <div className='w-20 h-1.5 bg-green-600 rounded-full mt-1'></div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleCategoryClick(category)}
                            style={{ backgroundColor: category.bgColor }}
                            className="flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 mb-3">
                                <img src={category.image} alt={category.text} className="w-full h-full object-contain" />
                            </div>
                            <p className="text-xs md:text-sm font-bold text-gray-800 text-center capitalize">
                                {category.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;