import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/createDoc/all');
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }

        const sortedDocs = (data || []).sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setDocuments(sortedDocs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch documents.');
        setLoading(false);
      }
    };

    fetchAllDocuments();
  }, []);

  // Format dynamic title for document cards including all document types
  const getDocumentTitle = (doc) => {
    if (doc.docType === 'truckBookingReport') return 'TRUCK BOOKING REPORT';
    if (doc.docType === 'truckBookingList') return 'TRUCK BOOKING LIST';
    if (doc.docType === 'truckDocument') return 'TRUCK DOCUMENT';
    return doc.docType?.toUpperCase() || 'DOCUMENT';
  };

  // Extract up to 3 field key-value pairs for card preview
  const getSummaryFields = (doc) => {
    const fields = [];

    if (doc.docType === 'truckBookingReport') {
      if (doc.truckNumber) fields.push({ label: 'Truck No', value: doc.truckNumber });
      if (doc.driverName) fields.push({ label: 'Driver', value: doc.driverName });
      if (doc.transporterName) fields.push({ label: 'Transporter', value: doc.transporterName });
      if (doc.productType) fields.push({ label: 'Product', value: doc.productType });
      if (doc.destination) fields.push({ label: 'Destination', value: doc.destination });
      if (doc.bookingDate) fields.push({ label: 'Date', value: doc.bookingDate });
    } else if (doc.docType === 'truckBookingList') {
      if (doc.clientName) fields.push({ label: 'Client', value: doc.clientName });
      if (doc.truckNumber) fields.push({ label: 'Truck No', value: doc.truckNumber });
      if (doc.trailerNumber) fields.push({ label: 'Trailer No', value: doc.trailerNumber });
      if (doc.driverName) fields.push({ label: 'Driver', value: doc.driverName });
      if (doc.destination) fields.push({ label: 'Destination', value: doc.destination });
    } else if (doc.docType === 'truckDocument') {
      if (doc.truckNumber) fields.push({ label: 'Truck No', value: doc.truckNumber });
      if (doc.trailerNumber) fields.push({ label: 'Trailer No', value: doc.trailerNumber });
      if (doc.driverName) fields.push({ label: 'Driver', value: doc.driverName });
      if (doc.idNumber) fields.push({ label: 'ID No', value: doc.idNumber });
      if (doc.phoneNumber) fields.push({ label: 'Phone', value: doc.phoneNumber });
    } else {
      // General Fallback
      if (doc.truckNumber) fields.push({ label: 'Truck No', value: doc.truckNumber });
      if (doc.driverName) fields.push({ label: 'Driver', value: doc.driverName });
      if (doc.productType) fields.push({ label: 'Product', value: doc.productType });
    }

    // Always pad array to ensure 3 grid slots are available
    while (fields.length < 3) {
      fields.push({ label: '—', value: 'N/A' });
    }

    return fields.slice(0, 3);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-4 border-b-2 border-gray-200 p-4 shadow-md hover:shadow-xl bg-white">
        <div className="p-2 w-full border-b-2 border-gray-100">
          <h4 className="text-center font-bold uppercase text-gray-800 text-lg">
            All Recent Documents
          </h4>
        </div>

        {loading && <p className="text-center text-gray-500 text-sm">Loading documents...</p>}
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        {!loading && documents.length === 0 && (
          <p className="text-center text-gray-500 text-sm">No documents found.</p>
        )}

        <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
          {documents.map((doc) => {
            const summary = getSummaryFields(doc);
            const creatorUsername = doc.userReference?.username || 'Unknown User';

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
                  <span className="text-xs text-gray-500 font-medium">
                    By: <span className="font-semibold text-gray-700">{creatorUsername}</span>
                  </span>
                </div>

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
    </div>
  );
}