import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  
  // Context se currency aur orders state nikaali
  const { currency, orders, navigate } = useAppContext(); 

  useEffect(() => {
    // Jab orders update honge, tab local state update hogi
    if (orders && orders.length > 0) {
      setMyOrders(orders);
    } else {
      setMyOrders([]);
    }
  }, [orders]); 

  return (
    <div className='mt-16 pb-16 px-4 md:px-16 min-h-[60vh]'>
        {/* Title Section */}
        <div className='flex flex-col items-start w-max mb-8'>
          <p className='text-2xl font-medium uppercase'>My Orders</p>
          <div className='w-20 h-1.5 bg-green-600 rounded-full mt-1'></div>
        </div>

        {myOrders.length > 0 ? (
          myOrders.map((order, index) => (
            <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl shadow-sm bg-white'>
              
              {/* Order Header: ID, Payment Mode, and Total Amount */}
              <div className='flex justify-between md:items-center text-gray-500 text-sm md:font-medium max-md:flex-col border-b pb-3 mb-4 gap-2'>
                <span>OrderId: <span className='text-gray-800 font-bold'>#{order._id}</span></span>
                <span>Payment: <span className={`font-bold ${order.paymentType === 'Online Payment' ? 'text-blue-600' : 'text-orange-600'}`}>{order.paymentType}</span></span>
                <span>Total Amount: <span className='text-green-600 font-bold'>{currency} {order.amount}</span></span>
              </div>

              {/* Items List inside the Order */}
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className='flex flex-col md:flex-row gap-6 justify-between border-b last:border-b-0 py-4'>
                  <div className='flex items-center'> 
                    <div className='bg-gray-100 p-2 rounded-lg'>
                      {/* Product Image */}
                      <img src={item.product.image[0]} alt={item.product.name} className='w-16 h-16 object-contain' />
                    </div>
                    <div className='ml-4'>
                      <h2 className='text-lg font-medium text-gray-800'>{item.product.name}</h2>
                      <p className='text-sm text-gray-500 font-light'>Category: {item.product.category}</p>
                    </div>
                  </div>

                  {/* Quantity, Status, and Date Details */}
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 flex-1 md:ml-10'>
                    <div>
                      <p className='text-xs text-gray-400 uppercase font-bold'>Quantity</p>
                      <p className='font-medium'>{item.quantity}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-400 uppercase font-bold'>Status</p>
                      {/* Malik dwara set kiya gaya status yahan dikhega */}
                      <p className='text-green-600 font-bold'>{order.status}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-400 uppercase font-bold'>Date</p>
                      <p className='font-medium'>
                        {new Date(order.createAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Individual Item Price Calculation */}
                  <div className='md:text-right'>
                    <p className='text-gray-400 text-xs uppercase font-bold'>Price</p>
                    <p className='text-green-700 text-lg font-bold'>
                       {currency}{item.product.offerPrice * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Delivery Address Section */}
              <div className='mt-2 pt-2 text-xs text-gray-400 italic flex justify-between items-center'>
                <p>Delivering to: <span className='text-gray-600 font-medium uppercase'>{order.address}</span></p>
                <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded text-[10px] font-bold'>Verified Malik: Sumit Grocery Store</span>
              </div>
            </div>
          ))
        ) : (
          /* Empty Orders State */
          <div className='text-center py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-gray-50'>
            <p className='text-gray-400 text-xl font-bold'>Aapne abhi tak koi order nahi kiya hai! 🛒</p>
            <button 
                onClick={() => navigate('/products')} 
                className='mt-4 bg-green-600 text-white px-8 py-3 rounded-full text-sm hover:bg-green-700 transition shadow-lg font-bold active:scale-95'
            >
                Start Shopping Now
            </button>
          </div>
        )}
    </div>
  );
};

export default MyOrders;