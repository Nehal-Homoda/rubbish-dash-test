"use client";
import { useEffect, useState } from "react";
import sun from "@/assets/images/sun.png";
import moon from "@/assets/images/moon.png";
import skyLight from "@/assets/images/sky-morning.jpg";
import skyDark from "@/assets/images/sky-night.jpg";

export default function UIDarkBtn({ lang }: { lang: string }) {
const [isDark, setIsDark] = useState<boolean | null>(null);

    useEffect(() => {
    const darkModeFromStorage = JSON.parse(localStorage.getItem("dark-mode") || "false");
    setIsDark(darkModeFromStorage);
  }, []);

  useEffect(() => {
      if (isDark === null) return; 
    const html = document.documentElement;
    isDark ? html.classList.add("dark") : html.classList.remove("dark");
    localStorage.setItem('dark-mode',JSON.stringify(isDark));
  }, [isDark]);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };
  const translateDirection = lang === "ar" ? "-translate-x-8" : "translate-x-8";

  return (
    <>
      <div
        style={{
          backgroundImage: isDark
            ? `url(${skyLight.src})`
            : `url(${skyDark.src})`,
        }}
        onClick={toggleTheme}
        className={`rounded-full transition-all cursor-pointer bg-no-repeat bg-cover bg-center duration-500 p-1 w-16 h-8 `}
      >
        <div
          style={{
            backgroundImage: isDark ? `url(${sun.src})` : `url(${moon.src})`,
          }}
          className={`inside-circle transition-all cursor-pointer duration-500 size-6 rounded-full  bg-no-repeat bg-center ${
            isDark ? `${translateDirection} ` : "translate-x-0 "
          }`}
        />
      </div>
    </>
  );
}
