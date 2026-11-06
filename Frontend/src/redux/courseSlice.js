import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
    name: "course",
    initialState: {
        courseData: null,
        creatorCourseData: null,
        selectedCourse: null
    },
    reducers: {
        setCourseData: (state, action) => {
            state.courseData = action.payload;
        },
        setCreatorCourseData: (state, action) => {
            state.creatorCourseData = action.payload;
        },
        setSelectedCourse: (state, action) => {
            state.selectedCourse = action.payload;
        }
    },
});

export const {
    setCourseData,
    setCreatorCourseData,
    setSelectedCourse
} = courseSlice.actions;

export default courseSlice.reducer;