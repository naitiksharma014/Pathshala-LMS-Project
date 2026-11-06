import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import {
    setUserData,
    setAuthLoading,
} from "../redux/userSlice.js";
import axios from "axios";

export const getCurrentUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            dispatch(setAuthLoading(true));

            try {
                const response = await axios.get(
                    `${serverUrl}/api/user/getCurrentUser`,
                    {
                        withCredentials: true,
                    }
                );

                dispatch(setUserData(response.data));
            } catch (error) {
                console.error("Error fetching current user:", error);
                dispatch(setUserData(null));
            } finally {
                dispatch(setAuthLoading(false));
            }
        };

        fetchUser();
    }, [dispatch]);
};

export default getCurrentUser;