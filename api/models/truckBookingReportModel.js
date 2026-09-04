import mongoose from 'mongoose';

const truckBookingReportSchema = new mongoose.Schema(
  {
    bookingDate: { type: String, required: true },
    timeIn: { type: String },
    truckNumber: { type: String, required: true },
    trailerNumber: { type: String },
    driverName: { type: String, required: true },
    driverLicenseNo: { type: String },
    transporterName: { type: String, required: true },
    productType: { type: String, required: true },
    intendedQuantity: { type: String, required: true },
    destination: { type: String, required: true },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Loaded', 'Cancelled'],
      default: 'Pending',
    },
    remarks: { type: String },
    userReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const TruckBookingReport = mongoose.model(
  'TruckBookingReport',
  truckBookingReportSchema
);

export default TruckBookingReport;