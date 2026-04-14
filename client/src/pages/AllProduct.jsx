import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

const AllProduct = () => {
    const { products, searchQuery, setSearchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (products) { // ✅ fix
            const query = searchQuery.toLowerCase().trim();
            if (query !== "") {
                const filtered = products.filter(product => {
                    const pName = product.name.toLowerCase();
                    const pCategory = product.category.toLowerCase();
                    return pName.includes(query) || pCategory.includes(query);
                });
                setFilteredProducts(filtered);
            } else {
                setFilteredProducts(products);
            }
        }
    }, [products, searchQuery]);

    return (
        <div className='mt-10 flex flex-col items-center w-full px-4 md:px-10'>
            <div className='w-full max-w-[1450px]'>
                <div className='flex justify-between items-end mb-10'>
                    <div className='flex flex-col items-start'> 
                        <p className='text-3xl font-extrabold uppercase text-gray-800 tracking-tight'>
                            {searchQuery ? `Search: ${searchQuery}` : "All Products"}
                        </p>
                        <div className='w-20 h-1.5 bg-green-600 rounded-full mt-1'></div>
                    </div>
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className='text-red-600 font-bold'>Clear ✕</button>
                    )}
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-28'>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product}/>
                        ))
                    ) : (
                        <p className='text-gray-500 col-span-5 text-center'>No products found!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AllProduct;