
import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import ai from '../assets/ai.png'
import { RiMicAiFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';
import start from "../assets/start.mp3";

function SearchWithAi() {

    const startSound = new Audio(start)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState("")
    const [recommendations, setRecommendations] = useState([])
    const [hasSearched, setHasSearched] = useState(false)

    function speak(message) {
        let utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance)
    }

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = SpeechRecognition
        ? new SpeechRecognition()
        : null

    if (!recognition) {
        toast.error("Speech recognition not supported")
    }

    const handleSearch = () => {
        if (!recognition) {
            toast.error("Speech recognition not supported")
            return
        }

        recognition.onresult = async (e) => {
            const transcript = e.results[0][0].transcript.trim()

            setInput(transcript)
            await handleRecommendation(transcript)
        }

        recognition.onerror = (e) => {
            console.log("Speech Error:", e.error)
            toast.error("Voice search failed")
        }

        recognition.start()
        startSound.play()
    }

    const handleRecommendation = async (query) => {
        if (!query.trim()) return

        setLoading(true)
        setHasSearched(false)
        setRecommendations([])

        try {
            const result = await axios.post(
                serverUrl + "/api/course/search",
                { input: query },
                { withCredentials: true }
            )

            setRecommendations(result.data)
            setHasSearched(true)

            if (result.data.length > 0) {
                speak("These are the top courses I found for you")
            } else {
                speak("No courses found")
            }
        } catch (error) {
            console.log(error.response?.data || error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-10'>

            {/* search Container */}
            <div className='bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative'>

                <FaArrowLeftLong
                    className='text-[black] w-[22px] h-[22px] cursor-pointer absolute'
                    onClick={() => navigate("/")}
                />

                <h1 className='text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2'>
                    <img src={ai} alt="" className='w-8 h-8 sm:w-[30px] sm:h-[30px]' />
                    Search with <span className='text-[#CB99C7]'>AI</span>
                </h1>

                <div className='flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full'>

                    <input
                        type="text"
                        className='flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base'
                        placeholder='What do you want to learn? (e.g. AI, MERN, Cloud...)'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />

                    {input && (
                        <button
                            type="button"
                            className='absolute right-14 sm:right-16 bg-white rounded-full w-10 h-10 flex items-center justify-center z-10'
                            onClick={() => handleRecommendation(input)}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="text-xs text-gray-700">...</span>
                            ) : (
                                <img src={ai} alt="Search" className='w-6 h-6 object-contain' />
                            )}
                        </button>
                    )}

                    <button
                        className='absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center'
                        onClick={handleSearch}
                    >
                        <RiMicAiFill className='w-5 h-5 text-[#cb87c5]' />
                    </button>

                </div>
            </div>

            {/* Recommendations */}
            <div className='w-full max-w-5xl mt-8 flex flex-wrap items-center justify-center gap-6'>

                {recommendations.map((course, index) => (
                    <div
                        key={course._id || index}
                        onClick={() => navigate(`/viewcourse/${course._id}`)}
                        className='bg-white text-black p-4 rounded-xl shadow-lg w-full sm:w-[300px] cursor-pointer hover:scale-105 transition-all'
                    >
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className='w-full h-40 object-cover rounded-lg'
                        />

                        <h2 className='text-lg font-semibold mt-3'>
                            {course.title}
                        </h2>

                        <p className='text-sm text-gray-600 mt-1'>
                            {course.subTitle}
                        </p>

                        <p className='text-sm text-gray-600 mt-2'>
                            {course.description}
                        </p>

                        <p className='text-sm text-gray-600 mt-2'>
                            {course.category} | {course.level}
                        </p>
                    </div>
                ))}

                {hasSearched && !loading && recommendations.length === 0 && (
                    <h2 className='text-white text-xl font-semibold mt-8'>
                        No courses found
                    </h2>
                )}

            </div>

        </div>
    )
}

export default SearchWithAi
