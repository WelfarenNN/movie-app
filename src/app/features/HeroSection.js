"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzhlZjAyOThkNGEwMTllNmIwZTBmZjlkMWNiMWUzZSIsIm5iZiI6MTc4NjU4NTAxMy40ODUsInN1YiI6IjZhN2QxZmI1YWRkZTU4MmZiZTQ4NDY1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JPm8k3QAGkaLOMzBRdtmWcnx_jCzaSpv0uWnGhZpum4";

export const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getData = async () => {
    // TMDB URL дахь илүүц дабл налуу зураасыг (//movie/) засав
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
      { headers: { Authorization: `Bearer ${api_token}` } },
    );

    if (!response.ok) {
      throw new Error("Сүлжээний алдаа гарлаа");
    }

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

  // 1. Ачаалж байх үеийн төлөв
  if (loading) {
    return (
      <div className="w-full h-[85vh] md:h-[90vh] bg-black flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  // 2. Алдаа гарсан үеийн төлөв
  if (errorMessage || movies.length === 0) {
    return (
      <div className="w-full h-[85vh] md:h-[90vh] bg-black flex items-center justify-center text-red-500">
        <p className="text-lg font-semibold">
          {errorMessage || "No movies found."}
        </p>
      </div>
    );
  }

  // Жагсаалтын хамгийн эхний киног HeroSection дээр харуулна
  const movie = movies[0];

  // TMDB-ээс ирдэг үнэлгээг таслахаас хойш 1 оронтой болгож форматлах (жишээ нь 6.892 -> 6.9)
  const formattedRating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "0.0";

  return (
    <section className="relative w-full h-[85vh] md:h-[90vh] flex items-center justify-start overflow-hidden bg-black text-white">
      {/* 1. Арын дэвсгэр зураг болон Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {movie.backdrop_path && (
          <Image
            // HeroSection-д хөндлөн зураг (backdrop_path) илүү тохиромжтой
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
            alt={movie.title || "Movie Background"}
            fill
            priority
            className="object-cover object-center brightness-[0.65]"
            // TMDB зураг ачаалж байгаа тул component-ийн next.config.js-д image domains-ийг тохируулсан байх шаардлагатай
            unoptimized
          />
        )}
        {/* Градиент текстийн алдааг засав: bg-linerar -> bg-gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent h-1/3 bottom-0" />
      </div>

      {/* 2. Контент хэсэг (Текст болон Товчлуурууд) */}
      <div className="relative z-10 max-w-xl px-6 sm:px-12 md:px-20 flex flex-col gap-4 select-none">
        {/* Уриа үг / Төлөв */}
        <span className="text-xs md:text-sm font-semibold tracking-wider text-gray-300 uppercase">
          Now Playing:
        </span>

        {/* Киноны нэр */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
          {movie.title}
        </h1>

        {/* Үнэлгээний хэсэг (Одтой) */}
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm md:text-base">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-white font-medium">{formattedRating}</span>
          <span className="text-gray-400 text-xs font-normal">/ 10</span>
        </div>

        {/* Киноны тайлбар текст (TMDB дээр 'overview' гэж ирдэг) */}
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light line-clamp-4 max-w-md drop-shadow">
          {movie.overview}
        </p>

        {/* Трейлер үзэх товчлуур */}
        <div className="mt-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-medium text-sm md:text-base rounded-lg transition-all duration-300 transform active:scale-95 shadow-lg">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Trailer
          </button>
        </div>
      </div>

      {/* 3. Баруун талын Слайдер шилжих сум */}
      <button className="absolute right-6 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white transition-all hidden md:block">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
};
