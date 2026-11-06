import React from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { auth, provider } from '../utils/firebase.js';
import { signInWithPopup } from "firebase/auth";



function SignUp() {

  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('Student');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSignup = async () => {
    setLoading(true)

    try {
      const result = await axios.post(serverUrl + '/api/auth/signup', {
        name,
        email,
        password,
        role
      }, { withCredentials: true });


      console.log('Signup successful:', result.data);
      dispatch(setUserData(result.data.user));
      setLoading(false)

      navigate('/'); // Redirect to home page after successful signup
      toast.success('Signup successful!');

    } catch (error) {
      console.log("ERROR:", error);
      console.log("RESPONSE:", error.response);
      alert(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false)
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign-In successful:', result.user);

      let userData = result.user;
      let name = userData.displayName;
      let email = userData.email;
      
      const response = await axios.post(serverUrl + '/api/auth/google-auth', {
        name,
        email,
        role
      }, { withCredentials: true });

      dispatch(setUserData(response.data));
      navigate('/'); // Redirect to home page after successful signup
      toast.success('Signin successful!');

    }
    catch (error) {
      console.log("ERROR:", error);
      console.log("RESPONSE:", error.response);
      alert(error?.response?.data?.message || error.message);
    }
  }

  return (
    <>
      <div className='bg-[#dddbdb] w-screen h-screen flex items-center justify-center'>

        <form className='w-[90%] md:w-[800px] min-h-[600px] bg-white shadow-xl rounded-2xl flex' onSubmit={(e) => e.preventDefault()}>

          {/* Left Div */}
          <div className='md:w-[50%] w-full flex flex-col items-center justify-center gap-3 py-6'>

            <div>
              <h1 className='font-semibold text-black text-2xl'>
                Let's Get Started
              </h1>
              <h2 className='text-[#999797] text-[18px]'>
                Sign up to get started
              </h2>
            </div>

            <div className='flex flex-col gap-4 w-[80%] items-start justify-center px-3'>

              {/* Name */}
              <div className="w-full">
                <label htmlFor="name" className='font-semibold'>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  className='border w-full h-[40px] border-[#e7e6e6] text-[15px] px-4 rounded-md'
                  placeholder='Enter your name'
                  onChange={(e) => setName(e.target.value)}
                  value={name}

                />
              </div>

              {/* Email */}
              <div className="w-full">
                <label htmlFor="email" className='font-semibold'>
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  className='border w-full h-[40px] border-[#e7e6e6] text-[15px] px-4 rounded-md'
                  placeholder='Enter your email'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>



              {/* Password */}
              <div className="w-full relative">
                <label htmlFor="password" className='font-semibold'>
                  Password
                </label>

                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className='border w-full h-[40px] border-[#e7e6e6] text-[15px] px-4 rounded-md'
                  placeholder='Enter your password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />

                {showPassword ? (
                  <IoMdEye
                    className='absolute right-4 top-[70%] -translate-y-1/2 w-5 h-5 cursor-pointer'
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <IoMdEyeOff
                    className='absolute right-4 top-[70%] -translate-y-1/2 w-5 h-5 cursor-pointer'
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>



              {/* Select Role */}
              <div className='flex md:w-[50%] w-[70%] gap-5 items-center justify-between'>
                <span className={`px-3 py-2 border-2 border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black ${role === 'Student' ? 'border-black' : 'border-[#646464]'}`} onClick={() => setRole('Student')}>
                  Student
                </span>

                <span className={`px-3 py-2 border-2 border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black ${role === 'Teacher' ? 'border-black' : 'border-[#646464]'}`} onClick={() => setRole('Teacher')}>
                  Teacher
                </span>
              </div>



              {/* Sign Up Button */}
              <button
                type="button"
                className='w-full h-[40px] bg-black text-white rounded-md cursor-pointer hover:bg-[#1a1a1a]'
                onClick={handleSignup}
                disabled={loading}

              >
                {loading ? <ClipLoader size={30} color='white' /> : 'Sign Up'}
              </button>



              {/* Divider */}
              <div className='w-full flex items-center justify-between gap-2'>
                <div className='flex-1 h-[1px] bg-[#c4c4c4]'></div>

                <div className='text-[15px] text-[#6f6f6f] whitespace-nowrap'>
                  Or continue with
                </div>

                <div className='flex-1 h-[1px] bg-[#c4c4c4]'></div>
              </div>

              {/* Google Button */}
              <div className='w-full h-[40px] border border-black rounded-md flex items-center justify-center gap-1 cursor-pointer' onClick={googleSignIn}>
                <img src={google} alt="Google" className='w-[25px]' />
                <span className='text-[18px] text-gray-500'>
                  oogle
                </span>
              </div>

              <div className='text-[15px] text-[#6f6f6f]'>
                Already have an account?{' '}
                <span className='underline underline-offset-1 text-[black]' onClick={() => navigate('/login')}>
                  Login
                </span>
              </div>

            </div>
          </div>

          {/* Right Div */}
          <div className='w-[50%] rounded-2xl bg-black md:flex items-center justify-center flex-col hidden'>
            <img
              src={logo}
              alt="Logo"
              className='w-30 shadow-2xl'
            />

            <span className='text-white text-xl font-bold mt-4'>
              Pathshala
            </span>
          </div>

        </form>

      </div>
      
    </>
  )
}

export default SignUp 