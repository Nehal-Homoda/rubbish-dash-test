"use client"
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

interface Props {
  type?: string;
  labels: string[];
  myData: number[];
  XTitle?: string;
  YTitle?: string;
};

export default function ChartDemo({
    type = "bar",
    labels,
    myData,
    XTitle="الخدمات",
    YTitle="عدد الاشتراكات",
}: Props) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: "rgb(0 148 20)",
          borderColor: "rgb(0 148 20)",
          borderWidth: 2,
          borderRadius: 10,
          barThickness: 30,
          borderSkipped: false,
          data: myData,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      responsive: true,
      pointStyle: "circle",
      layout: {
        padding: {
          right: 10,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: XTitle,
            color: "rgb(0 148 20)",
            align: "end",
            margin: {
              right: 20,
            },
            font: {
              size: 14,
              weight: "bold",
            },
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          title: {
            display: true,
            text: YTitle,
            color: "rgb(0 148 20)",
            align: "end",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            display: true,
            color: surfaceBorder,
            borderDash: [5, 5],
            drawBorder: false,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [myData,labels,XTitle,YTitle]);

  return (
    <div className="card w-full">
      <Chart type={type} data={chartData} options={chartOptions} />
    </div>
  );
}
