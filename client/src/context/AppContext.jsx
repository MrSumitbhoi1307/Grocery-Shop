import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// ✅ GLOBAL AXIOS CONFIG
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// ✅ ERROR LOGGING
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("Axios Error Status:", error.response?.status);
        console.log("Axios Error Data:", error.response?.data);
        return Promise.reject(error);
    }
);

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const navigate = useNavigate();

    // ✅ STATES
    const [user, setUser] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [isSeller, setIsSeller] = useState(false);
    const [cartLoaded, setCartLoaded] = useState(false);
    const [orders, setOrders] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // 🔥 This ref prevents cart sync right after order placement
    const skipCartSync = useRef(false);

    const upiDetails = {
        upiId: "sumit@upi",
        merchantName: "Sumit Grocery Store"
    };

    // ✅ FETCH USER + LOAD CART FROM DB
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");

            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                setUser(null);
                setCartItems({});
            }

            setCartLoaded(true);

        } catch (error) {
            console.log("FetchUser Error:", error.message);
            setUser(null);
            setCartItems({});
            setCartLoaded(true);
        }
    };

    // ✅ FETCH PRODUCTS
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) setProducts(data.products);
        } catch (error) {
            console.log("FetchProducts Error:", error.message);
        }
    };

    // ✅ FETCH ORDERS FROM DB
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/user");
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.log("FetchOrders Error:", error.message);
        }
    };

    // ✅ SELLER AUTH CHECK
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            setIsSeller(data.success);
        } catch {
            setIsSeller(false);
        }
    };

    // ✅ INITIAL LOAD
    useEffect(() => {
        fetchUser();
        fetchProducts();
        fetchSeller();
    }, []);

    // ✅ FETCH ORDERS WHEN USER LOADS
    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    // ✅ CART SYNC TO DB — with skip guard
    useEffect(() => {
        const updateCart = async () => {
            // 🔥 Skip sync if order was just placed (cart was intentionally cleared)
            if (skipCartSync.current) {
                skipCartSync.current = false;
                return;
            }

            try {
                const { data } = await axios.post("/api/cart/update", { cartItems });
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (user && cartLoaded) {
            updateCart();
        }

    }, [cartItems]);

    // ✅ CART FUNCTIONS
    const addToCart = (itemId) => {
        let cart = structuredClone(cartItems);
        cart[itemId] = (cart[itemId] || 0) + 1;
        setCartItems(cart);
        toast.success("Item added to cart");
    };

    const removeFromCart = (itemId) => {
        let cart = structuredClone(cartItems);
        if (cart[itemId] > 1) cart[itemId] -= 1;
        else delete cart[itemId];
        setCartItems(cart);
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((a, b) => a + b, 0);
    };

    const getCartAmount = () => {
        let total = 0;
        for (const id in cartItems) {
            const item = products.find(p => String(p._id) === String(id));
            if (item) total += item.offerPrice * cartItems[id];
        }
        return Math.floor(total * 100) / 100;
    };

    // ✅ PLACE ORDER — used by Cart.jsx
    const placeOrder = async (selectedAddress, paymentMethod = "Cash On Delivery", cartArray) => {
        try {
            if (!cartArray || cartArray.length === 0) {
                toast.error("Cart is empty!");
                return false;
            }

            if (!selectedAddress) {
                toast.error("Please select a delivery address!");
                return false;
            }

            const orderData = {
                userId: user._id,
                items: cartArray.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id, // send address ID to backend
                amount: getCartAmount(),
                paymentType: paymentMethod
            };

            const { data } = await axios.post("/api/order/cod", orderData);

            if (data.success) {
                // 🔥 Set skip flag BEFORE clearing cart
                skipCartSync.current = true;
                setCartItems({});
                await fetchOrders(); // refresh orders from DB
                toast.success("Order placed successfully!");
                navigate("/my-orders");
                return true;
            } else {
                toast.error(data.message);
                return false;
            }

        } catch (error) {
            console.log("PlaceOrder Error:", error);
            toast.error("Order failed. Please try again.");
            return false;
        }
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const addNewAddress = (addr) => {
        setAddressList(prev => [...prev, addr]);
        setSelectedAddress(addr);
    };

    const value = {
        navigate,
        user,
        setUser,
        fetchUser,
        products,
        fetchProducts,
        currency,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getCartCount,
        getCartAmount,
        showUserLogin,
        setShowUserLogin,
        searchQuery,
        setSearchQuery,
        addressList,
        setAddressList,
        selectedAddress,
        setSelectedAddress,
        addNewAddress,
        orders,
        setOrders,
        fetchOrders,
        placeOrder,
        updateOrderStatus,
        upiDetails,
        isSeller,
        setIsSeller,
        axios
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);