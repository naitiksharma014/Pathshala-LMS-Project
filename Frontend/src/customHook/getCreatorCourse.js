import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";

const getCreatorCourse = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        const creatorCourses = async () => {
            try {
                const result = await axios.get(
                    serverUrl + "/api/course/getcreator",
                    { withCredentials: true }
                );

                console.log("API RESPONSE:", result.data);

                dispatch(setCreatorCourseData(result.data));
            } catch (error) {
                console.log(
                    "API ERROR:",
                    error.response?.data || error.message
                );
            }
        };

        if (userData) {
            creatorCourses();
        }
    }, [userData, dispatch]);
};

export default getCreatorCourse;