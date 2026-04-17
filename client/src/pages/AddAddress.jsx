import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// Input Field Component
const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input
        className='w-full px-3 py-2 border border-gray-300 rounded outline-none text-gray-600 focus:border-green-600 transition'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
);

const AddAddress = () => {

    const navigate = useNavigate();

    const { addNewAddress, axios, user } = useAppContext(); // ✅ FIXED

    const [address, setAddress] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            // ✅ FIXED API CALL
            const { data } = await axios.post(
    '/api/address/add',
    { address },
    { withCredentials: true }   // 🔥 MOST IMPORTANT
);

            if (data.success) {
                toast.success(data.message);

                // 🔥 local context me bhi save
                const newFullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`;
                addNewAddress(newFullAddress);

                navigate('/cart');

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    // ✅ FIXED useEffect
    useEffect(() => {
        if (!user) {
            navigate('/cart');
        }
    }, [user]);

    return (
        <div className='mt-16 pb-16 px-4 md:px-10 max-w-6xl mx-auto'>
            <p className='text-2xl md:text-3xl text-gray-500'>
                Add Shipping <span className='font-semibold text-green-600'>Address</span>
            </p>

            <div className='flex flex-col md:flex-row justify-between mt-10 gap-10'>
                <div className='flex-1 max-w-xl'>
                    <form onSubmit={onSubmitHandler} className='space-y-4 text-sm'>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='firstName' type='text' placeholder="First Name" />
                            <InputField handleChange={handleChange} address={address} name='lastName' type='text' placeholder="Last Name" />
                        </div>

                        <InputField handleChange={handleChange} address={address} name='email' type='email' placeholder="Email Address" />
                        <InputField handleChange={handleChange} address={address} name='street' type='text' placeholder="Street Address" />

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='city' type='text' placeholder="City" />
                            <InputField handleChange={handleChange} address={address} name='state' type='text' placeholder="State" />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='zipcode' type='number' placeholder="Zipcode" />
                            <InputField handleChange={handleChange} address={address} name='country' type='text' placeholder="Country" />
                        </div>

                        <InputField handleChange={handleChange} address={address} name='phone' type='tel' placeholder="Phone Number" />

                        <button type='submit' className='w-full md:w-auto px-10 py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition'>
                            SAVE & CONTINUE
                        </button>

                    </form>
                </div>

                <div className='hidden md:block w-full max-w-sm'>
                    <img className='rounded-lg shadow-sm border border-gray-100' src={assets.add_address_iamge} alt="Address Illustration" />
                </div>
            </div>
        </div>
    );
};

export default AddAddress;