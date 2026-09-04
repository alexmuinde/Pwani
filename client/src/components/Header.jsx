import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Available document creation route for Transporter Project
  const documentRoutes = [
    { title: 'TRUCK BOOKING REPORT', route: '/truckBookingReport' },
  ];

  const getDocumentTitle = (doc) => {
    const match = documentRoutes.find((r) => r.route.slice(1) === doc.docType);
    return match ? match.title : doc.docType?.toUpperCase() || 'DOCUMENT';
  };

  const getSummaryFields = (doc) => {
    const fields = [];

    // Mapping for Truck Booking Report schema fields
    if (doc.docType === 'truckBookingReport') {
      if (doc.truckNumber) fields.push({ label: 'Truck No', value: doc.truckNumber });
      if (doc.driverName) fields.push({ label: 'Driver', value: doc.driverName });
      if (doc.transporterName) fields.push({ label: 'Transporter', value: doc.transporterName });
      if (doc.productType) fields.push({ label: 'Product', value: doc.productType });
      if (doc.destination) fields.push({ label: 'Destination', value: doc.destination });
      if (doc.bookingDate) fields.push({ label: 'Date', value: doc.bookingDate });

      return fields.slice(0, 3);
    }

    // Fallback extraction
    if (doc.truckNumber) fields.push({ label: 'Truck No', value: doc.truckNumber });
    if (doc.driverName) fields.push({ label: 'Driver', value: doc.driverName });
    if (doc.productType) fields.push({ label: 'Product', value: doc.productType });

    return fields.slice(0, 3);
  };

  // Real-time backend search for matching document input fields
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        return;
      }

      try {
        const res = await fetch(`/api/createDoc/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSearchResults(data);
          setIsDropdownOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Title search navigation logic
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const matchedDoc = documentRoutes.find((doc) =>
      doc.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    if (matchedDoc) {
      setIsDropdownOpen(false);
      setSearchTerm('');
      navigate(matchedDoc.route); // Opens blank form to create new record
    }
  };

  return (
    <header className="bg-slate-400 shadow-md relative z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="text-sm font-bold sm:text-xl flex flex-wrap">
            <span className="text-blue-500">Sheikh</span>
            <span className="text-slate-700">Ali</span>
            <span className="text-blue-500">Transporters</span>
          </h1>
        </Link>

        {/* SEARCH BAR */}
        <div className="relative w-64 sm:w-80" ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchResults.length > 0 && setIsDropdownOpen(true)}
              placeholder="Search title, truck, product..."
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl transition-all text-sm bg-slate-100 rounded-t-md"
            />
          </form>

          {/* INPUT MATCH DROPDOWN */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-gray-200 rounded-md shadow-xl max-h-80 overflow-y-auto z-50 p-2 flex flex-col gap-2">
              {searchResults.length === 0 ? (
                <p className="text-xs text-gray-500 text-center p-2">No matching document fields found.</p>
              ) : (
                searchResults.map((doc) => {
                  const summary = getSummaryFields(doc);
                  return (
                    <div
                      key={doc._id}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setSearchTerm('');
                        navigate(`/${doc.docType}/${doc._id}`);
                      }}
                      className="flex flex-col gap-1 border-b-2 border-gray-200 p-2 shadow-md hover:shadow-xl hover:border-blue-500 cursor-pointer transition-all bg-white rounded-sm"
                    >
                      <div className="flex justify-between items-center border-b pb-1">
                        <span className="font-semibold text-blue-600 text-[11px]">
                          {getDocumentTitle(doc)}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 pt-1">
                        {summary.map((item, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-[9px] font-semibold text-gray-500 uppercase">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-gray-800 truncate font-medium">
                              {item.value || 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <ul className="flex gap-4 items-center">
          <li>
            <Link to="/" className="hidden sm:inline text-slate-700 hover:text-blue-500 font-medium">
              Home
            </Link>
          </li>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="rounded-full mx-auto block sm:mx-0 sm:shrink-0 h-10 w-10 cursor-pointer border border-blue-700 object-cover shadow-sm hover:scale-102 transition-transform"
              />
            ) : (
              <li className="sm:inline text-slate-700 hover:text-blue-500 font-medium">Login</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}