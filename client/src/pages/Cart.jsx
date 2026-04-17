import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

import phonePeIcon from "../assets/Phonepe.jpg";
import gPayIcon from "../assets/GPay.jpg";
import paytmIcon from "../assets/Paytm.jpg";

const Cart = () => {
    const {
        products, cartItems, addToCart, removeFromCart, getCartAmount,
        currency, navigate, placeOrder, user
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [showQR, setShowQR] = useState(false);
    const [loading, setLoading] = useState(false);

    // ✅ Build cart array from cartItems + products
    const getCartData = () => {
        let tempArray = [];
        for (const key in cartItems) {
            if (cartItems[key] > 0) {
                const product = products.find(item => String(item._id) === String(key));
                if (product) {
                    tempArray.push({ ...product, quantity: cartItems[key] });
                }
            }
        }
        setCartArray(tempArray);
    };

    // ✅ Fetch addresses from DB
    const getUserAddress = async () => {
        try {
            const { data } = await import("axios").then(m => m.default.get('/api/address/get'));
            if (data.success) {
                setAddressList(data.address);
                if (data.address.length > 0) {
                    setSelectedAddress(data.address[0]);
                }
            }
        } catch (error) {
            toast.error("Could not load address");
        }
    };

    useEffect(() => {
        if (products.length > 0) getCartData();
    }, [products, cartItems]);

    useEffect(() => {
        if (user) getUserAddress();
    }, [user]);

    const subtotal = getCartAmount();
    const tax = Math.floor(subtotal * 0.02);
    const total = subtotal + tax;

    const upiId = "sumit@upi";
    const merchantName = "Sumit Grocery Store";
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${total}&cu=INR`;

    // ✅ PLACE ORDER — delegates to context
    const handlePlaceOrder = async () => {
        if (loading) return;

        if (cartArray.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        if (!selectedAddress) {
            toast.error("Please select a delivery address!");
            return;
        }

        if (paymentMethod === "Online") {
            setShowQR(true);
            return;
        }

        setLoading(true);
        await placeOrder(selectedAddress, "Cash On Delivery", cartArray);
        setLoading(false);
    };

    const handleOnlinePaid = async () => {
        setShowQR(false);
        setLoading(true);
        await placeOrder(selectedAddress, "Online Payment", cartArray);
        setLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto gap-10">

            {/* Left Side: Product List */}
            <div className='flex-1'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart{" "}
                    <span className="text-sm text-green-600">{cartArray.length} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.length > 0 ? (
                    cartArray.map((product, index) => (
                        <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium py-5 border-b">
                            <div className="flex items-center md:gap-6 gap-3">
                                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border border-gray-200 rounded overflow-hidden bg-gray-50">
                                    <img
                                        className="w-full h-full object-contain"
                                        src={
                                            Array.isArray(product.image) && product.image.length > 0
                                                ? product.image[0]
                                                : "https://picsum.photos/150"
                                        }
                                        alt={product.name}
                                        onError={(e) => { e.target.src = "https://picsum.photos/150"; }}
                                    />
                                </div>
                                <div>
                                    <p className="text-black font-semibold line-clamp-1">{product.name}</p>
                                    <div className="flex items-center mt-2 border w-fit rounded bg-white">
                                        <button onClick={() => removeFromCart(product._id)} className="px-2 py-1 border-r hover:bg-gray-100">-</button>
                                        <span className="px-3 text-xs">{product.quantity}</span>
                                        <button onClick={() => addToCart(product._id)} className="px-2 py-1 border-l hover:bg-gray-100">+</button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-black font-semibold">
                                {currency}{product.offerPrice * product.quantity}
                            </p>
                            <button
                                onClick={() => removeFromCart(product._id)}
                                className="mx-auto text-red-500 hover:scale-110 transition"
                            >🗑️</button>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-gray-400 text-xl">Your cart is empty.</p>
                        <button
                            onClick={() => navigate('/all-products')}
                            className="mt-4 text-green-600 font-bold underline"
                        >Shop Now</button>
                    </div>
                )}
            </div>

            {/* Right Side: Summary Card */}
            <div className="w-full md:w-[360px] bg-white p-6 border border-gray-200 rounded-xl h-fit shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                {/* Address Section */}
                <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2 gap-2">
                        <p className="text-gray-700 text-sm leading-tight font-medium">
                            {selectedAddress
                                ? `${selectedAddress.firstName || ""} ${selectedAddress.lastName || ""}, ${selectedAddress.street || ""}, ${selectedAddress.city || ""}`
                                : "No address found. Please add one."}
                        </p>
                        <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="text-green-600 hover:text-green-800 text-xs font-bold"
                        >CHANGE</button>

                        {showAddress && (
                            <div className="absolute top-8 right-0 bg-white border border-gray-300 w-64 z-50 shadow-2xl rounded-lg overflow-hidden">
                                <div className="max-h-48 overflow-y-auto">
                                    {addressList.map((addr, i) => (
                                        <div
                                            key={i}
                                            onClick={() => { setSelectedAddress(addr); setShowAddress(false); }}
                                            className={`p-3 hover:bg-green-50 cursor-pointer border-b text-xs ${selectedAddress?._id === addr._id ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600'}`}
                                        >
                                            {addr.street}, {addr.city}
                                        </div>
                                    ))}
                                </div>
                                <div
                                    onClick={() => navigate('/add-address')}
                                    className="p-3 bg-gray-100 text-green-600 text-xs font-bold text-center cursor-pointer hover:bg-green-200 border-t"
                                >+ ADD NEW ADDRESS</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Payment Method</p>
                    <div className="space-y-2">
                        <div
                            onClick={() => setPaymentMethod("COD")}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'COD' ? 'border-green-600 bg-green-50' : ''}`}
                        >
                            <input type="radio" checked={paymentMethod === 'COD'} readOnly />
                            <span className="text-sm font-medium">Cash on Delivery</span>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("Online")}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'Online' ? 'border-green-600 bg-green-50' : ''}`}
                        >
                            <input type="radio" checked={paymentMethod === 'Online'} readOnly />
                            <span className="text-sm font-medium">Online (QR / UPI Apps)</span>
                        </div>
                    </div>
                </div>

                <div className="text-gray-600 space-y-3 text-sm border-t pt-4">
                    <div className="flex justify-between">
                        <span>Subtotal</span><span>{currency}{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{tax}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-black border-t pt-3">
                        <span>Total</span><span>{currency}{total}</span>
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full py-4 mt-8 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition disabled:opacity-60"
                >
                    {loading ? "Placing Order..." : paymentMethod === "Online" ? "PAY NOW & PLACE ORDER" : "PLACE ORDER"}
                </button>
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 backdrop-blur-md">
                    <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center shadow-xl">
                        <h3 className="text-xl font-bold mb-1">Pay to {merchantName}</h3>
                        <p className="text-green-600 font-bold mb-4">Amount: {currency}{total}</p>
                        <div className="bg-gray-50 p-4 rounded-xl mb-4 border-2 border-dashed border-gray-200">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                                className="mx-auto w-40 h-40"
                                alt="QR"
                            />
                        </div>

                        <div className="mb-6 grid grid-cols-3 gap-2">
                            <a href={upiLink} className="p-2 border rounded-lg flex flex-col items-center">
                                <img src={phonePeIcon} className="w-8 h-8" alt="PhonePe" />
                            </a>
                            <a href={upiLink} className="p-2 border rounded-lg flex flex-col items-center">
                                <img src={gPayIcon} className="w-8 h-8" alt="GPay" />
                            </a>
                            <a href={upiLink} className="p-2 border rounded-lg flex flex-col items-center">
                                <img src={paytmIcon} className="w-8 h-8" alt="Paytm" />
                            </a>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowQR(false)}
                                className="flex-1 py-2 border rounded-lg font-bold"
                            >Cancel</button>
                            <button
                                onClick={handleOnlinePaid}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold"
                            >I Have Paid</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;