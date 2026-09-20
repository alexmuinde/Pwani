import mongoose from 'mongoose';

const truckDocumentSchema = new mongoose.Schema(
  {
    userReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Div 1: Title Header Info (Stored in case you want to customize titles per record)
    companyName: { type: String, default: 'Sheikh Ali Transporters' },
    documentTitle: { type: String, default: 'Truck Document' },

    // Div 2: Truck Specifics
    truckNumber: { type: String, default: '' },
    trailerNumber: { type: String, default: '' },

    // Div 3: Driver Information
    driverName: { type: String, default: '' },
    idNumber: { type: String, default: '' },
    drivingLicenceNumber: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
);

const TruckDocument =
  mongoose.models.TruckDocument ||
  mongoose.model('TruckDocument', truckDocumentSchema);

export default TruckDocument;