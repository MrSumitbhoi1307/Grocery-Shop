import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useContext(AppContext);
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            const foundProduct = products.find((item) => String(item._id) === String(id));
            if (foundProduct) {
                setProduct(foundProduct);
                setThumbnail(foundProduct.image[0]);

                // RELATED PRODUCTS LOGIC (Jaisa aapne manga tha: current product shamil hai)
                const sameCategory = products.filter(
                    (item) => item.category === foundProduct.category
                );
                setRelatedProducts(sameCategory.slice(0, 5)); 
            }
        }
        window.scrollTo(0, 0);
    }, [id, products]);

    if (!product) {
        return <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">Loading...</div>;
    }

    return (
        <div className="mt-8 mb-20">
            {/* --- Main Product Section Wrapper --- */}
            <div className="px-4 md:px-16 lg:px-24 max-w-[1450px] mx-auto">
                {/* Breadcrumbs */}
                <p className="text-xs md:text-sm text-gray-500 mb-6">
                    <Link to={"/"} className="hover:text-black">Home</Link> /
                    <Link to={"/products"} className="hover:text-black"> Products</Link> /
                    <span className="text-primary font-medium"> {product.name}</span>
                </p>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-20">
                    {/* Images Left */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-2 overflow-x-auto">
                            {product.image.map((img, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setThumbnail(img)} 
                                    className={`border w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden cursor-pointer shrink-0 transition-all ${thumbnail === img ? 'border-primary ring-1 ring-primary' : 'border-gray-200'}`}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-contain p-1" />
                                </div>
                            ))}
                        </div>
                        <div className="border border-gray-100 w-full md:w-[380px] lg:w-[450px] aspect-square rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-sm">
                            <img src={thumbnail} alt={product.name} className="max-h-full max-w-full object-contain p-8 hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>

                    {/* Content Right */}
                    <div className="flex-1 max-w-lg pt-2">
                        <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">{product.category}</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-1 mt-3">
                            {Array(5).fill('').map((_, i) => (
                                <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="star" className="w-4" />
                            ))}
                            <p className="text-gray-400 text-sm ml-2">(42 reviews)</p>
                        </div>
                        <div className="mt-8 pb-8 border-b border-gray-100">
                            <div className="flex items-baseline gap-4">
                                <p className="text-3xl font-bold text-gray-900">{currency}{product.offerPrice}</p>
                                <p className="text-lg text-gray-400 line-through">{currency}{product.price}</p>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% Off
                                </span>
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-base font-bold text-gray-800 mb-3">Product Description</p>
                            <ul className="text-sm text-gray-600 space-y-2">
                                {product.description.map((desc, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-primary text-lg leading-none">•</span> {desc}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Buttons with Primary Color */}
                        <div className="flex gap-4 mt-10">
                            <button 
                                onClick={() => addToCart(product._id)} 
                                className="flex-1 h-14 rounded-xl font-bold bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white cursor-pointer transition-all active:scale-95 uppercase text-sm tracking-wide"
                            >
                                Add to Cart
                            </button>
                            <button 
                                onClick={() => { addToCart(product._id); navigate("/cart"); }} 
                                className="flex-1 h-14 rounded-xl font-bold bg-primary text-white shadow-lg hover:opacity-90 cursor-pointer transition-all active:scale-95 uppercase text-sm tracking-wide"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- RELATED PRODUCTS ---------- */}
            <div className="mt-32 px-4 md:px-10 lg:px-16 max-w-[1550px] mx-auto">
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Related Products</h2>
                    <div className="w-20 h-1.5 bg-primary rounded-full mt-2"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-14 gap-x-6 md:gap-x-10 lg:gap-x-16">
                    {relatedProducts.map((item, index) => (
                        <div key={index} className="flex justify-center transition-all duration-300 hover:-translate-y-3">
                            <ProductCard product={item} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-24">
                    <button 
                        onClick={() => { navigate('/products'); window.scrollTo(0, 0); }} 
                        className="px-16 py-3.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:text-primary hover:border-primary transition-all uppercase text-xs tracking-widest shadow-sm active:scale-95"
                    >
                        See more products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;