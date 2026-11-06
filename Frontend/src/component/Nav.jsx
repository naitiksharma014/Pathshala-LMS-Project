import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { IoPersonCircle } from 'react-icons/io5'
import { RxHamburgerMenu } from 'react-icons/rx'
import { GiSplitCross } from 'react-icons/gi'

import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import logo from '../assets/logo.jpg' // <-- adjust to your real logo path

const pill =
  'px-[20px] py-[10px] border-2 border-white text-white bg-[#000000d5] rounded-[10px] text-[18px] font-light cursor-pointer'

const mobileBtn =
  'w-[200px] h-[65px] border-2 border-white flex items-center justify-center text-white bg-black rounded-[10px] text-[18px] font-light cursor-pointer'

function Nav() {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [show, setShow] = useState(false)       // desktop profile dropdown
  const [showHam, setShowHam] = useState(false) // mobile slide-in menu

  const handleLogOut = async () => {
    try {
      const result = await axios.get(serverUrl + '/api/auth/logout', {
        withCredentials: true,
      })
      dispatch(setUserData(null))
      console.log(result.data)
      toast.success('Logout Successfully')
      setShow(false)
      setShowHam(false)
      navigate('/login')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Logout failed')
    }
  }

  const goTo = (path) => {
    setShow(false)
    setShowHam(false)
    navigate(path)
  }

  const initial = userData?.name?.slice(0, 1).toUpperCase()

  return (
    <div>
      {/* ---------- Top bar ---------- */}
      <div className="w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10">
        <div className="lg:w-[20%] w-[40%] lg:pl-[50px]">
          <img
            src={logo}
            alt="Logo"
            className="w-[60px] rounded-[5px] border-2 border-white"
          />
        </div>


        {/* Desktop actions */}
        <div className="w-[30%] hidden lg:flex items-center justify-center gap-4">

          {/* Profile button and dropdown */}
          <div className="relative">

            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt="Profile"
                className="w-[50px] h-[50px] rounded-full border-2 border-white bg-black cursor-pointer object-cover"
                onClick={() => setShow(prev => !prev)}
              />
            ) : userData ? (
              <div
                className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer"
                onClick={() => setShow(prev => !prev)}
              >
                {initial}
              </div>
            ) : (
              <IoPersonCircle
                className="w-[50px] h-[50px] fill-black cursor-pointer"
                onClick={() => setShow(prev => !prev)}
              />
            )}

            {/* Profile dropdown */}
            {show && userData && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-2 border-black z-50 min-w-max">

                <span
                  className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 cursor-pointer"
                  onClick={() => goTo('/profile')}
                >
                  My Profile
                </span>

                <span
                  className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 cursor-pointer"
                  onClick={() => goTo('/mycourses')}
                >
                  My Courses
                </span>

              </div>
            )}

          </div>

          {/* Dashboard */}
          {userData?.role === 'Teacher' && (
            <div
              className={pill}
              onClick={() => goTo('/dashboard')}
            >
              Dashboard
            </div>
          )}

          {/* Login / Logout */}
          {!userData ? (
            <span
              className={pill}
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          ) : (
            <span
              className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer"
              onClick={handleLogOut}
            >
              Logout
            </span>
          )}

        </div>


        {/* Hamburger (mobile only) */}
        <RxHamburgerMenu
          className="w-[35px] h-[35px] lg:hidden text-white cursor-pointer"
          onClick={() => setShowHam((prev) => !prev)}
        />

        {/* ---------- Mobile slide-in menu ---------- */}
        <div
          className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden transition-transform duration-[600ms] ${showHam ? 'translate-x-[0]' : 'translate-x-[-100%]'
            }`}
        >
          <GiSplitCross
            className="w-[35px] h-[35px] fill-white absolute top-5 right-[4%] cursor-pointer"
            onClick={() => setShowHam((prev) => !prev)}
          />

          {!userData && (
            <IoPersonCircle className="w-[50px] h-[50px] fill-black cursor-pointer" />
          )}

          {userData?.photoUrl ? <img src={userData?.photoUrl} className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer" /> :
            <div
              className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            >
              {initial}
            </div>
          }

          {/* {userData && (
            <>
              <div className={mobileBtn} onClick={() => goTo('/profile')}>
                My Profile
              </div>
              <div className={mobileBtn} onClick={() => goTo('/mycourses')}>
                My Courses
              </div>
            </>
          )} */}

          <>
            <div className={mobileBtn} onClick={() => goTo('/profile')}>
              My Profile
            </div>
            <div className={mobileBtn} onClick={() => goTo('/mycourses')}>
              My Courses
            </div>
          </>






          {userData?.role === 'Teacher' && (
            <div className={mobileBtn} onClick={() => goTo('/dashboard')}>
              Dashboard
            </div>
          )}

          {!userData ? (
            <span className={mobileBtn} onClick={() => goTo('/login')}>
              Login
            </span>
          ) : (
            <span className={mobileBtn} onClick={handleLogOut}>
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Nav