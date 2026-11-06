import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/SignUp.jsx'
import Login from './pages/LogIn.jsx'
import axios from 'axios';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from './customHook/getCurrentUser.js';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile.jsx'
import { Navigate } from 'react-router-dom'
import ForgotPassword from './pages/ForgotPassword.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Dashboard from './pages/Educator/Dashboard.jsx'
import Courses from './pages/Educator/Courses.jsx'
import CreateCourse from './pages/Educator/CreateCourse.jsx'
import getCreatorCourse from "./customHook/getCreatorCourse";
import EditCourse from './pages/Educator/EditCourse.jsx'
import getPublishedCourse from './customHook/getPublishedCourse.js';
import AllCourses from './pages/AllCourses';
import CreateLecture from './pages/Educator/CreateLecture';
import EditLecture from './pages/Educator/EditLecture';
import ViewCourse from './pages/ViewCourse.jsx';
import ScrollToTop from './component/ScrollToTop.jsx';
import ViewLectures from './pages/ViewLectures.jsx';
import MyEnrolledCourses from './pages/MyEnrolledCourses.jsx';
import getAllReviews from './customHook/getAllReviews.js';
import SearchWithAi from './pages/SearchWithAi.jsx';

export const serverUrl = "https://pathshala-lms-project.onrender.com"

function App() {
    getCurrentUser();
    getCreatorCourse();
    getPublishedCourse();
    getAllReviews();

    const { userData, authLoading } = useSelector(
        (state) => state.user
    );

    // Wait until authentication has been checked.
    if (authLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />

                <Route
                    path="/signup"
                    element={
                        !userData ? <Signup /> : <Navigate to="/" replace />
                    }
                />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/profile"
                    element={
                        userData ? <Profile /> : <Navigate to="/signup" replace />
                    }
                />

                <Route
                    path="/forgot-password"
                    element={
                        userData ? (
                            <ForgotPassword />
                        ) : (
                            <Navigate to="/signup" replace />
                        )
                    }
                />

                <Route
                    path="/edit-profile"
                    element={
                        userData ? (
                            <EditProfile />
                        ) : (
                            <Navigate to="/signup" replace />
                        )
                    }
                />

                <Route
                    path="/allcourses"
                    element={
                        userData ? (
                            <AllCourses />
                        ) : (
                            <Navigate to="/signup" replace />
                        )
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        userData?.role === "Teacher" ? (
                            <Dashboard />
                        ) : (
                            <Navigate to="/signup" replace />
                        )
                    }
                />

                <Route
                    path="/courses"
                    element={
                        userData?.role === "Teacher" ? (
                            <Courses />
                        ) : (
                            <Navigate to="/signup" replace />
                        )
                    }
                />

                <Route
                    path="/createcourses"
                    element={
                        userData?.role === "Teacher" ? (
                            <CreateCourse />
                        ) : (
                            <Navigate to="/signup" replace />
                        )
                    }
                />

                <Route
                    path="/editcourse/:courseId"
                    element={
                        userData?.role === "Teacher" ? (
                            <EditCourse/>
                        ) : (
                            <Navigate to="/courses" replace />
                        )
                    }
                />

                <Route
                    path="/createlecture/:courseId"
                    element={
                        userData?.role === "Teacher" ? (
                            <CreateLecture/>
                        ) : (
                            <Navigate to="/courses" replace />
                        )
                    }
                />

                <Route
                    path="/editlecture/:courseId/:lectureId"
                    element={
                        userData?.role === "Teacher" ? (
                            <EditLecture/>
                        ) : (
                            <Navigate to="/courses" replace />
                        )
                    }
                />

                <Route
                    path="/viewcourse/:courseId"
                    element={
                        userData ? (
                            <ViewCourse/>
                        ) : (
                            <Navigate to="/courses" replace />
                        )
                    }
                />

                <Route
                    path="/viewlectures/:courseId"
                    element={
                        userData ? (
                            <ViewLectures/>
                        ) : (
                            <Navigate to="/courses" replace />
                        )
                    }
                />

                <Route
                    path="/mycourses"
                    element={
                        userData ? (
                            <MyEnrolledCourses/>
                        ) : (
                            <Navigate to="/courses" replace />
                        )
                    }
                />

                <Route
                    path="/search"
                    element={
                        userData ? (
                            <SearchWithAi/>
                        ) : (
                            <Navigate to="/courses" replace />
                        )
                    }
                />

            </Routes>
        </>
    );
}

export default App
