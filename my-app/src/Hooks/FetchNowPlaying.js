import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export function FetchNowPlaying(category) {
  const [isData, setData] = useState([]);
  const [isLoading, setLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [throttle, setThrottle] = useState(false);

  const fetchMovie = useCallback(async () => {
    setLoad(true);
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/${category}`,
      params: { language: "ko-KR", page: currentPage },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
      },
    };
    try {
      const response = await axios(options);
      setData((prevData) => [...prevData, ...response.data.results]);
      setLoad(false);
    } catch (error) {
      console.error(error);
    }
  }, [category, currentPage]);

  const changePage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 200
      ) {
        if (throttle) return;
        if (!throttle && !isLoading) {
          setThrottle(true);
          changePage(currentPage + 1);
          console.log("API 요청");
          setTimeout(() => {
            setThrottle(false);
          }, 500);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, currentPage, isData, changePage, throttle]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  return { isData, isLoading };
}
