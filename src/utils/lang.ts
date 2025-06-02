'use client'
import { getDictionary } from "@/app/dictionaries";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Lang = "en" | "ar";
export const useLangAndDictionary = () => {
  const { lang } = useParams<{ lang: Lang }>();
  const currentLang: Lang = lang === "ar" ? "ar" : "en";
  const [dict, setDictionary] = useState<Record<string, string>>({});
  useEffect(() => {
    getDictionary(currentLang).then((result) => {
      setDictionary(result);
    });
  }, [currentLang]);
  return { lang: currentLang, dict };
};
