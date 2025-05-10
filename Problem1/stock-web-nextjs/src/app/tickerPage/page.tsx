"use client";

import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function TickerPage() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get("ticker");

  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const credentials = {
    email: process.env.NEXT_PUBLIC_EMAIL!,
    name: process.env.NEXT_PUBLIC_NAME!,
    rollNo: process.env.NEXT_PUBLIC_ROLL_NO!,
    accessCode: process.env.NEXT_PUBLIC_ACCESS_CODE!,
    clientID: process.env.NEXT_PUBLIC_CLIENT_ID!,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
  };

  const fetchToken = async () => {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log("Token response:", data);

    if (!response.ok || !data.access_token) {
      throw new Error("Token fetch failed");
    }

    setToken(data.access_token);
  } catch (err: any) {
    setError("Failed to fetch token: " + err.message);
  }
};


  // Fetch token on mount and refresh every 5 mins
  useEffect(() => {
    fetchToken();
    const interval = setInterval(fetchToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data once token and ticker are available
  useEffect(() => {
    const fetchData = async () => {
      if (!ticker || !token) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker, token]);

  return (
    <div className={styles.page}>
      <h1>Ticker Page</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && data && (
        <div>
          <h2>Data for Ticker: {ticker}</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {!loading && !error && !data && (
        <p style={{ color: "red" }}>No data found for the ticker.</p>
      )}
    </div>
  );
}
