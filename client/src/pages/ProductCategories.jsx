import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const categoryMap = {
    "organic veggies": "Vegetables",
    "fresh fruits": "Fruits",
    "cold drinks": "Drinks",
    "instant food": "Instant",
    "dairy products": "Dairy",
    "bakery & breads": "Bakery",
    "grains & cereals": "Grains"
};

const ProductCategories = () => {
    const { categoryName } = useParams();
    const { products } = useAppContext();

    const formattedCategory = categoryName
        ?.replace(/-/g, " ")
        .toLowerCase()
        .trim();

    const actualCategory = categoryMap[formattedCategory];

    const filteredProducts = useMemo(() => {
        if (!products || !actualCategory) return [];

        return products.filter(product => {
            const productCategory = String(product.category || "")
                .toLowerCase()
                .trim();

            // ✅ ONLY CATEGORY FILTER (NO STOCK FILTER)
            return productCategory === actualCategory.toLowerCase();
        });

    }, [products, actualCategory]);

    return (
        <div className='mt-10 px-4 md:px-10'>
            <div className='max-w-[1450px] mx-auto'>

                <h1 className='text-3xl font-bold mb-6 capitalize'>
                    {formattedCategory}
                </h1>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>

                    {!products ? (
                        <p className='text-center col-span-full text-gray-400'>
                            Loading...
                        </p>
                    ) : filteredProducts.length > 0 ? (

                        filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))

                    ) : (
                        <p className='text-center col-span-full text-gray-400'>
                            No products found
                        </p>
                    )}

                </div>

            </div>
        </div>
    );
};

export default ProductCategories;