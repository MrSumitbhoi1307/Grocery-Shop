import { createContext, useContext, useEffect, useState } from "react";
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

    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem("myOrders");
        return saved ? JSON.parse(saved) : [];
    });

    const [addressList, setAddressList] = useState([
        "Street 123, Main City, New State, IN"
    ]);
    const [selectedAddress, setSelectedAddress] = useState(addressList[0]);

    const upiDetails = {
        upiId: "sumit@upi",
        merchantName: "Sumit Grocery Store"
    };

    // ✅ FETCH USER
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");

            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                setUser(null);
                setCartItems({}); // ✅ important
            }
            setCartLoaded(true); // 🔥 IMPORTANT

        } catch (error) {
            console.log("FetchUser Error:", error.message);
            setUser(null);
            setCartItems({}); // ✅ important
            setCartLoaded(true); // 🔥 IMPORTANT
        }
    };

    // ✅ FETCH PRODUCTS
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");

            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.log("FetchProducts Error:", error.message);
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

    // ✅ SAVE ORDERS
    useEffect(() => {
        localStorage.setItem("myOrders", JSON.stringify(orders));
    }, [orders]);

    // ✅ INITIAL LOAD
    useEffect(() => {
        fetchUser();
        fetchProducts();
        fetchSeller();
    }, []);

    // ✅ FIXED CART UPDATE (IMPORTANT)
   // ✅ FIXED CART UPDATE (IMPORTANT)
useEffect(() => {
    const updateCart = async () => {
        try {
            const { data } = await axios.post(
                "/api/cart/update",
                { cartItems },
                { withCredentials: true }
            );

            if (!data.success) {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // 🔥 FIX: run only after cart loaded
    if (user && cartLoaded) {
        updateCart();
    }

}, [cartItems, cartLoaded]);
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

    // ✅ ORDER
    const placeOrder = (paymentMethod) => {

        const orderItems = [];

        for (const id in cartItems) {
            const product = products.find(p => String(p._id) === String(id));

            if (product) {
                orderItems.push({
                    product,
                    quantity: cartItems[id]
                });
            }
        }

        if (orderItems.length === 0) {
            toast.error("Cart is empty!");
            return;
        }

        const newOrder = {
            _id: Date.now().toString().slice(-6),
            items: orderItems,
            amount: getCartAmount(),
            paymentType: paymentMethod,
            status: "Order Placed",
            createdAt: new Date().toISOString(),
            address: selectedAddress
        };

        setOrders(prev => [newOrder, ...prev]);
        setCartItems({});
        toast.success("Order placed successfully!");
        navigate("/orders");
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

    // ✅ CONTEXT VALUE
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