import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Loader2 } from "lucide-react";

interface CustomAudioPlayerProps {
  src: string;
  isMe?: boolean;
}

export const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ src, isMe = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTrackRef = useRef<HTMLDivElement | null>(null);

  // Auto load and setup
  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.preload = "metadata";

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const onCanPlayThrough = () => {
      setIsLoading(false);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    const onError = () => {
      setError(true);
      setIsLoading(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("canplaythrough", onCanPlayThrough);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    // Forces metadata load
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplaythrough", onCanPlayThrough);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current || error) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback error:", err);
        setError(true);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressTrackRef.current || duration === 0 || error) return;
    
    const rect = progressTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(1, clickX / rect.width));
    
    audioRef.current.currentTime = clickPercent * duration;
    setCurrentTime(clickPercent * duration);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Custom styling to mimic Screenshot 1
  return (
    <div 
      className={`relative flex items-center justify-between gap-3 px-4 py-3 rounded-full shadow-md w-72 max-w-full overflow-hidden transition-all select-none ${
        isMe 
          ? "bg-blue-600 text-white" 
          : "bg-slate-100 text-slate-800 border border-slate-200"
      }`}
    >
      {/* Wave pulse animation in background when playing */}
      {isPlaying && (
        <span 
          className={`absolute inset-0 rounded-full opacity-10 animate-ping pointer-events-none duration-1000 ${
            isMe ? "bg-white" : "bg-blue-500"
          }`}
        />
      )}

      {/* Circular Play/Pause Action */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={error}
        className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all transform active:scale-95 cursor-pointer shadow-sm ${
          isMe
            ? "bg-white text-blue-600 hover:bg-slate-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current translate-x-0.5" />
        )}
      </button>

      {/* Interactive Seek Track */}
      <div 
        ref={progressTrackRef}
        onClick={handleSeek}
        className="flex-1 h-3 flex items-center cursor-pointer relative"
      >
        <div className={`relative w-full h-1 rounded-full ${isMe ? "bg-white/30" : "bg-slate-300"}`}>
          {/* Active Duration Line */}
          <div 
            className={`absolute top-0 left-0 h-1 rounded-full transition-all duration-100 ${
              isMe ? "bg-white" : "bg-blue-600"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
          {/* Thumb marker */}
          <div 
            className={`absolute top-1/2 -mt-1.5 -ml-1.5 w-3 h-3 rounded-full transition-transform active:scale-125 duration-100 shadow-sm ${
              isMe ? "bg-white" : "bg-blue-600"
            }`}
            style={{ left: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Duration Label */}
      <div 
        className={`text-xs font-mono tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
          isMe ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
        }`}
      >
        {error ? "Error" : formatTime(duration > 0 ? duration - currentTime : 0)}
      </div>
    </div>
  );
};
