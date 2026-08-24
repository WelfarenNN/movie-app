"use client";

import { useEffect, useState } from "react";
import { Play } from "../icons/Play";
import { Right } from "../icons/RIght";
import Image from "next/image";

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzhlZjAyOThkNGEwMTllNmIwZTBmZjlkMWNiMWUzZSIsIm5iZiI6MTc4NjU4NTAxMy40ODUsInN1YiI6IjZhN2QxZmI1YWRkZTU4MmZiZTQ4NDY1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JPm8k3QAGkaLOMzBRdtmWcnx_jCzaSpv0uWnGhZpum4";

export const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getData = async () => {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
      { headers: { Authorization: `Bearer ${api_token}` } },
    );

    const jsonData = await response.json();
    return jsonData.results;
  };

  useEffect(() => {
    getData()
      .then((data) => {
        setMovies(data);
      })
      .catch((err) => {
        setErrorMessage("MOVIE API ERROR");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[85vh] md:h-[90vh] bg-black flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (errorMessage || movies.length === 0) {
    return (
      <div className="w-full h-[85vh] md:h-[90vh] bg-black flex items-center justify-center text-red-500">
        <p className="text-lg font-semibold">
          {errorMessage || "No movies found."}
        </p>
      </div>
    );
  }

  const movie = movies[0];

  const formattedRating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "0.0";

  return (
    <section className="relative w-full h-[85vh] md:h-[90vh] flex items-center justify-start overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
            alt={movie.title || "Movie Background"}
            fill
            priority
            className="object-cover object-center brightness-[0.65]"
            unoptimized
          />
        )}
        <div className="absolute inset-0  from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0  from-black via-transparent to-transparent h-1/3 bottom-0" />
      </div>

      <div className="relative z-10 max-w-xl px-6 sm:px-12 md:px-20 flex flex-col gap-4 select-none">
        <span className="text-xs md:text-sm font-semibold tracking-wider text-gray-300 uppercase">
          Now Playing:
        </span>

        <span className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
          {movie.title}
        </span>

        <div className="flex items-center gap-1.5  font-bold text-xs md:text-base">
          <span className="flex justify-center text-yellow-400 w-7 h-7 fill-current items-center">
            ★
          </span>
          <span className="font-medium text-white text-center">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
          </span>
        </div>

        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light line-clamp-4 max-w-md drop-shadow">
          {movie.overview}
        </p>

        <div className="mt-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-white/30 border border-white/30 backdrop-blur-md text-black font-medium text-sm md:text-base rounded-lg transition-all duration-300 transform active:scale-95 shadow-lg">
            <Play />
            Watch Trailer
          </button>
        </div>
      </div>

      <button className="absolute right-6 z-10 p-2.5 rounded-full bg-white hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white transition-all hidden md:block">
        <Right/>
      </button>
    </section>
  );
};
