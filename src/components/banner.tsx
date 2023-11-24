// AnnouncementBar.tsx
"use client"
import React from 'react';

type AnnouncementBarProps = {
  message: string;
  speed?: number; // Speed in seconds for the text to make one full scroll
};

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ message, speed = 10 }) => {
  return (
    <div className="bg-black text-white h-14 flex items-center sticky top-0 z-50 overflow-hidden">
      <div
        className="whitespace-nowrap px-4 animate-marquee w-full"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        <span>{message}</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
