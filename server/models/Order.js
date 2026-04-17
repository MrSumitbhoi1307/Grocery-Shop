import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    items: [{
        product: { type: String, required: true, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
   address: {
  street: String,
  city: String,
  state: String,
  zipcode: String
},
    status: { type: String, default: 'Order Placed' },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order