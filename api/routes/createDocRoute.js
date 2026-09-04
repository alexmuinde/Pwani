import express from 'express';
import { 
  genericUpsert, 
  genericGetDoc, 
  getUserDocuments, 
  getAllDocuments,
  searchAllDocuments 
} from '../controllers/genericController.js';

import TruckBookingReport from '../models/truckBookingReportModel.js';
import verifyToken from '../utils/verifyUser.js';

const router = express.Router();

// Register all project models here as you add more transporter documents
const allDocumentModels = {
  truckBookingReport: TruckBookingReport,
};

// Global Document Routes
router.get('/all', verifyToken, getAllDocuments(allDocumentModels));
router.get('/search', verifyToken, searchAllDocuments(allDocumentModels));
router.get('/userDocuments/:id', verifyToken, getUserDocuments(allDocumentModels));

// Truck Booking Report Routes
router.post('/truckBookingReport', verifyToken, genericUpsert(TruckBookingReport));
router.put('/truckBookingReport/:id', verifyToken, genericUpsert(TruckBookingReport));
router.get('/truckBookingReport/get/:id', verifyToken, genericGetDoc(TruckBookingReport));

export default router;