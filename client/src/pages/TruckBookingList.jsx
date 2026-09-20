import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { PlusCircle, Trash2, Plus, Minus } from 'lucide-react'
import {
  fetchDocStart,
  fetchDocSuccess,
  fetchDocFailure,
  saveDocStart,
  saveDocSuccess,
  saveDocFailure,
} from '../redux/document/documentSlice'

export default function TruckBookingList() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.document)

  const [formData, setFormData] = useState({
    firstDate: '',
    secondDate: '',
    clientName: '',
    product: '',
    trucks: [
      {
        truckNumber: '',
        truckDriver: '',
        chambers: [''],
        totalQuantity: 0,
        bottomSeals: [''],
        topSeals: [''],
      },
    ],
  })

  useEffect(() => {
    if (!id) return

    const fetchDocument = async () => {
      try {
        dispatch(fetchDocStart())
        const res = await fetch(`/api/createDoc/truckBookingList/get/${id}`)
        const data = await res.json()

        if (data.success === false) {
          dispatch(fetchDocFailure(data.message))
          return
        }

        setFormData({
          ...data,
          trucks: data.trucks?.length
            ? data.trucks.map((truck) => ({
                ...truck,
                chambers: truck.chambers?.length ? truck.chambers : [''],
                bottomSeals: truck.bottomSeals?.length ? truck.bottomSeals : [''],
                topSeals: truck.topSeals?.length ? truck.topSeals : [''],
              }))
            : [
                {
                  truckNumber: '',
                  truckDriver: '',
                  chambers: [''],
                  totalQuantity: 0,
                  bottomSeals: [''],
                  topSeals: [''],
                },
              ],
        })
        dispatch(fetchDocSuccess(data))
      } catch (err) {
        dispatch(fetchDocFailure(err.message || 'Failed to fetch document details.'))
      }
    }

    fetchDocument()
  }, [id, dispatch])

  // General Booking Info Handler (Div 2)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // Truck Level Handler
  const handleTruckChange = (truckIndex, field, value) => {
    const updatedTrucks = [...formData.trucks]
    updatedTrucks[truckIndex] = { ...updatedTrucks[truckIndex], [field]: value }
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  // Helper to recalculate Total Quantity
  const calculateTotal = (chambersArray) => {
    return chambersArray.reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
  }

  // Dynamic Handlers for Chambers
  const handleChamberChange = (truckIndex, chamberIndex, value) => {
    const updatedTrucks = [...formData.trucks]
    const updatedChambers = [...updatedTrucks[truckIndex].chambers]
    updatedChambers[chamberIndex] = value

    updatedTrucks[truckIndex].chambers = updatedChambers
    updatedTrucks[truckIndex].totalQuantity = calculateTotal(updatedChambers)

    setFormData({ ...formData, trucks: updatedTrucks })
  }

  const addChamberField = (truckIndex) => {
    const updatedTrucks = [...formData.trucks]
    updatedTrucks[truckIndex].chambers.push('')
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  const removeChamberField = (truckIndex, chamberIndex) => {
    const updatedTrucks = [...formData.trucks]
    if (updatedTrucks[truckIndex].chambers.length === 1) return
    updatedTrucks[truckIndex].chambers.splice(chamberIndex, 1)
    updatedTrucks[truckIndex].totalQuantity = calculateTotal(updatedTrucks[truckIndex].chambers)
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  // Dynamic Handlers for Bottom Seals
  const handleBottomSealChange = (truckIndex, sealIndex, value) => {
    const updatedTrucks = [...formData.trucks]
    const updatedSeals = [...updatedTrucks[truckIndex].bottomSeals]
    updatedSeals[sealIndex] = value
    updatedTrucks[truckIndex].bottomSeals = updatedSeals
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  const addBottomSealField = (truckIndex) => {
    const updatedTrucks = [...formData.trucks]
    updatedTrucks[truckIndex].bottomSeals.push('')
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  const removeBottomSealField = (truckIndex, sealIndex) => {
    const updatedTrucks = [...formData.trucks]
    if (updatedTrucks[truckIndex].bottomSeals.length === 1) return
    updatedTrucks[truckIndex].bottomSeals.splice(sealIndex, 1)
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  // Dynamic Handlers for Top Seals
  const handleTopSealChange = (truckIndex, sealIndex, value) => {
    const updatedTrucks = [...formData.trucks]
    const updatedSeals = [...updatedTrucks[truckIndex].topSeals]
    updatedSeals[sealIndex] = value
    updatedTrucks[truckIndex].topSeals = updatedSeals
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  const addTopSealField = (truckIndex) => {
    const updatedTrucks = [...formData.trucks]
    updatedTrucks[truckIndex].topSeals.push('')
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  const removeTopSealField = (truckIndex, sealIndex) => {
    const updatedTrucks = [...formData.trucks]
    if (updatedTrucks[truckIndex].topSeals.length === 1) return
    updatedTrucks[truckIndex].topSeals.splice(sealIndex, 1)
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  // Main Truck Dynamic Array Handlers
  const addTruckEntry = () => {
    setFormData({
      ...formData,
      trucks: [
        ...formData.trucks,
        {
          truckNumber: '',
          truckDriver: '',
          chambers: [''],
          totalQuantity: 0,
          bottomSeals: [''],
          topSeals: [''],
        },
      ],
    })
  }

  const removeTruckEntry = (index) => {
    if (formData.trucks.length === 1) return
    const updatedTrucks = formData.trucks.filter((_, i) => i !== index)
    setFormData({ ...formData, trucks: updatedTrucks })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(saveDocStart())

      const isUpdating = Boolean(id)
      const method = isUpdating ? 'PUT' : 'POST'
      const endpoint = isUpdating
        ? `/api/createDoc/truckBookingList/${id}`
        : '/api/createDoc/truckBookingList'

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
        navigate(`/truckBookingList/${savedDocId}`)
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
        <h2 className="p-2 text-center uppercase font-semibold">Truck Booking List</h2>
      </div>

      {/* DIV 2: GENERAL INFORMATION */}
      <div className="flex flex-col gap-4 border-b-2 md:border-b-0 md:border-r-2 border-gray-200 p-2 shadow-md hover:shadow-xl">
        <div className="border-b-2 border-gray-100 pb-2">
          <h3 className="font-medium text-center uppercase">General Booking Details</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstDate" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              First Date
            </label>
            <input
              onChange={handleChange}
              id="firstDate"
              type="date"
              value={formData.firstDate || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>

          <div>
            <label htmlFor="secondDate" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Second Date
            </label>
            <input
              onChange={handleChange}
              id="secondDate"
              type="date"
              value={formData.secondDate || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>

          <div>
            <label htmlFor="clientName" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Client Name
            </label>
            <input
              onChange={handleChange}
              id="clientName"
              type="text"
              placeholder="Client Name"
              value={formData.clientName || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>

          <div>
            <label htmlFor="product" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Product
            </label>
            <input
              onChange={handleChange}
              id="product"
              type="text"
              placeholder="Product"
              value={formData.product || ''}
              className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* DIV 3: TRUCK LIST & SPECIFICS */}
      <div className="flex flex-col gap-4 p-2 shadow-md hover:shadow-xl">
        <div className="border-b-2 border-gray-100 pb-2 flex justify-between items-center">
          <h3 className="font-medium uppercase">Truck List</h3>
          {/* Add Truck Icon in Div 3 Header */}
          <button
            type="button"
            onClick={addTruckEntry}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold uppercase cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Truck</span>
          </button>
        </div>

        {formData.trucks.map((truck, truckIdx) => (
          <div key={truckIdx} className="border-b-2 border-gray-200 pb-4 mb-2 flex flex-col gap-4 relative">
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="text-xs font-bold text-gray-600">Truck #{truckIdx + 1}</span>
              {formData.trucks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTruckEntry(truckIdx)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold uppercase cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Truck</span>
                </button>
              )}
            </div>

            {/* Truck Number & Driver */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Truck Number
                </label>
                <input
                  type="text"
                  placeholder="Truck Number"
                  value={truck.truckNumber || ''}
                  onChange={(e) => handleTruckChange(truckIdx, 'truckNumber', e.target.value)}
                  className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Truck Driver
                </label>
                <input
                  type="text"
                  placeholder="Truck Driver"
                  value={truck.truckDriver || ''}
                  onChange={(e) => handleTruckChange(truckIdx, 'truckDriver', e.target.value)}
                  className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500 hover:shadow-xl"
                />
              </div>
            </div>

            {/* DYNAMIC CHAMBERS SECTION */}
            <div className="bg-gray-50/50 p-2 rounded flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-600 uppercase">Chamber Quantities</span>
                <button
                  type="button"
                  onClick={() => addChamberField(truckIdx)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold uppercase cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Chamber</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {truck.chambers.map((chamberVal, chamberIdx) => (
                  <div key={chamberIdx} className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder={`Chamber ${chamberIdx + 1}`}
                      value={chamberVal || ''}
                      onChange={(e) => handleChamberChange(truckIdx, chamberIdx, e.target.value)}
                      className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                    />
                    {truck.chambers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChamberField(truckIdx, chamberIdx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* READ-ONLY TOTAL QUANTITY */}
              <div className="mt-2 border-t pt-2">
                <label className="block text-xs font-bold text-blue-700 uppercase mb-1">
                  Total Quantity (Read-Only Sum)
                </label>
                <input
                  type="number"
                  readOnly
                  value={truck.totalQuantity}
                  className="w-full border-b-2 border-blue-500 p-2 bg-blue-50 font-bold text-blue-900 cursor-not-allowed"
                />
              </div>
            </div>

            {/* DYNAMIC BOTTOM SEALS SECTION */}
            <div className="bg-gray-50/50 p-2 rounded flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-600 uppercase">Bottom Seals</span>
                <button
                  type="button"
                  onClick={() => addBottomSealField(truckIdx)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold uppercase cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Bottom Seal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {truck.bottomSeals.map((sealVal, sealIdx) => (
                  <div key={sealIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Bottom Seal #${sealIdx + 1}`}
                      value={sealVal || ''}
                      onChange={(e) => handleBottomSealChange(truckIdx, sealIdx, e.target.value)}
                      className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                    />
                    {truck.bottomSeals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBottomSealField(truckIdx, sealIdx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DYNAMIC TOP SEALS SECTION */}
            <div className="bg-gray-50/50 p-2 rounded flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-600 uppercase">Top Seals</span>
                <button
                  type="button"
                  onClick={() => addTopSealField(truckIdx)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold uppercase cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Top Seal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {truck.topSeals.map((sealVal, sealIdx) => (
                  <div key={sealIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Top Seal #${sealIdx + 1}`}
                      value={sealVal || ''}
                      onChange={(e) => handleTopSealChange(truckIdx, sealIdx, e.target.value)}
                      className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                    />
                    {truck.topSeals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTopSealField(truckIdx, sealIdx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Submission Button */}
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