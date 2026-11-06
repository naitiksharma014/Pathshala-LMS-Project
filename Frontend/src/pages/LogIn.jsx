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


function LogIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        serverUrl + '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data?.token) {
        dispatch(setUserData(response.data.user)); // store only the user object
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Log-In successful:', result.user);

      let userData = result.user;
      let name = userData.displayName;
      let email = userData.email;
      let role = ""
      
      const response = await axios.post(serverUrl + '/api/auth/google-auth', {
        name,
        email,
        role
      }, { withCredentials: true });

      dispatch(setUserData(response.data));
      navigate('/'); // Redirect to home page after successful signup
      toast.success('Login successful!');

    }
    catch (error) {
      console.log("ERROR:", error);
      console.log("RESPONSE:", error.response);
      alert(error?.response?.data?.message || error.message);
    }
  }

  return (
    <div className='bg-[#dddbdb] w-screen h-screen flex items-center justify-center'>

      <form
        className='w-[90%] md:w-[800px] min-h-[600px] bg-white shadow-xl rounded-2xl flex'
        onSubmit={handleLogin}
      >

        {/* Left Div */}
        <div className='md:w-[50%] w-full flex flex-col items-center justify-center gap-3'>

          <div>
            <h1 className='font-semibold text-black text-2xl'>Welcome Back</h1>
            <h2 className='text-[#999797] text-[18px]'>Login to your account</h2>
          </div>

          <div className='flex flex-col gap-4 w-[80%] items-start justify-center px-3'>

            {/* Email */}
            <div className="w-full mt-2">
              <label htmlFor="email" className='font-semibold'>Email</label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                className='border w-full h-[40px] border-[#e7e6e6] text-[15px] px-4 rounded-md'
                placeholder='Enter your email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            {/* Password */}
            <div className="w-full mt-2 relative">
              <label htmlFor="password" className='font-semibold'>Password</label>

              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
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

            {/* Login Button */}
            <button
              type="submit"
              className='w-full h-[40px] bg-black text-white rounded-md cursor-pointer flex items-center justify-center hover:bg-[#1a1a1a]'
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color={'#ffffff'} />
              ) : (
                'Login'
              )}
            </button>

            {/* Forgot Password */}
            <span className='text-[15px] items-center justify-center text-[#6f6f6f] underline underline-offset-1 cursor-pointer
            ' onClick={() => navigate('/forgot-password')}>
              Forgot Password?
            </span>

            <div className='gap-2 w-full flex items-center justify-between'>
              <div className='w-[25%] h-[1px] bg-[#c4c4c4]'></div>
              <div className='text-[15px] text-[#6f6f6f] whitespace-nowrap'>
                Or continue with
              </div>
              <div className='w-[25%] h-[1px] bg-[#c4c4c4]'></div>
            </div>

            <div className='w-full h-[40px] border border-black rounded-md flex items-center justify-center gap-1 cursor-pointer' onClick={googleLogin}>
              <img src={google} alt="Google" className='w-[25px]' />
              <span className='text-[18px] text-gray-500'>
                Google
              </span>
            </div>

            <div className='text-[15px] text-[#6f6f6f]'>
              Don't have an account?{' '}
              <span
                className='underline underline-offset-1 text-[black] cursor-pointer'
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </span>
            </div>

          </div>

        </div>

        {/* Right Div */}
        <div className='w-[50%] rounded-2xl bg-black md:flex items-center justify-center flex-col hidden'>
          <img src={logo} alt="Logo" className='w-30 shadow-2xl' />
          <span className='text-white text-xl font-bold mt-4'>Pathshala</span>
        </div>

      </form>

    </div>
  )
}

export default LogIn;