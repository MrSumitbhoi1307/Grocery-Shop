import React from "react";
import { Link, Outlet, NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const { axios, navigate } = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/seller/add-product", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.order_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    ];

    // FIX: async missing tha logout mein
    const logout = async () => {
        try {
            const { data } = await axios.get('/api/seller/logout');
            if (data.success) {
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white h-16">
                <Link to='/' className="flex items-center gap-2">
                    <img
                        src={assets.logo}
                        alt="Sumit Grocery Logo"
                        className="cursor-pointer h-7 md:h-8 w-auto object-contain"
                    />
                    <p className="tracking-tight flex items-center">
                        <span className="text-xl md:text-2xl font-semibold text-green-600">Sumit</span>
                        <span className="text-xl md:text-2xl font-semibold text-gray-800">Grocery</span>
                    </p>
                </Link>

                <div className="flex items-center gap-5 text-gray-500">
                    <p className="hidden md:block font-medium">Hi! Admin (Sumit)</p>
                    <button
                        onClick={logout}
                        className='border border-primary text-primary rounded-full text-sm px-4 py-1 hover:bg-primary/10 transition font-bold'
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex">
                <div className="md:w-64 w-16 border-r min-h-[calc(100vh-64px)] bg-white border-gray-300 pt-4 flex flex-col transition-all duration-300">
                    {sidebarLinks.map((item) => (
                        <NavLink
                            to={item.path}
                            key={item.name}
                            className={({ isActive }) =>
                                `flex items-center py-3 px-4 gap-3 transition-all ${
                                    isActive
                                    ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 border-r-4 border-transparent text-gray-500"
                                }`
                            }
                        >
                            <img src={item.icon} alt={item.name} className="w-6 h-6" />
                            <p className="md:block hidden font-medium">{item.name}</p>
                        </NavLink>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto bg-white p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SellerLayout;