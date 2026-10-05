"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "../Icons/ArrowRight";
import { Movies } from "../Components/Movies";

// АНХААРУУЛГА: api_token-ийг "use client" дотор ил хадгалах нь аюултай бөгөөд цаашдаа .env файлд нуух хэрэгтэй.
const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzhlZjAyOThkNGEwMTllNmIwZTBmZjlkMWNiMWUzZSIsIm5iZiI6MTc4NjU4NTAxMy40ODUsInN1YiI6IjZhN2QxZmI1YWRkZTU4MmZiZTQ4NDY1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JPm8k3QAGkaLOMzBRdtmWcnx_jCzaSpv0uWnGhZpum4";

export const Popular = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getData = async () => {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      { headers: { Authorization: `Bearer ${api_token}` } },
    );

    const jsonData = await response.json();
    return jsonData.results;
  };

  useEffect(() => {
    getData()
      .then((moviesData) => setData(moviesData))
      .catch(() => setErrorMessage("MOVIE API ERROR"))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full bg-white text-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 pb-2">
          <p className="font-bold text-2xl text-gray-900">Popular</p>
          <button className="flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer hover:underline">
            See more <ArrowRight />
          </button>
        </div>

        {loading && <div>Loading...</div>}
        {!loading && errorMessage && <div>{errorMessage}</div>}
        {!loading && !errorMessage && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
            {data.map((movie) => (
              <Movies
                key={movie.id}
                id={movie.id}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                rating={movie.vote_average?.toFixed(1)}
                alt={movie.title}
                title={movie.title}
                date={movie.release_date}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};