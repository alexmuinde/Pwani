import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState(null);

  // Fetch documents created by current user
  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        setDocLoading(true);
        setDocError(null);

        const res = await fetch(`/api/createDoc/userDocuments/${currentUser._id}`);
        const data = await res.json();

        if (data.success === false) {
          setDocError(data.message);
          setDocLoading(false);
          return;
        }

        // Sort by updatedAt descending (latest updated at top)
        const sortedDocs = (data || []).sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setDocuments(sortedDocs);
        setDocLoading(false);
      } catch (err) {
        setDocError('Failed to fetch user documents.');
        setDocLoading(false);
      };
    };

    if (currentUser?._id) {
      fetchUserDocuments();
    }
  }, [currentUser?._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Format dynamic display title for document card
  const getDocumentTitle = (doc) => {
    if (doc.docType === 'truckBookingReport') return 'TRUCK BOOKING REPORT';
    return doc.docType?.toUpperCase() || 'DOCUMENT';
  };

  // Extract up to 3 field key-value pairs for preview
  const getSummaryFields = (doc) => {
    const fields = [];

    if (doc.docType === 'truckBookingReport') {
      if (doc.truckNumber) fields.push({ label: 'Truck No', value: doc.truckNumber });
      if (doc.driverName) fields.push({ label: 'Driver', value: doc.driverName });
      if (doc.transporterName) fields.push({ label: 'Transporter', value: doc.transporterName });
      if (doc.productType) fields.push({ label: 'Product', value: doc.productType });
      if (doc.destination) fields.push({ label: 'Destination', value: doc.destination });
      if (doc.bookingDate) fields.push({ label: 'Date', value: doc.bookingDate });

      return fields.slice(0, 3);
    }

    // Fallback for general models
    if (doc.truckNumber) fields.push({ label: 'Truck No', value: doc.truckNumber });
    if (doc.driverName) fields.push({ label: 'Driver', value: doc.driverName });
    if (doc.productType) fields.push({ label: 'Product', value: doc.productType });

    return fields.slice(0, 3);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* COLUMN 1: USER PROFILE CREDENTIALS */}
        <div className="flex flex-col gap-4 border-b-2 md:border-b-0 md:border-r-2 border-gray-200 p-2 shadow-md hover:shadow-xl">
          <img
            defaultValue={currentUser?.avatar}
            src={currentUser?.avatar}
            alt="User Avatar"
            className="rounded-full mx-auto block sm:mx-0 sm:shrink-0 h-20 w-20 cursor-pointer border border-blue-700 object-cover shadow-sm hover:scale-102 transition-transform"
          />
          <div className="w-full flex flex-col">
            <div>
              <input
                onChange={handleChange}
                value={formData.username ?? currentUser?.username ?? ''}
                id="username"
                type="text"
                placeholder={currentUser?.username}
                className="w-full border-b-2 border-gray-300 p-2 mb-4 focus:outline-none focus:border-blue-500 hover:shadow-xl"
              />
              <input
                onChange={handleChange}
                value={formData.email ?? currentUser?.email ?? ''}
                id="email"
                type="email"
                placeholder={currentUser?.email}
                className="w-full border-b-2 border-gray-300 p-2 mb-4 focus:outline-none focus:border-blue-500 hover:shadow-xl"
              />
              <input
                onChange={handleChange}
                value={formData.password ?? ''}
                id="password"
                type="password"
                placeholder="New Password"
                className="w-full border-b-2 border-gray-300 p-2 mb-4 focus:outline-none focus:border-blue-500 hover:shadow-xl"
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Loading...' : 'Update Credentials'}
            </button>
          </div>
        </div>

        {/* COLUMN 2: DYNAMIC USER DOCUMENTS */}
        <div className="flex flex-col gap-4 border-b-2 md:border-b-0 border-gray-200 p-2 shadow-md hover:shadow-xl">
          <div className="p-2 w-full border-b-2 border-gray-100">
            <h4 className="text-center font-bold uppercase">My Documents</h4>
          </div>

          {docLoading && <p className="text-center text-gray-500 text-sm">Loading documents...</p>}
          {docError && <p className="text-center text-red-500 text-sm">{docError}</p>}

          {!docLoading && documents.length === 0 && (
            <p className="text-center text-gray-500 text-sm">No documents found.</p>
          )}

          <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-1">
            {documents.map((doc) => {
              const summary = getSummaryFields(doc);

              return (
                <div
                  key={doc._id}
                  onClick={() => navigate(`/${doc.docType}/${doc._id}`)}
                  className="flex flex-col gap-2 border-b-2 border-gray-200 p-2 shadow-md hover:shadow-xl hover:border-blue-500 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="font-semibold text-blue-600 text-xs">
                      {getDocumentTitle(doc)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 3 summary inputs with labels side by side */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {summary.map((item, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">
                          {item.label}
                        </span>
                        <span className="text-xs text-gray-800 truncate font-medium">
                          {item.value || 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}