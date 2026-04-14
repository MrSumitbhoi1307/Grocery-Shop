import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets'

const Orders = () => {

    const { currency } = useAppContext()
    const [orders, setOrders] = useState([])
  
    const fetchOrders = async () => {
        setOrders(dummyOrders)
    };

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50/30'>
            <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Orders List</h2>
                
                {orders.map((order, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_1fr_1.2fr] gap-4 items-center p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                        
                        {/* 1. Icon Column */}
                        <div className="flex justify-center md:justify-start">
                            <img className="w-12 h-12 object-contain p-2 bg-green-50 rounded-lg" src={assets.box_icon} alt="boxIcon" />
                        </div>

                        {/* 2. Product Details Column */}
                        <div className="text-sm">
                            <div className="space-y-1">
                                {order.items.map((item, itemIndex) => (
                                    <p key={itemIndex} className="font-semibold text-gray-800">
                                        {item.product.name} 
                                        <span className="text-green-600 font-bold ml-1">x {item.quantity}</span>
                                        {itemIndex !== order.items.length - 1 && ","}
                                    </p>
                                ))}
                            </div>
                            <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID: #{order._id}</p>
                        </div>

                        {/* 3. Customer & Address Column */}
                        <div className="text-sm text-gray-600 leading-relaxed border-l md:pl-4 border-gray-100">
                            <p className='text-gray-900 font-bold mb-1'>{order.address.firstName} {order.address.lastName}</p>
                            <p className="text-xs">{order.address.street}, {order.address.city}</p> 
                            <p className="text-xs">{order.address.state}, {order.address.zipcode}</p>
                            <p className="text-xs font-medium text-blue-600 mt-1">{order.address.phone}</p>
                        </div>

                        {/* 4. Amount Column */}
                        <div className="text-center md:text-left">
                            <p className="text-lg font-black text-gray-900">{currency}{order.amount}</p>
                            <p className="text-xs text-gray-400 font-medium">Method: {order.paymentType}</p>
                        </div>

                        {/* 5. Status & Date Column */}
                        <div className="text-sm flex flex-col items-end gap-2">
                            <p className="text-xs font-medium text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                                order.isPaid 
                                ? "bg-green-50 text-green-600 border-green-100" 
                                : "bg-orange-50 text-orange-600 border-orange-100"
                            }`}>
                                {order.isPaid ? "● Paid" : "● Payment Pending"}
                            </div>
                            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Status: {order.status || "Processing"}</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders