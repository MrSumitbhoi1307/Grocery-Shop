import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    return product && (
        <div 
            onClick={() => { navigate(`/product/${product._id}`); window.scrollTo(0,0); }}
            className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full cursor-pointer hover:shadow-md transition-all relative"
        >

            {/* 🔴 OUT OF STOCK BADGE */}
            {!product.inStock && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                </div>
            )}

            <div className="group flex items-center justify-center px-2">
                <img 
                    className={`group-hover:scale-105 transition max-w-26 md:max-w-36 ${!product.inStock ? 'opacity-50' : ''}`} 
                    src={product.image[0]} 
                    alt={product.name} 
                />
            </div>
            
            <div className="text-gray-500/60 text-sm mt-2">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>

                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-indigo-500">
                        {currency}{product.offerPrice}
                    </p>

                    <div className="text-indigo-500" onClick={(e) => e.stopPropagation()}>
                        
                        {/* ❌ IF OUT OF STOCK */}
                        {!product.inStock ? (
                            <button 
                                disabled
                                className="bg-gray-300 text-gray-600 md:w-[90px] w-[70px] h-[34px] rounded cursor-not-allowed text-sm"
                            >
                                Unavailable
                            </button>
                        ) : !cartItems[product._id] ? (

                            <button 
                                className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 font-medium cursor-pointer" 
                                onClick={() => addToCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="" /> Add
                            </button>

                        ) : (

                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                                <button onClick={() => removeFromCart(product._id)} className="px-2">-</button>
                                <span>{cartItems[product._id]}</span>
                                <button onClick={() => addToCart(product._id)} className="px-2">+</button>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;