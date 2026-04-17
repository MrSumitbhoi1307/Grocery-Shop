import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, orders, navigate } = useAppContext();

  useEffect(() => {
    console.log("orders from context:", orders);
    if (Array.isArray(orders)) {
      setMyOrders(orders);
    }
  }, [orders]);

  return (
    <div className='mt-16 pb-16 px-4 md:px-16 min-h-[60vh]'>

      <div className='flex flex-col items-start w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>My Orders</p>
        <div className='w-20 h-1.5 bg-green-600 rounded-full mt-1'></div>
      </div>

      {myOrders.length > 0 ? (
        myOrders.map((order, index) => (
          <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl shadow-sm bg-white'>

            {/* ORDER HEADER */}
            <div className='flex justify-between md:items-center text-gray-500 text-sm md:font-medium max-md:flex-col border-b pb-3 mb-4 gap-2'>

              <span>
                OrderId:{' '}
                <span className='text-gray-800 font-bold'>#{order._id}</span>
              </span>

              <span>
                Payment:{' '}
                <span className='font-bold text-blue-600'>
                  {typeof order.paymentType === 'object'
                    ? JSON.stringify(order.paymentType)
                    : order.paymentType}
                </span>
              </span>

              <span>
                Total:{' '}
                <span className='text-green-600 font-bold'>
                  {currency} {order.amount}
                </span>
              </span>
            </div>

            {/* ITEMS */}
            {order.items?.map((item, itemIndex) => (
              <div key={itemIndex} className='flex flex-col md:flex-row gap-6 justify-between border-b py-4'>

                <div className='flex items-center'>
                  <div className='bg-gray-100 p-2 rounded-lg'>
                    <img
                      src={
                        item.product?.image?.[0] ||
                        item.product?.image ||
                        "https://picsum.photos/100"
                      }
                      alt="product"
                      className='w-16 h-16 object-contain'
                    />
                  </div>

                  <div className='ml-4'>
                    <h2 className='text-lg font-medium'>{item.product?.name}</h2>
                    <p className='text-sm text-gray-500'>
                      Category: {item.product?.category || "N/A"}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-4 flex-1 md:ml-10'>

                  <div>
                    <p className='text-xs text-gray-400 uppercase font-bold'>Qty</p>
                    <p>{item.quantity}</p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-400 uppercase font-bold'>Status</p>
                    <p className='text-green-600 font-bold'>{order.status}</p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-400 uppercase font-bold'>Date</p>
                    <p>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                </div>

                <div className='md:text-right'>
                  <p className='text-xs text-gray-400 uppercase font-bold'>Price</p>
                  <p className='text-green-700 font-bold text-lg'>
                    {currency}{(item.product?.offerPrice || 0) * item.quantity}
                  </p>
                </div>

              </div>
            ))}

            {/* ADDRESS */}
            <div className='mt-4 text-xs text-gray-500'>
              <p className='font-semibold text-gray-600 mb-1'>Delivering to:</p>
              {order.address && typeof order.address === 'object' ? (
                <div className='leading-5'>
                  <p>{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                  <p>{order.address.country}</p>
                  <p>{order.address.phone}</p>
                </div>
              ) : (
                <p>{order.address || "N/A"}</p>
              )}
            </div>

          </div>
        ))
      ) : (
        <div className='text-center py-20 border-2 border-dashed rounded-xl bg-gray-50'>
          <p className='text-gray-400 text-xl font-bold'>No orders yet 🛒</p>
          <button
            onClick={() => navigate('/products')}
            className='mt-4 bg-green-600 text-white px-8 py-3 rounded-full'
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;