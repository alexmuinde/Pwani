import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {loginStart, loginSuccess, loginFailure} from '../redux/user/userSlice'

export default function Login() {
  const[formData, setFormData] = useState({})
  const {loading, error} = useSelector((state) => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value })
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        dispatch(loginStart())
        const res = await fetch('api/auth/login',
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
          dispatch(loginFailure(data.message))
          return
      }
      dispatch(loginSuccess(data))
      navigate('/')
      } catch (error) {
        dispatch(loginFailure(error.message))
      }
      
    }
    
  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>Please Login</h1>
      <form onSubmit={handleSubmit} className='flex flex-col w-1/3 mx-auto'>
        <input onChange={handleChange} id="email" required type="email" placeholder='Email' className='border-b-2 border-gray-300  p-2 mb-4 focus:outline-none focus:border-blue-500' />
        <input onChange={handleChange} id="password" required type="password" placeholder='Password' className='border-b-2 border-gray-300  p-2 mb-4 focus:outline-none focus:border-blue-500' />
        <button disabled={loading} type="submit" className='bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600'>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p className='text-center mt-4'>Dont have an account? <a href="/signUp" className='text-blue-500 hover:underline'>Sign Up</a></p>
      {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
    </div>
  )
}
