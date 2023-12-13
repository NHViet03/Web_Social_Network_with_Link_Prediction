import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ chartData }) => {
  const scaleStyle = {
    grid: {
      display: false,
    },
    ticks: {
      color: "#fff",
      font: {
        size: 14,
        weight: "500",
      },
      padding: 4,
    },
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(240deg, #c43302,#c43302e6)",
        borderRadius: "8px",
        padding: "8px",
        height: "60%",
      }}
    >
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            color: ["#fff"],
          },
          scales: {
            x: {
              ...scaleStyle,
              // title: {
              //   display: true,
              //   color: "#fff",
              //   font: {
              //     size: 16,
              //     weight: "500",
              //   },
              //   text: "Tháng",
              // },
            },
            y: scaleStyle,
          },
        }}
      />
    </div>
  );
};

export default BarChart;
