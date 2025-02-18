import { useMemo } from "react";
import axios, { AxiosInstance } from "axios";
import Cookies from "react-cookies";
import { API_URL } from "@/constants";

const useAxios = (): AxiosInstance => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    let JWT_TOKEN = Cookies.load("AUTHTOKEN");

    // If token is not found, set it to the default token
    if (!JWT_TOKEN) {
      JWT_TOKEN =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IktyaXNobmFuZWVyYWo3NzNAZ21haWwuY29tIiwiaWQiOiI2N2FmNGMzMjFjYmU5MmEyMDk0NjQzYjYiLCJuYW1lIjoiTmVlcmFqIiwiY29tcGFueU5hbWUiOiJDb21wYW55IE5hbWUiLCJjb21wYW55TG9nbyI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2R5ZmhicXRqbS9pbWFnZS91cGxvYWQvZl9hdXRvLHFfYXV0by9zZzF1ZmRzejh3dzltY2Npa3ljNSIsImlhdCI6MTczOTU0MTU1NCwiZXhwIjoxNzQyMTMzNTU0fQ.IP9B0agX7fGFAHfL5FGSUUU76hrkdN7HkFsEkQ_Qlyo";
    }

    // Add a request interceptor to set the auth header dynamically
    instance.interceptors.request.use((config) => {
      if (JWT_TOKEN && config.headers) {
        config.headers.Authorization = `Bearer ${JWT_TOKEN}`;
      }
      return config;
    });

    return instance;
  }, []);

  return axiosInstance;
};

export default useAxios;
