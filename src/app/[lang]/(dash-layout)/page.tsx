
"use client";
// import ChartDemo from "@/components/ui/UIChart";
import UIDashCard from "@/components/ui/UIDashCard";
import { useState } from "react";
import { useLangAndDictionary } from "@/utils/lang";


export default function Home() {
  const [activeBtn, setActiveBtn] = useState<"month" | "year">("month");
  const [chartData, setChartData] = useState<number[]>([8, 6, 10, 4]);
  const [chartLabels, setChartLabels] = useState<string[]>([
    "شقق",
    "وحدات سكنية",
    "مطاعم",
    "محلات تجارية",
  ]);
  const { lang, dict } = useLangAndDictionary();

  return (
    <>
      <div className="home-page">

        <div className="w-1/2">
          {/* <UIDashCard>
            <div className="flex items-center gap-4 mb-10">
              <button
                onClick={() => {
                  setActiveBtn("year");
                  setChartData([8, 6, 10, 4]);
                  setChartLabels([
                    "شقق",
                    "وحدات سكنية",
                    "مطاعم",
                    "محلات تجارية",
                  ]);
                }}
                className={
                  activeBtn == "year"
                    ? `h-8 px-2 rounded-xl bg-surface-light-800 text-surface text-sm font-medium`
                    : "text-foreground/50 text-sm font-medium"
                }
              >
                {dict.year_stats}
              </button>
              <button
                onClick={() => {
                  setActiveBtn("month");
                  setChartData([6, 10, 4, 8]);
                  setChartLabels([
                    "شقق",
                    "وحدات سكنية",
                    "مطاعم",
                    "محلات تجارية",
                  ]);
                }}
                className={
                  activeBtn == "month"
                    ? `h-8 px-2 rounded-xl bg-surface-light-800 text-surface text-sm font-medium`
                    : "text-foreground/50 text-sm font-medium"
                }
              >
                {dict.month_stats}
              </button>
            </div>
            <ChartDemo labels={chartLabels} myData={chartData} />
          </UIDashCard> */}
        </div>
      </div>
    </>
  );
}
