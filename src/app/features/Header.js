"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { DarkLogo } from "../icons/DarkLogo";
import { DarkMode } from "../icons/DarkMode";
import { Search } from "../icons/Search";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "Game-Show",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "News",
  "Reality-TV",
  "Romance",
  "Sci-Fi",
  "Short",
  "Sport",
  "Talk-Show",
  "Thriller",
  "War",
  "Western",
];

export const Header = () => {
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const containerRef = useRef(null);

  // Гадна талд дарахад цонхыг хаах логик
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsGenreOpen(false);
      }
    };

    if (isGenreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGenreOpen]);

  return (
    <header className="relative z-50 w-full border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <DarkLogo />

          {/* Төв хэсэг: Жанр болон Хайлтын хэсэг */}
          <div
            ref={containerRef}
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3"
          >
            <button
              onClick={() => setIsGenreOpen((prev) => !prev)}
              className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-md border border-[#E4E4E7] bg-white px-4 transition-colors hover:bg-gray-50"
            >
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`transition-transform duration-200 ${
                  isGenreOpen ? "rotate-180" : ""
                }`}
              />
              <span>Genre</span>
            </button>

            {/* Хайлтын талбарын эх контейнер - relative байх ёстой */}
            <div className="relative w-94.75">
              {/* Хайлтын иконы байрлалыг input дотор оруулав */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-full rounded-md border border-[#E4E4E7] pl-10 pr-3 outline-none focus:border-[#4338CA]"
              />
            </div>

            {/* Жанрын цонх */}
            {isGenreOpen && (
              <div
                className="
                  absolute
                  left-0
                  top-full
                  mt-2
                  z-50
                  w-full
                  min-w-142.5
                  rounded-lg
                  border
                  border-[#E4E4E7]
                  bg-white
                  p-6
                  shadow-lg
                "
              >
                <h3 className="text-xl font-bold text-gray-900">Genres</h3>
                <p className="mt-1 text-sm text-gray-500">
                  See lists of movies by genre
                </p>

                <div className="my-4 border-t border-[#E4E4E7]" />

                <div className="flex flex-wrap gap-x-3 gap-y-3">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setIsGenreOpen(false)}
                      className="flex h-7 cursor-pointer items-center gap-2 rounded-full border border-[#E4E4E7] px-3 py-0.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#4338CA] hover:text-[#4338CA]"
                    >
                      <span>{genre}</span>
                      <ChevronRight
                        size={14}
                        strokeWidth={2}
                        className="text-gray-400"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="cursor-pointer">
            <DarkMode />
          </button>
        </div>
      </div>
    </header>
  );
};
