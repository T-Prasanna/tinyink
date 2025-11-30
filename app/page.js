"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadLinks() {
    const res = await fetch("/api/links");
    setLinks(await res.json());
  }

  async function createLink(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // ✅ FIXED
      body: JSON.stringify({ url, customCode }),
    });

    const data = await res.json();
    if (res.ok) {
      setUrl("");
      setCustomCode("");
      loadLinks();
    } else {
      alert(data.error);
    }

    setLoading(false);
  }

  async function deleteLink(shortId) {
    await fetch(`/api/links/${shortId}`, { method: "DELETE" });
    loadLinks();
  }

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TinyLink Dashboard</h1>

      <form onSubmit={createLink} className="mb-6 flex gap-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 flex-1"
          placeholder="https://example.com"
        />
        <input
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          className="border p-2 w-40"
          placeholder="Custom code"
        />
        <button className="bg-black text-white px-4">
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Code</th>
            <th className="p-2">URL</th>
            <th className="p-2">Clicks</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link) => (
            <tr key={link.shortId} className="border">

              {/* ✅ FIXED: Use link.shortId */}
              <td className="p-2">{link.shortId}</td>

              <td className="p-2 truncate max-w-xs">{link.originalUrl}</td>

              {/* If no clicks yet, show 0 */}
              <td className="p-2">{link.clicks || 0}</td>

              <td className="p-2 flex gap-2">
                <a
                  className="text-blue-600"
                  href={`/code/${link.shortId}`}
                >
                  Stats
                </a>

                <button
                  onClick={() => deleteLink(link.shortId)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
