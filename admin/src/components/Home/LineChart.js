import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ chartData }) {
  const scaleStyle = {
    grid: {
      display: false,
    },
    ticks: {
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
        padding: "8px",
        flex: 1,
      }}
    >
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position:'bottom'
            },
            color: ["#fff"],
          },
          scales: {
            x: scaleStyle,
            y: {
              ...scaleStyle,
              grid: {
                display: true,
              },
            },
          },
        }}
      />
    </div>
  );
}

export default LineChart;
