import React, { useState } from 'react'
import { FaStar, FaRegStar } from "react-icons/fa";

function ReviewCard({ comment, rating, photoUrl, name, description, courseTitle }) {
    const [imageError, setImageError] = useState(false)

    return (
        <div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-sm w-full'>

            <div className='flex items-center mb-3 text-yellow-400 text-sm'>
                {Array(5).fill(0).map((_, i) => (
                    <span key={i}>
                        {i < rating ? <FaStar /> : <FaRegStar />}
                    </span>
                ))}
            </div>

            <p className='text-gray-700 text-sm mb-2'>
                Review For : <span className='font-semibold'>{courseTitle}</span>
            </p>

            <p className='text-gray-700 text-sm mb-5'>
                Review : <span className='font-semibold'>{comment}</span>
            </p>

            <div className='flex items-center gap-2'>
                {photoUrl && !imageError ? (
                    <img
                        src={photoUrl}
                        alt={name || "User"}
                        className='w-10 h-10 rounded-full object-cover'
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold'>
                        {name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                )}

                <div>
                    <h2 className='font-semibold text-gray-800 text-sm'>
                        {name}
                    </h2>
                    <p className='text-xs text-gray-500'>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard