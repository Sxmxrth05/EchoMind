// EmotionMap.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Backend API URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface EmotionData {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
}

interface EmotionResponse {
  emotion: string;
  score: string;
}

interface EmotionMapProps {
  userId?: string; // Optional user ID to fetch specific user's emotion data
}

const EmotionMap: React.FC<EmotionMapProps> = ({ userId }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch emotion data from backend
  useEffect(() => {
    const fetchEmotionData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct the API endpoint - adjust the path according to your backend
        const endpoint = userId
          ? `${BACKEND_URL}/api/emotions/${userId}`
          : `${BACKEND_URL}/api/emotions`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch emotion data: ${response.status}`);
        }

        const data: EmotionResponse[] = await response.json();

        // Transform array response to EmotionData object
        const emotions: EmotionData = {
          joy: 0,
          sadness: 0,
          anger: 0,
          fear: 0,
          surprise: 0,
          disgust: 0,
        };

        // Parse the response array and map emotions to scores
        data.forEach((item) => {
          const emotionName = item.emotion.toLowerCase() as keyof EmotionData;
          const score = parseFloat(item.score) * 10; // Convert 0-1 scale to 0-10

          if (emotionName in emotions) {
            emotions[emotionName] = score;
          }
        });

        setEmotionData(emotions);
      } catch (err) {
        console.error("Error fetching emotion data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load emotion data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmotionData();
  }, [userId]);

  useEffect(() => {
    if (!chartRef.current || !emotionData) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Disgust"],
        datasets: [
          {
            label: "My Emotion Map",
            data: [
              emotionData.joy,
              emotionData.sadness,
              emotionData.anger,
              emotionData.fear,
              emotionData.surprise,
              emotionData.disgust,
            ],
            fill: true,
            backgroundColor: "rgba(100, 200, 255, 0.3)",
            borderColor: "rgb(120, 220, 255)",
            pointBackgroundColor: "rgb(120, 220, 255)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(120, 220, 255)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            angleLines: { color: "rgba(255, 255, 255, 0.15)" },
            grid: { color: "rgba(255, 255, 255, 0.15)" },
            pointLabels: { color: "#e0e0e0", font: { size: 14 } },
            ticks: {
              backdropColor: "transparent",
              color: "#b0b0b0",
              stepSize: 2,
            },
            suggestedMin: 0,
            suggestedMax: 10,
          },
        },
        plugins: {
          legend: {
            labels: { color: "#e0e0e0" },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [emotionData]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Emotion Map</h1>

      {loading && (
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading emotion data...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Error: {error}</p>
          <p style={styles.errorSubtext}>
            Unable to load emotion data from the server.
          </p>
        </div>
      )}

      {!loading && !error && emotionData && (
        <>
          <div style={styles.chartContainer}>
            <canvas ref={chartRef} />
          </div>
          <div style={styles.dataInfo}>
            Visualizing emotional intensity across different states
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "rgba(30, 30, 50, 0.6)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    maxWidth: "800px",
    width: "100%",
    margin: "0 auto",
  },
  title: {
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2em",
    margin: "0 0 30px 0",
  },
  chartContainer: {
    maxHeight: "500px",
    position: "relative",
  },
  dataInfo: {
    color: "#b0b0b0",
    marginTop: "20px",
    textAlign: "center",
    fontSize: "0.9em",
    opacity: 0.8,
  },
  loadingContainer: {
    textAlign: "center",
    padding: "40px",
  },
  loadingText: {
    color: "#e0e0e0",
    fontSize: "1.2em",
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: "1.2em",
    marginBottom: "10px",
  },
  errorSubtext: {
    color: "#b0b0b0",
    fontSize: "0.9em",
  },
};

export default EmotionMap;
