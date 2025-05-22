"use client";
import { useEffect, useState } from "react";

export default function UIDarkBtn() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };
  useEffect(() => {
    const html = document.documentElement;
    isDark ? html.classList.add("dark") : html.classList.remove("dark");
  },[isDark]);
  return (
    <>
      <div
        onClick={toggleTheme}
        className={` rounded-full transition-colors cursor-pointer duration-500 p-1 w-16 h-8 mt-5 ${
          isDark ? "bg-white" : "bg-black"
        }`}
      >
        <div
          className={` inside-circle transition-all cursor-pointer duration-500 size-6 rounded-full ${
            isDark ? "translate-x-8 bg-black" : "translate-x-0 bg-white"
          }`}
        ></div>
      </div>
    </>
  );
}
