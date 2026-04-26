import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setLoading, setError } from "../redux/userSlice";
import axiosInstance from "../api/axiosInstance";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axiosInstance.get("/auth/me");
        if (response.data.success) {
          dispatch(setUserData(response.data.user));
        }
      } catch (err) {
        dispatch(setError(err.response?.data?.message || "Failed to fetch user"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (!userData) {
      fetchUser();
    }
  }, []);

  return { userData, loading, error };
};

export default useGetCurrentUser;
