import mongoose from 'mongoose';

const truckBookingListSchema = new mongoose.Schema(
  {
    userReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Div 2: General Information
    firstDate: { type: String, default: '' },
    secondDate: { type: String, default: '' },
    clientName: { type: String, default: '' },
    product: { type: String, default: '' },

    // Div 3: Dynamic Truck List Entries
    trucks: [
      {
        truckNumber: { type: String, default: '' },
        truckDriver: { type: String, default: '' },
        chambers: [{ type: Number, default: 0 }], // Dynamic array for multiple chambers
        totalQuantity: { type: Number, default: 0 }, // Auto-calculated read-only
        bottomSeals: [{ type: String, default: '' }], // Dynamic array for multiple bottom seals
        topSeals: [{ type: String, default: '' }], // Dynamic array for multiple top seals
      },
    ],
  },
  { timestamps: true }
);

const TruckBookingList =
  mongoose.models.TruckBookingList ||
  mongoose.model('TruckBookingList', truckBookingListSchema);

export default TruckBookingList;