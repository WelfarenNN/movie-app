"use client";


import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { Header } from "@/app/Features/Header";
import { Footer } from "@/app/Features/Footer";

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzhlZjAyOThkNGEwMTllNmIwZTBmZjlkMWNiMWUzZSIsIm5iZiI6MTc4NjU4NTAxMy40ODUsInN1YiI6IjZhN2QxZmI1YWRkZTU4MmZiZTQ4NDY1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JPm8k3QAGkaLOMzBRdtmWcnx_jCzaSpv0uWnGhZpum4";

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function Detail() {
  const [trailerIsPlaying, setTrailerIsPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const [trailer, setTrailer] = useState([]);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Нэмсэн: Алдаа хадгалах state
  
  const loading = !movie || String(movie.id) !== String(id);

  // 1. Trailer татах хэсгийг useEffect дотор нь оруулж зассан
  useEffect(() => {
    if (!id) return;
    
    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
          { headers: { Authorization: `Bearer ${api_token}` } },
        );
        const jsonData = await response.json();
        setTrailer(jsonData.results);
      } catch (error) {
        console.error("Trailer fetch error:", error);
        setErrorMessage("MOVIE API ERROR");
      }
    };

    fetchTrailer();
  }, [id]);

  const officialTrailer = trailer?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );
  const youtubeKey = officialTrailer?.key || trailer?.[0]?.key;

  // 2. Movie Details болон Credits татах хэсгийг useEffect дотор нэгтгэж зассан
  useEffect(() => {
    if (!id) return;

    const fetchMovieAndCredits = async () => {
      try {
        // Киноны дэлгэрэнгүй мэдээлэл татах
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=release_dates`,
          { headers: { Authorization: `Bearer ${api_token}` } },
        );
        const movieData = await movieRes.json();
        const releaseDates = movieData.release_dates?.results || [];
        const usRelease = releaseDates.find((item) => item.iso_3166_1 === "US");
        const certification =
          usRelease?.release_dates?.find((r) => r.certification)?.certification ||
          "N/A";

        // Киноны багийн мэдээлэл татах (Credits)
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
          { headers: { Authorization: `Bearer ${api_token}` } },
        );
        const creditsData = await creditsRes.json();

        setMovie({ ...movieData, certification });
        setCast(creditsData.cast || []);
        setCrew(creditsData.crew || []);
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };

    fetchMovieAndCredits();
  }, [id]);

  // 3. Зураг дээрх анхааруулгыг зассан: movie хувьсагчийг хамаарлын жагсаалтад нэмсэн
  useEffect(() => {
    if (!isPlaying || !id || !movie) return; // movie байхгүй үед ажиллахгүй байх хамгаалалт нэмсэн

    const handleMessage = (event) => {
      if (!event.origin.includes("vidking.net")) return;

      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (data?.type !== "PLAYER_EVENT") return;

      const playerData = data.data || {};
      if (
        playerData.event === "timeupdate" ||
        playerData.event === "seeked" ||
        playerData.event === "pause" ||
        playerData.event === "ended"
      ) {
        const currentTimeInSeconds = playerData.currentTime || 0;
        const watchedMinutes = Math.floor(currentTimeInSeconds / 60);
        const totalRuntime = movie.runtime;
        const progressPercent = Math.min(
          Math.round((watchedMinutes / totalRuntime) * 100),
          100,
        );
        const history = read("moviez:recent", []);
        const updatedHistory = history.map((m) => {
          if (String(m.id) === String(id)) {
            return {
              ...m,
              watchedMinutes: watchedMinutes,
              lastPlayedSeconds: currentTimeInSeconds,
              progressPercent: progressPercent,
            };
          }
          return m;
        });

        write("moviez:recent", updatedHistory);
        window.dispatchEvent(new Event("recent:updated"));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isPlaying, id, movie]); // movie-г энд нэмж өгснөөр алдаа арилна

  useEffect(() => {
    if (!movie || !id) return;

    const history = read("moviez:recent", []);

    // Давхардсан киног хасах
    const existingEntry = history.find((m) => String(m.id) === String(id));
    const filteredHistory = history.filter((m) => String(m.id) !== String(id));

    const movieData = {
      id: movie.id,
      title: movie.title || movie.original_title,
      src: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : "0.0",
      alt: movie.title || movie.original_title,
      runtime: movie.runtime || 0,
      watchedMinutes: existingEntry?.watchedMinutes || 0,
      lastPlayedSeconds: existingEntry?.lastPlayedSeconds || 0,
      openedAt: Date.now(),
    };

    // Хамгийн эхэнд шинэ киног нэмэх
    const updatedHistory = [movieData, ...filteredHistory];

    // Хамгийн сүүлийн 10 киног хадгалах
    write("moviez:recent", updatedHistory.slice(0, 10));

    // Өөр компонентуудад мэдээлэх эвэнт илгээх
    window.dispatchEvent(new Event("recent:updated"));
  }, [movie, id]);

  const directors = crew
    .filter((person) => person.job === "Director")
    .map((d) => d.name)
    .join(" · ");

  const writers = crew
    .filter((person) => person.department === "Writing")
    .slice(0, 3)
    .map((w) => w.name)
    .join(" · ");

  if (loading) {
    return <Star />;
  }
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen relative">
      <Header />

      {/* Movie Detail Main Container */}
      <div className="max-w-6xl w-full px-4 mb-8 mt-12">
        {errorMessage && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-md mb-4 text-center">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight sm:leading-10 tracking-tight">
              {movie?.original_title}
            </h1>
            <p className="text-[14px] text-[#71717A] font-semibold mt-1">
              {movie?.release_date?.slice(0, 4)} • {movie?.certification} •{" "}
              {formatRuntime(movie?.runtime)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#09090B]">Rating</p>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Star />
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center">
                    <p className="text-lg font-normal">
                      {movie?.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "0.0"}
                    </p>
                    <p className="text-xs text-[#71717A]">/10</p>
                  </div>
                  <p className="text-[#71717A] text-xs">{movie?.vote_count}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pictures & Banner Container */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Vertical Poster */}
          <div className="relative w-full md:w-72 h-107.5 rounded-xl overflow-hidden shrink-0">
            {movie?.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt="vertical poster"
                fill
                sizes="(min-width: 768px) 288px, 100vw"
                className="object-cover"
              />
            )}
          </div>

          {/* Horizontal Cover Banner */}
          <div className="group relative w-full md:flex-1 h-107.5 rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {movie?.backdrop_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                alt="horizontal poster"
                fill
                sizes="(min-width: 768px) 800px, 100vw"
                className="object-cover z-0 brightness-75 transition-all duration-300 ease-out group-hover:scale-110 group-hover:brightness-100"
              />
            )}
            <div className="absolute z-10 inset-x-4 sm:inset-x-6 bottom-4 sm:bottom-6 flex flex-col sm:flex-row gap-3 sm:justify-between text-white">
              <button
                onClick={() => setIsPlaying(true)}
                className="order-2 sm:order-1 relative overflow-hidden from-white/25 to-white/10 hover:from-white/35 hover:to-white/15 backdrop-blur-lg border border-white/30 text-white rounded-full gap-4 w-full sm:w-36 lg:w-40 h-12 sm:h-14 lg:h-16 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg shadow-black/30"
              >
                <span className="absolute inset-x-0 top-0 h-px bg-white/50" />
                <ArrowRight />
                <span className="font-semibold text-base sm:text-lg select-none">
                  Watch now
                </span>
              </button>
              <button
                onClick={() => setTrailerIsPlaying(true)}
                className="order-1 sm:order-2 relative overflow-hidden from-white/25 to-white/10 hover:from-white/35 hover:to-white/15 backdrop-blur-lg border border-white/30 text-white rounded-full gap-4 w-full sm:w-36 lg:w-40 h-12 sm:h-14 lg:h-16.5 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg shadow-black/30"
              >
                <span className="absolute inset-x-0 top-0 h-px bg-white/50" />
                <ArrowRight />
                <span className="font-semibold text-base sm:text-lg select-none">
                  Play trailer
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-10 right-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 text-xs rounded-full z-50 cursor-pointer border border-white/20 transition-all flex items-center gap-1"
            >
              ✕
            </button>

            {/* YouTube Iframe */}
            <iframe
              src={`https://www.vidking.net/embed/movie/${id}`}
              width="100%"
              height="580"
              allowFullScreen
            >
              {" "}
            </iframe>
          </div>
          <div
            className="absolute inset-0 z-[-1]"
            onClick={() => setIsPlaying(false)}
          />
        </div>
      )}
      {trailerIsPlaying && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button
              onClick={() => setTrailerIsPlaying(false)}
              className="absolute top-10 right-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 text-xs rounded-full z-50 cursor-pointer border border-white/20 transition-all flex items-center gap-1"
            >
              ✕
            </button>

            {/* YouTube Iframe */}
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div
            className="absolute inset-0 z-[-1]"
            onClick={() => setTrailerIsPlaying(false)}
          />
        </div>
      )}

      {/* Further details */}
      <div className="max-w-6xl w-full px-4 flex flex-col gap-5 mb-8">
        {/*(Genres) */}
        <div className="flex flex-wrap gap-2">
          {movie?.genres?.map((genre) => (
            <span
              key={genre.id}
              className="rounded-full border border-[#E4E4E7] bg-white text-xs font-medium py-1 px-3  dark:bg-black dark:border-zinc-500"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <div>
          <p className="text-base text-gray-800 leading-relaxed dark:text-zinc-300">
            {movie?.overview}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-6 sm:gap-12 pb-3 border-b border-[#E4E4E7]">
            <p className="w-20 text-base font-bold shrink-0">Director</p>
            <p className="text-base font-light">{directors || "N/A"}</p>
          </div>

          <div className="flex gap-6 sm:gap-12 pb-3 border-b border-[#E4E4E7]">
            <p className="w-20 text-base font-bold shrink-0">Writers</p>
            <p className="text-base font-light">{writers || "N/A"}</p>
          </div>

          <div className="flex gap-6 sm:gap-12 pb-3 border-b border-[#E4E4E7]">
            <p className="w-20 text-base font-bold shrink-0">Stars</p>
            <p className="text-base font-light">
              {cast.length > 0
                ? cast
                    .slice(0, 5)
                    .map((actor) => actor.name)
                    .join(" · ")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* More Like This Header */}
      <div className="flex items-center justify-between h-9 text-black dark:text-zinc-100 max-w-6xl w-full px-4 mb-6">
        <p className="font-medium text-2xl">More Like this</p>
        <button
          onClick={() => router.push(`/MoreLikeThis?id=${id}`)}
          className="flex items-center gap-2 text-sm font-light cursor-pointer hover:opacity-80 transition-opacity"
        >
          See more
          <ArrowRight />
        </button>
      </div>

      {/* More Like This Cards Grid */}
      <Star id={id} />

      <Footer/>
    </div>
  );
}