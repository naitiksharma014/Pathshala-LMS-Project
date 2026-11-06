import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";



function ForgetPassword() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // step 1: send OTP
    const sendOTP = async() => {
       setLoading(true);
        try {
            const result = await axios.post(serverUrl + '/api/auth/send-otp', { email }, { withCredentials: true });
            console.log('OTP sent successfully:', result.data);

            setStep(2);
            toast.success('OTP sent successfully. Please check your email.');

        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // for step 2: verify OTP
    const verifyOTP = async() => {
        setLoading(true);

        try {
            const result = await axios.post(serverUrl + '/api/auth/verify-otp', { email, otp }, { withCredentials: true });
            console.log('OTP verified successfully:', result.data);
            setStep(3);

            setLoading(false);
            
            toast.success('OTP verified successfully. Please reset your password.');
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP. Please try again.');

        }
    }

    // for step 3: reset password
    const resetPassword = async() => {
        setLoading(true);

        try {

            if(newPassword !== confirmPassword) {
               return toast.error('Passwords do not match. Please try again.');
               
            }

            const result = await axios.post(serverUrl + '/api/auth/reset-password', { email, newPassword }, { withCredentials: true }); 
            console.log('Password reset successfully:', result.data);
            setLoading(false);
            navigate('/login');
            toast.success('Password reset successfully. Please log in with your new password.');
            
        
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Failed to reset password. Please try again.');
            setLoading(false);
        }
    }

    


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">


            {/* step 1 */}

            {step == 1 && (
                <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Forget Your Password
                    </h2>

                    <form className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Enter your email address
                            </label>

                            <input
                                id="email"
                                type="text"
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="you@example.com"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer"
                            disabled={loading}
                            onClick={(e) => {
                                e.preventDefault();
                                sendOTP();
                            }}>
                            { loading ? <ClipLoader size={30} color='white' /> : "Send OTP" }
                        </button>
                    </form>

                    <div
                        className="text-sm text-center mt-4 cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </div>
                </div>
            )}



            {/* step 2 */}

            {step == 2 && (
                <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Enter OTP
                    </h2>

                    <form className="space-y-4">
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Please enter the 4-digit code sent to your email.
                            </label>

                            <input
                                id="otp"
                                type="text"
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="* * * *"
                                required
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer"
                            disabled={loading}
                            onClick={(e) => {
                                e.preventDefault();
                                verifyOTP();
                            }}
                        >
                            { loading ? <ClipLoader size={30} color='white' /> : "Verify OTP" }
                        </button>
                    </form>

                    <div
                        className="text-sm text-center mt-4 cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </div>
                </div>
            )}



            {/* step 3 */}
            {step == 3 && (
                <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                    <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                        Reset Your Password
                    </h2>

                    <p className='text-sm text-gray-500 text-center mb-6'>
                        Enter a new password below to regain access to your account.
                    </p>

                    <form className='space-y-4'>
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
                                New Password
                            </label>

                            <input
                                id='password'
                                type="text"
                                className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black'
                                placeholder="**********"
                                required
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                            />
                        </div>

                        <div>
                            <label htmlFor="conpassword" className='block text-sm font-medium text-gray-700'>
                                Confirm Password
                            </label>

                            <input
                                id='conpassword'
                                type="text"
                                className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black'
                                placeholder="**********"
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                            />
                        </div>

                        <button
                            type="submit"
                            className='w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer'
                            disabled={loading}
                            onClick={(e) => {
                                e.preventDefault();
                                resetPassword();
                            }}
                        >
                            {loading ? <ClipLoader size={30} color="white"/> : "Reset Password"}
                        </button>
                    </form>

                    <div
                        className='text-sm text-center mt-4 cursor-pointer'
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </div>
                </div>
            )}


        </div>
    );
}

export default ForgetPassword;
