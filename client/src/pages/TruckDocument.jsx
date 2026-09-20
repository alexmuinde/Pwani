import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchDocStart,
  fetchDocSuccess,
  fetchDocFailure,
  saveDocStart,
  saveDocSuccess,
  saveDocFailure,
} from '../redux/document/documentSlice'

export default function TruckDocument() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.document)

  const [formData, setFormData] = useState({
    truckNumber: '',
    trailerNumber: '',
    driverName: '',
    idNumber: '',
    drivingLicenceNumber: '',
    phoneNumber: '',
    email: '',
  })

  useEffect(() => {
    if (!id) return

    const fetchDocument = async () => {
      try {
        dispatch(fetchDocStart())
        const res = await fetch(`/api/createDoc/truckDocument/get/${id}`)
        const data = await res.json()

        if (data.success === false) {
          dispatch(fetchDocFailure(data.message))
          return
        }

        setFormData(data)
        dispatch(fetchDocSuccess(data))
      } catch (err) {
        dispatch(fetchDocFailure(err.message || 'Failed to fetch document details.'))
      }
    }

    fetchDocument()
  }, [id, dispatch])

  // Field change handler for fixed form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(saveDocStart())

      const isUpdating = Boolean(id)
      const method = isUpdating ? 'PUT' : 'POST'
      const endpoint = isUpdating
        ? `/api/createDoc/truckDocument/${id}`
        : '/api/createDoc/truckDocument'

      const payload = { ...formData }
      delete payload._id
      delete payload.__v
      delete payload.createdAt
      delete payload.updatedAt
      delete payload.userReference

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success === false) {
        dispatch(saveDocFailure(data.message))
        return
      }

      dispatch(saveDocSuccess(data))

      const savedDocId = data.data?._id || data._id || id

      if (!id && savedDocId) {
        navigate(`/truckDocument/${savedDocId}`)
      }
    } catch (err) {
      dispatch(saveDocFailure(err.message || 'An error occurred while submitting.'))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* DIV 1: DOCUMENT TITLES */}
      <div className="md:col-span-2 w-full">
        <h1 className="text-xl font-medium p-2 text-center">
          Sheikh Ali Transporters
        </h1>
        <h2 className="p-2 text-center uppercase font-semibold">Truck Document</h2>
      </div>

      {/* DIV 2: TRUCK SPECIFICS */}
      <div className="flex flex-col gap-4 border-b-2 md:border-b-0 md:border-r-2 border-gray-200 p-2 shadow-md hover:shadow-xl">
        <div className="border-b-2 border-gray-100 pb-2">
          <h3 className="font-medium text-center uppercase">Truck Specifics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="truckNumber" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Truck Number
            </label>
            <input
              onChange={handleChange}
              id="truckNumber"
              type="text"
              placeholder="Truck Number"
              value={formData.truckNumber || ''}
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
              placeholder="Trailer Number"
              value={formData.trailerNumber || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* DIV 3: DRIVER INFORMATION */}
      <div className="flex flex-col gap-4 p-2 shadow-md hover:shadow-xl">
        <div className="border-b-2 border-gray-100 pb-2">
          <h3 className="font-medium text-center uppercase">Driver Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="driverName" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Driver Name
            </label>
            <input
              onChange={handleChange}
              id="driverName"
              type="text"
              placeholder="Driver Name"
              value={formData.driverName || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              ID Number
            </label>
            <input
              onChange={handleChange}
              id="idNumber"
              type="text"
              placeholder="ID Number"
              value={formData.idNumber || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>

          <div>
            <label htmlFor="drivingLicenceNumber" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Driving Licence Number
            </label>
            <input
              onChange={handleChange}
              id="drivingLicenceNumber"
              type="text"
              placeholder="Licence Number"
              value={formData.drivingLicenceNumber || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Phone Number
            </label>
            <input
              onChange={handleChange}
              id="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Email Address
            </label>
            <input
              onChange={handleChange}
              id="email"
              type="email"
              placeholder="Email Address"
              value={formData.email || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="md:col-span-2 flex justify-end gap-4 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Submitting...' : id ? 'Update Document' : 'Submit'}
        </button>
      </div>

      {error && (
        <div className="md:col-span-2 text-red-500 text-sm text-center font-medium mt-2">
          {error}
        </div>
      )}
    </form>
  )
}