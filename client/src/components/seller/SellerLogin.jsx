import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext'; 
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const { setIsSeller, navigate, axios } = useAppContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const { data } = await axios.post('/api/seller/login', { email, password });

            if (data.success) {
                setIsSeller(true);
                toast.success("Login Successful");
                navigate('/seller'); // ✅ Only here redirect
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600 px-4 bg-gray-50'>
            <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-2xl border border-gray-100 bg-white'>
                
                <p className='text-2xl font-medium m-auto'>
                    <span className='text-green-600 font-bold italic'>Sumit Grocery</span> Seller
                </p>

                <div className="w-full">
                    <p className='mb-1 font-semibold'>Email</p>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border w-full p-2"
                        required
                    />
                </div>

                <div className="w-full">
                    <p className='mb-1 font-semibold'>Password</p>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='border w-full p-2'
                        required 
                    />
                </div>

                <button className="bg-green-600 text-white w-full py-2 rounded">
                    Login as Seller
                </button>

            </div>
        </form>
    );
};

export default SellerLogin;