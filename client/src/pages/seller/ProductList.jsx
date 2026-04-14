import React from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext()

  // ✅ Toggle stock function
  const toggleStock = async (id, currentStock) => {
    try {
      const { data } = await axios.post('/api/product/stock', {
        id,
        inStock: !currentStock   // 🔥 toggle value
      })

      if (data.success) {
        toast.success(data.message)

        // ✅ Immediately update UI (fast response)
        fetchProducts()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error("Stock update failed")
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="md:p-8 p-4">
        <h2 className="pb-6 text-xl font-semibold text-gray-800">
          All Products List
        </h2>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">

            {/* HEADER */}
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold w-[40%]">Product</th>
                <th className="px-6 py-4 font-semibold w-[20%] text-center">Category</th>
                <th className="px-6 py-4 font-semibold w-[20%] text-center">Price</th>
                <th className="px-6 py-4 font-semibold w-[20%] text-center">Stock</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-100 text-sm">
              {products && products.length > 0 ? (
                products.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">

                    {/* PRODUCT */}
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded border overflow-hidden bg-white flex items-center justify-center p-1">
                        <img
                          src={Array.isArray(item.image) ? item.image[0] : item.image}
                          alt={item.name}
                          className="object-contain h-full"
                        />
                      </div>

                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 text-green-600 uppercase">
                        {item.category}
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4 text-center font-semibold">
                      {currency}{item.offerPrice}
                    </td>

                    {/* STOCK TOGGLE */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">

                        {/* SWITCH */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.inStock}
                            onChange={() => toggleStock(item._id, item.inStock)}
                            className="sr-only peer"
                          />

                          <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:rounded-full after:h-4 after:w-4 
                          after:transition-all peer-checked:after:translate-x-5">
                          </div>
                        </label>

                        {/* STATUS TEXT */}
                        <span className={`text-xs font-semibold ${
                          item.inStock ? "text-green-600" : "text-red-500"
                        }`}>
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductList