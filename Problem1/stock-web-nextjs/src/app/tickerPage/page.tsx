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

  // Function to fetch a new token
  const fetchToken = async () => {
    try {
      const response = await fetch(
        "http://20.244.56.144/evaluation-service/auth",
        {
          method: "POST",
          body: JSON.stringify({
            email: process.env.EMAIL,
            name: process.env.NAME,
            rollNo: process.env.ROLL_NO,
            accessCode: process.env.ACCESS_CODE,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
          })
        }
      );

      const data = await response.json();
      const newToken = data.token;
      setToken(newToken);
      console.log("Fetched new token:", newToken);
    } catch (err: any) {
      setError("Failed to fetch token");
    }
  };

  // Fetch token on component mount and set up a 5-minute interval to refresh it
  useEffect(() => {
    fetchToken(); // Fetch the token initially
    const interval = setInterval(fetchToken, 5 * 60 * 1000); // Refresh token every 5 minutes

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    if (ticker && token) {
      const fetchData = async () => {
        try {
          setLoading(true);

          const response = await fetch(
            `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=5`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
    } else if (!token) {
      setError("Token not available");
    }
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