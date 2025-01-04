import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const ApexChartComponent = ({ type, width, colors, series, showToolTip }) => {
  const chartRef = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    // Define chart options
    const chartOptions = {
      chart: {
        height: 280,
        type: type || 'area',
        width: width || '100%',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: showToolTip || false,
        x: {
          show: false,
        },
      },
      subtitle: {
        text: "",
        floating: true,
        offsetX: 20,
        offsetY: 50,
        style: {
          fontSize: "12px",
          fontWeight: "normal",
          color: "#9699a2",
        },
      },
      colors: colors || ['#1CC72D'],
      tooltip: {
        enabled: false,
        x: {
          show: false
        }
      },
      stroke: {
        show: true,
        curve: "smooth",
        lineCap: "butt",
        width: 4,
        dashArray: 0,
      },
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      series: series || [
        {
          name: "",
          data: [45, 52, 38, 35, 19, 23],
        },
      ],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.9,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
        min: 0,
        max: 100,
      },
    };

    // Initialize chart only once
    if (!chartRef.current) {
      chartRef.current = new ApexCharts(ref.current, chartOptions);
      chartRef.current.render();
    } else {
      // Update the chart if type or other options change
      chartRef.current.updateOptions(chartOptions);
    }

    return () => {
      // Cleanup on unmount
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [series]);

  return <div ref={ref} id="chart" className="apex-chart"></div>;
};

export default ApexChartComponent;
