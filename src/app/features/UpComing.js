"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "../icons/ArrowRight";
import Image from "next/image";

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzhlZjAyOThkNGEwMTllNmIwZTBmZjlkMWNiMWUzZSIsIm5iZiI6MTc4NjU4NTAxMy40ODUsInN1YiI6IjZhN2QxZmI1YWRkZTU4MmZiZTQ4NDY1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JPm8k3QAGkaLOMzBRdtmWcnx_jCzaSpv0uWnGhZpum4";
export const UpComing = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getData = async () => {
    const response = await fetch(
      "https://api.themoviedb.org/3//movie/upcoming?language=en-US&page=1",
      { headers: { Authorization: `Bearer ${api_token}` } },
    );

    const jsonData = await response.json();
    return jsonData.results;
  };
  useEffect(() => {
    getData()
      .then((data) => setData(data))
      .catch(() => setErrorMessage("MOVIE API ERROR"))
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="w-full bg-white text-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Секцийн толгой хэсэг: Upcoming болон See more */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
          <h2 className="font-bold text-2xl text-gray-900">Upcoming</h2>
          <button className="flex items-center gap-1.5 text-sm font-medium  transition-colors cursor-pointer hover:underline">
            See more <ArrowRight />
          </button>
        </div>

        {loading && <div>Loading...</div>}
        {!loading && errorMessage && <div>{errorMessage}</div>}
        {!loading && !errorMessage && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
            {data.map((movie) => {
              return (
                <div
                  key={movie.id}
                  className="flex flex-col group cursor-pointer"
                >
                  {/* Киноны постер зураг */}
                  <div className="relative aspect-2/3 w-full overflow-hidden rounded-t-xl bg-gray-100">
                    <img
                      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Киноны мэдээлэл (Зураг дээрх шиг доороо байрлана) */}
                  <div className="p-3 bg-[#f4f4f5] rounded-b-xl flex flex-col gap-2 min-h-22.5">
                    <div>
                      {/* Одон үнэлгээ */}
                      <div className="flex items-center gap-1 mb-1 text-xs">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="font-medium text-gray-800">
                          {movie.vote_average
                            ? movie.vote_average.toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-gray-400">/10</span>
                      </div>

                      {/* Киноны нэр */}
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {movie.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
