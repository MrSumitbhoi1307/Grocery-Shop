import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets'; // ✅ IMPORT FROM ASSETS
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const { axios } = useAppContext();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            formData.append('productData', JSON.stringify({
                name,
                description: description.split('\n').filter(line => line.trim() !== ""),
                category, // ✅ IMPORTANT (same as assets category.path)
                price: Number(price),
                offerPrice: Number(offerPrice)
            }));

            if (image1) formData.append('images', image1);
            if (image2) formData.append('images', image2);
            if (image3) formData.append('images', image3);
            if (image4) formData.append('images', image4);

            const { data } = await axios.post('/api/product/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (data.success) {
                toast.success(data.message);

                // RESET
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setImage1(null);
                setImage2(null);
                setImage3(null);
                setImage4(null);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 h-[95vh] overflow-y-auto p-4">
            <form onSubmit={onSubmitHandler} className="space-y-4 max-w-md">

                {/* IMAGES */}
                <div>
                    <p className="text-sm font-medium">Product Images</p>
                    <div className="flex gap-2 mt-2">

                        {[image1, image2, image3, image4].map((img, index) => (
                            <label key={index} className="cursor-pointer">
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (index === 0) setImage1(file);
                                        if (index === 1) setImage2(file);
                                        if (index === 2) setImage3(file);
                                        if (index === 3) setImage4(file);
                                    }}
                                />
                                <img
                                    src={img ? URL.createObjectURL(img) : assets.upload_area}
                                    className="w-20 h-20 object-cover border rounded"
                                />
                            </label>
                        ))}

                    </div>
                </div>

                {/* NAME */}
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                    className="w-full border p-2 rounded"
                    required
                />

                {/* DESCRIPTION */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                    required
                />

                {/* ✅ CATEGORY FIX */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                >
                    <option value="">Select Category</option>

                    {categories.map((item, index) => (
                        <option key={index} value={item.path}>
                            {item.text}
                        </option>
                    ))}

                </select>

                {/* PRICE */}
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                    className="w-full border p-2 rounded"
                    required
                />

                {/* OFFER PRICE */}
                <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="Offer Price"
                    className="w-full border p-2 rounded"
                    required
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    {loading ? "ADDING..." : "ADD PRODUCT"}
                </button>

            </form>
        </div>
    );
};

export default AddProduct;