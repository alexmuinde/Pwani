import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {

  const[formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch('api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )
      const data = await res.json()
      if(data.success === false) {
        setLoading(false)
        setError(data.message)
        return
    }
    setLoading(false)
    setError(null)
    navigate('/login')
    } catch (error) {
      setLoading(false)
      setError('An error occurred while signing up.')
    }
    
  }
  

  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>Please Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col w-1/3 mx-auto'>
        <input onChange={handleChange} id="username" required type="text" placeholder='Username' className='border-b-2 border-gray-300  p-2 mb-4 focus:outline-none focus:border-blue-500' />
        <input onChange={handleChange} id="email" required type="email" placeholder='Email' className='border-b-2 border-gray-300  p-2 mb-4 focus:outline-none focus:border-blue-500' />
        <input onChange={handleChange} id="password" required type="password" placeholder='Password' className='border-b-2 border-gray-300  p-2 mb-4 focus:outline-none focus:border-blue-500' />
        <button disabled={loading} type="submit" className='bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <p className='text-center mt-4'>Already have an account? <a href="/login" className='text-blue-500 hover:underline'>Login</a></p>
      {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
    </div>
  )
}
