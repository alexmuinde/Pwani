import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDocStart,
  fetchDocSuccess,
  fetchDocFailure,
  saveDocStart,
  saveDocSuccess,
  saveDocFailure,
} from '../redux/document/documentSlice';

export default function TruckBookingReport() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.document);
  const [formData, setFormData] = useState({
    bookingStatus: 'Pending',
  });

  // Fetch document data on page mount if ID exists in URL
  // Fetch document data on page mount if ID exists in URL
useEffect(() => {
  if (!id) return;

  const fetchDocument = async () => {
    try {
      dispatch(fetchDocStart());
      
      // Update endpoint to match Express backend route
      const res = await fetch(`/api/createDoc/truckBookingReport/get/${id}`);
      const data = await res.json();

      if (data.success === false) {
        dispatch(fetchDocFailure(data.message));
        return;
      }

      setFormData(data);
      dispatch(fetchDocSuccess(data));
    } catch (err) {
      dispatch(fetchDocFailure(err.message || 'Failed to fetch booking report details.'));
    }
  };

  fetchDocument();
}, [id, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(saveDocStart());

      // Dynamic HTTP Method & Endpoint configuration
      const isUpdating = Boolean(id);
      const method = isUpdating ? 'PUT' : 'POST';
      const endpoint = isUpdating
        ? `/api/createDoc/truckBookingReport/${id}`
        : '/api/createDoc/truckBookingReport';

      // Clean payload: strip internal database metadata before sending
      const payload = { ...formData };
      delete payload._id;
      delete payload.__v;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.userReference;

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(saveDocFailure(data.message));
        return;
      }

      dispatch(saveDocSuccess(data));

      // Extract target ID from returned data wrapper
      const savedDocId = data.data?._id || data._id || id;

      // If creating a fresh entry, navigate to the newly created document URL
      if (!id && savedDocId) {
        navigate(`/truckBookingReport/${savedDocId}`);
      }
    } catch (err) {
      dispatch(saveDocFailure(err.message || 'An error occurred while submitting.'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 grid grid-cols-1 gap-2 md:grid-cols-2">
      <div className="md:col-span-2">
        <h1 className="text-xl font-medium p-2 text-center">PWANI TRANSPORTERS LIMITED</h1>
        <h2 className="p-2 text-center">TRUCK BOOKING REPORT</h2>
      </div>

      {/* BASIC BOOKING INFO */}
      <div className="grid grid-cols-2 gap-4 border-b-2 border-gray-200 p-2 shadow-md hover:shadow-xl md:col-span-2">
        <div>
          <label htmlFor="bookingDate" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Booking Date
          </label>
          <input
            onChange={handleChange}
            id="bookingDate"
            type="date"
            required
            value={formData.bookingDate || ''}
            placeholder="Booking Date"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div>
          <label htmlFor="timeIn" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Time In
          </label>
          <input
            onChange={handleChange}
            id="timeIn"
            type="time"
            value={formData.timeIn || ''}
            placeholder="Time In"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div>
          <label htmlFor="truckNumber" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Truck Number
          </label>
          <input
            onChange={handleChange}
            id="truckNumber"
            type="text"
            required
            value={formData.truckNumber || ''}
            placeholder="Truck Number"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div>
          <label htmlFor="trailerNumber" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Trailer Number
          </label>
          <input
            onChange={handleChange}
            id="trailerNumber"
            type="text"
            value={formData.trailerNumber || ''}
            placeholder="Trailer Number"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div>
          <label htmlFor="driverName" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Driver Name
          </label>
          <input
            onChange={handleChange}
            id="driverName"
            type="text"
            required
            value={formData.driverName || ''}
            placeholder="Driver Name"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div>
          <label htmlFor="driverLicenseNo" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Driver License No.
          </label>
          <input
            onChange={handleChange}
            id="driverLicenseNo"
            type="text"
            value={formData.driverLicenseNo || ''}
            placeholder="Driver License No."
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="transporterName" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Transporter Name
          </label>
          <input
            onChange={handleChange}
            id="transporterName"
            type="text"
            required
            value={formData.transporterName || ''}
            placeholder="Transporter Name"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>
      </div>

      {/* CARGO AND DESTINATION DETAILS */}
      <div className="grid grid-cols-2 gap-4 border-b-2 border-gray-200 p-2 shadow-md hover:shadow-xl md:col-span-2">
        <div className="col-span-2 border-b-2 border-gray-100">
          <h3 className="font-medium text-wrap p-2 text-center">DISPATCH & CARGO DETAILS</h3>
        </div>

        <div>
          <label htmlFor="productType" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Product Type
          </label>
          <input
            onChange={handleChange}
            id="productType"
            type="text"
            required
            value={formData.productType || ''}
            placeholder="e.g., Crude Palm Oil"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div>
          <label htmlFor="intendedQuantity" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Intended Quantity (MT)
          </label>
          <input
            onChange={handleChange}
            id="intendedQuantity"
            type="text"
            required
            value={formData.intendedQuantity || ''}
            placeholder="Intended Quantity"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div>
          <label htmlFor="destination" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Destination
          </label>
          <input
            onChange={handleChange}
            id="destination"
            type="text"
            required
            value={formData.destination || ''}
            placeholder="Destination"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>

        <div>
          <label htmlFor="bookingStatus" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Booking Status
          </label>
          <select
            onChange={handleChange}
            id="bookingStatus"
            value={formData.bookingStatus || 'Pending'}
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl bg-transparent"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Loaded">Loaded</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="col-span-2">
          <label htmlFor="remarks" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Remarks
          </label>
          <input
            onChange={handleChange}
            id="remarks"
            type="text"
            value={formData.remarks || ''}
            placeholder="Remarks or Special Instructions"
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
          />
        </div>
      </div>

      {error && <p className="text-red-500 md:col-span-2">{error}</p>}

      <button
        disabled={loading}
        type="submit"
        className="bg-slate-400 rounded-md p-2 hover:bg-slate-500 w-full md:col-span-2 text-white font-medium cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}