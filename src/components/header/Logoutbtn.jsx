import React from 'react'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import authService from '../../appWrite/authService'
import { logOut } from '../../store/authSlice'

function Logoutbtn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = () =>{
    authService.logOut().then(() => {
      dispatch(logOut())
      navigate("/login")
    }).catch((error) =>{
      console.log("logout failed", error);
    })
  }
  return (
    <button 
    onClick={logoutHandler}
    className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    >Logout</button>
  )
}

export default Logoutbtn