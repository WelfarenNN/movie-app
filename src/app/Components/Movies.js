"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Heart } from "lucide-react";

// LocalStorage-тай харьцах туслах функцуудыг компонент бүрд дахин үүсгэхгүйн тулд гадагш нь гаргасан
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

export const Movies = (props) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const { src, rating, title, alt, id, watchedMinutes, runtime } = props;

  const watchProgress =
    watchedMinutes && runtime
      ? Math.min(100, Math.round((watchedMinutes / runtime) * 100))
      : 0;

  const handleDetailClick = () => {
    router.push(`/detail/${id}`);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation(); // Карт руу үсрэхээс сэргийлнэ
    const current = read("moviez:watchlist", []);
    const isSaved = current.some((m) => m.id === id);

    const updated = isSaved
      ? current.filter((m) => m.id !== id)
      : [...current, { id, title, src, rating, alt }];

    write("moviez:watchlist", updated);
    window.dispatchEvent(new Event("watchlist:updated"));
    setIsLiked(!isSaved);
  };

  useEffect(() => {
    const checkIsSaved = () => {
      const current = read("moviez:watchlist", []);
      const isSaved = current.some((m) => m.id === id);
      setIsLiked(isSaved);
    };

    checkIsSaved();

    window.addEventListener("watchlist:updated", checkIsSaved);
    return () => window.removeEventListener("watchlist:updated", checkIsSaved);
  }, [id]);

  return (
    <div
      onClick={handleDetailClick}
      className="group w-full bg-[#F4F4F5] dark:bg-black rounded-xl flex flex-col gap-1 cursor-pointer overflow-hidden transition-all"
    >
      <div className="relative w-full aspect-2/3 overflow-hidden rounded-t-[10px]">
        {/* <Img> гэж алдаатай байсныг <Image> болгож зассан */}
        <Image
          src={src}
          alt={alt || title}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-all duration-300 ease-out group-hover:scale-105 group-hover:brightness-90"
        />
        
        <button
          onClick={handleWatchlistClick}
          type="button"
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
            isLiked
              ? "bg-[#F43F5E] text-white"
              : "bg-black/40 hover:bg-black/60 text-white"
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <Heart fill="currentColor" stroke="currentColor" strokeWidth={0} />
          </div>
        </button>

        {watchProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50">
            <div
              className="h-full bg-[#6C5CE7]"
              style={{ width: `${watchProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 bg-[#F4F4F5] dark:bg-black rounded-b-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4">
            <Star />
          </div>
          <div className="flex items-center gap-0.5">
            <p className="text-sm font-semibold">{rating}</p>
            <span className="text-xs text-[#71717A] font-light">/10</span>
          </div>
        </div>
        <p className="text-base font-medium line-clamp-2 leading-tight">
          {title}
        </p>
      </div>
    </div>
  );
};