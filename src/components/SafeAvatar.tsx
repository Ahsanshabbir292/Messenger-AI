import React, { useState, useEffect } from 'react';

export const getAvatarColors = (name: string) => {
  const themes = [
    { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'from-indigo-500 to-purple-600' },
    { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'from-emerald-500 to-teal-600' },
    { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'from-rose-500 to-pink-600' },
    { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'from-amber-500 to-orange-600' },
    { bg: 'bg-sky-50 text-sky-700 border-sky-200', text: 'from-sky-500 to-blue-600' },
    { bg: 'bg-violet-50 text-violet-700 border-violet-200', text: 'from-violet-500 to-fuchsia-600' },
  ];
  if (!name) return themes[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return themes[sum % themes.length];
};

export const SafeAvatar = ({ src, name, className = "w-12 h-12 rounded-xl" }: { src?: string, name?: string, className?: string }) => {
  const [error, setError] = useState(false);
  const initials = name ? name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
  const theme = getAvatarColors(name || '');

  useEffect(() => {
    setError(false);
  }, [src]);

  if (src && !error) {
    const isExternalUrl = src.startsWith('http://') || src.startsWith('https://');
    const displaySrc = isExternalUrl ? `/api/proxy-image?url=${encodeURIComponent(src)}` : src;

    return (
      <img 
        src={displaySrc} 
        alt={name || "Avatar"} 
        className={`${className} object-cover`}
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center font-black border ${theme.bg} shrink-0 select-none`}>
      {initials}
    </div>
  );
};
