"use client";

import styles from "./page.module.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Home() {
  const [ticker, setTicker] = useState<string>("");
  const router = useRouter()

  const submitTicker = () => {
    if(ticker.trim()) {
      router.push(`/tickerPage?ticker=${encodeURIComponent(ticker)}`);
    } else {
      alert("Please enter a valid ticker.");
    }
    
  };
  return (
    <div className={styles.page}>
      <input
        type="text"
        placeholder="Enter Ticker"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        style={{ padding: 10, width: "300px", marginBottom: 10 }}
      />
      <br/>
      <button
        onClick={submitTicker} style={{ padding: 10, fontSize: 16 }}
      >Select Ticker</button>
    </div>
  );
}
