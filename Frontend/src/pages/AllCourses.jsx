
import React, { useEffect, useState } from 'react';
import Nav from '../component/Nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../component/Card';
import ai from '../assets/SearchAi.png';

function AllCourses() {
    const navigate = useNavigate();

    const { courseData } = useSelector(state => state.course);

    const [category, setCategory] = useState([]);
    const [filterCourses, setFilterCourses] = useState([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleCategory = (e) => {
        const value = e.target.value;

        if (category.includes(value)) {
            setCategory(prev => prev.filter(c => c !== value));
        } else {
            setCategory(prev => [...prev, value]);
        }
    };

    const applyFilter = () => {
        const courseCopy = courseData?.slice() || [];

        if (category.length > 0) {
            setFilterCourses(
                courseCopy.filter(course =>
                    category.includes(course.category)
                )
            );
        } else {
            setFilterCourses(courseCopy);
        }
    };

    useEffect(() => {
        setFilterCourses(courseData || []);
    }, [courseData]);

    useEffect(() => {
        applyFilter();
    }, [category, courseData]);

    const categories = [
        'App Development',
        'AI/ML',
        'AI Tools',
        'Data Science',
        'Data Analytics',
        'Ethical Hacking',
        'UI UX Designing',
        'Web Development',
        'Others'
    ];

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Nav />

            {/* Show/Hide Filters Button - Mobile */}
            <button
                type="button"
                className='fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black'
                onClick={() => setIsSidebarVisible(prev => !prev)}
            >
                {isSidebarVisible ? 'Hide' : 'Show'} Filters
            </button>

            {/* Sidebar */}
            <aside
                className={`w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform duration-300 z-40 ${
                    isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
            >
                <h2 className='text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6'>
                    <FaArrowLeftLong
                        className='text-white cursor-pointer'
                        onClick={() => navigate("/")}
                    />
                    Filter by Category
                </h2>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className='space-y-4 text-sm bg-gray-600 border-white text-white border p-5 rounded-2xl'
                >
                    <button
                        type="button"
                        onClick={applyFilter}
                        className='w-full px-2.5 py-2.5 bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer'
                        onClick={() => navigate("/search")}
                    >
                        Search with AI
                        <img
                            src={ai}
                            className='w-[30px] h-[30px] rounded-full'
                            alt="AI"
                        />
                    </button>

                    {categories.map(item => (
                        <label
                            key={item}
                            className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'
                        >
                            <input
                                type="checkbox"
                                className='accent-black w-4 h-4 rounded-md'
                                value={item}
                                checked={category.includes(item)}
                                onChange={toggleCategory}
                            />
                            {item}
                        </label>
                    ))}
                </form>
            </aside>

            {/* Courses */}
            <main className='w-full transition-all duration-300 py-[130px] md:pl-[300px] flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]'>
                {filterCourses?.length > 0 ? (
                    filterCourses.map((course, index) => (
                        <Card
                            key={course._id || index}
                            thumbnail={course.thumbnail}
                            title={course.title}
                            category={course.category}
                            price={course.price}
                            id={course._id}
                            reviews={course.reviews}
                        />
                    ))
                ) : (
                    <p className='text-gray-500 text-lg'>
                        No courses found.
                    </p>
                )}
            </main>
        </div>
    );
}

export default AllCourses;
