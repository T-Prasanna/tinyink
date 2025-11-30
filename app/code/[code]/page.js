"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Stats() {
  const { code } = useParams();     // dynamic route param
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/links/${code}`)
      .then(async (r) => {
        if (!r.ok) {
          // Handle API error safely
          const err = await r.json().catch(() => null);
          setData({ error: err?.error || "Not found" });
          return;
        }

        // Valid JSON → set data
        setData(await r.json());
      })
      .catch(() => {
        // Network / server failure
        setData({ error: "Network error" });
      });
  }, [code]);

  // show loading
  if (!data) return <p>Loading...</p>;

  // show readable error
  if (data.error) return <p>{data.error}</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Stats for {code}</h1>
      <p><strong>Original:</strong> {data.originalUrl}</p>
      <p><strong>Clicks:</strong> {data.clicks}</p>
      <p><strong>Last Clicked:</strong> {data.lastClicked || "Never"}</p>
    </div>
  );
}
