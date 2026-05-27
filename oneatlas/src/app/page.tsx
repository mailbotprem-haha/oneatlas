"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const statuses = [
    "Matching template...",
    "Building schema...",
    "Almost ready...",
  ];

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    let i = 0;
    setStatus(statuses[0]);
    const interval = setInterval(() => {
      i++;
      if (i < statuses.length) setStatus(statuses[i]);
    }, 1000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      clearInterval(interval);
      if (data.data?.appId) {
        router.push(`/builder/${data.data.appId}`);
      } else {
        setStatus(data.error?.suggestion || "No template matched. Try again.");
        setLoading(false);
      }
    } catch {
      clearInterval(interval);
      setStatus("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-50">
        <span className="text-xl font-bold tracking-tight text-[#635BFF]">
          OneAtlas
        </span>
        <div className="hidden md:flex gap-8 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-900 transition">
            Templates
          </a>
          <a href="#" className="hover:text-gray-900 transition">
            Docs
          </a>
          <a href="#" className="hover:text-gray-900 transition">
            Pricing
          </a>
        </div>
        <button className="bg-[#635BFF] hover:bg-[#4f3fd1] text-white text-sm px-4 py-2 rounded-lg transition shadow-sm shadow-indigo-200">
          Start Building
        </button>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs text-indigo-500 mb-8 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          AI-Native App Builder
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 leading-tight text-gray-900">
          Build internal tools{" "}
          <span className="text-[#635BFF]">from a prompt</span>
        </h1>

        <p className="text-gray-500 text-lg md:text-xl max-w-xl mb-12">
          Describe what you need. OneAtlas matches a template, generates a
          schema, and renders a live app — instantly.
        </p>

        {/* Prompt Input */}
        <div className="w-full max-w-2xl">
          <div className="flex gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-[#635BFF] focus-within:ring-4 focus-within:ring-indigo-50 transition">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Build me a CRM for my sales team..."
              className="flex-1 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 outline-none text-sm"
              disabled={loading}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-[#635BFF] hover:bg-[#4f3fd1] disabled:opacity-40 text-white px-6 py-3 rounded-xl text-sm font-medium transition shadow-sm shadow-indigo-200 active:scale-95"
            >
              {loading ? "Generating..." : "Generate App"}
            </button>
          </div>

          {/* Example prompts */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {[
              "HR dashboard for employees",
              "Inventory tracking system",
              "Analytics workspace",
              "Admin panel for users",
            ].map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="text-xs text-gray-500 hover:text-[#635BFF] border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 rounded-full px-3 py-1.5 transition active:scale-95"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Status */}
          {loading && (
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {status}
            </div>
          )}
          {!loading && status && (
            <p className="mt-4 text-sm text-red-500">{status}</p>
          )}
        </div>
      </section>

      {/* Templates Section */}
      <section className="px-8 py-16 border-t border-gray-100 bg-gray-50/60">
        <h2 className="text-center text-2xl font-bold mb-10 text-gray-800">
          Start from a template
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {[
            { name: "CRM Workspace", category: "Sales", color: "#635BFF" },
            {
              name: "Admin Dashboard",
              category: "Operations",
              color: "#FF5996",
            },
            {
              name: "Analytics Workspace",
              category: "Analytics",
              color: "#00D4B1",
            },
            {
              name: "Inventory System",
              category: "Operations",
              color: "#FFB17A",
            },
            { name: "HR Dashboard", category: "HR", color: "#00A3FF" },
          ].map((t) => (
            <button
              key={t.name}
              onClick={() => setPrompt(`Build me a ${t.name}`)}
              className="text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-indigo-200 rounded-xl p-4 transition group shadow-sm active:scale-95"
            >
              <div
                className="w-8 h-8 rounded-lg mb-3"
                style={{
                  backgroundColor: t.color + "1a",
                  border: `1px solid ${t.color}40`,
                }}
              />
              <p className="text-sm font-medium text-gray-800 group-hover:text-[#635BFF] transition">
                {t.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">{t.category}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-gray-100 text-center text-xs text-gray-400">
        © 2026 OneAtlas. Built for internal teams.
      </footer>
    </main>
  );
}
