

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
    "Generating workspace...",
  ];

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setLoading(true);

    let i = 0;

    setStatus(statuses[0]);

    const interval = setInterval(() => {
      i++;

      if (i < statuses.length) {
        setStatus(statuses[i]);
      }
    }, 1200);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      clearInterval(interval);

      if (data.data?.appId) {
        router.push(`/builder/${data.data.appId}`);
      } else {
        setStatus(
          data.error?.suggestion ||
            "No template matched. Try again."
        );

        setLoading(false);
      }
    } catch {
      clearInterval(interval);

      setStatus("Something went wrong.");

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5EE] text-[#111111]">
      {/* Navbar */}

      <nav className="sticky top-0 z-50 border-b border-[#E5E7EB]/80 bg-[#F5F5EE]/90 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="text-[20px] font-semibold tracking-[-0.03em]">
              OneAtlas
            </span>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#"
                className="text-[15px] font-medium text-[#6B7280] hover:text-[#111111] transition"
              >
                Templates
              </a>

              <a
                href="#"
                className="text-[15px] font-medium text-[#6B7280] hover:text-[#111111] transition"
              >
                Docs
              </a>

              <a
                href="#"
                className="text-[15px] font-medium text-[#6B7280] hover:text-[#111111] transition"
              >
                Pricing
              </a>
            </div>
          </div>

          <button className="h-12 px-5 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white text-[15px] font-semibold transition">
            Start Building
          </button>
        </div>
      </nav>

      {/* Hero */}

      <section className="py-20 md:py-32">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}

          <div>
            <div className="inline-flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#FF6600]" />

              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                AI-native app builder
              </span>
            </div>

            <h1 className="text-[56px] md:text-[72px] leading-[0.95] tracking-[-0.04em] font-bold text-[#111111] max-w-[700px]">
              Build internal tools from a prompt
            </h1>

            <p className="mt-8 text-[18px] leading-[1.7] text-[#6B7280] max-w-[560px]">
              Describe what you need. OneAtlas matches a
              template, generates a schema, and renders a
              production-ready workspace instantly.
            </p>

            {/* Prompt */}

            <div className="mt-12 bg-white border border-[#E5E7EB] rounded-[28px] p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={prompt}
                  disabled={loading}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleGenerate()
                  }
                  placeholder="Build me a CRM for my sales team..."
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#111111] placeholder:text-[#9CA3AF] px-2 py-3"
                />

                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="h-12 px-6 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] disabled:opacity-50 text-white text-[15px] font-semibold transition whitespace-nowrap"
                >
                  {loading
                    ? "Generating..."
                    : "Generate App"}
                </button>
              </div>

              {/* Example Prompts */}

              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  "HR dashboard",
                  "Inventory system",
                  "CRM workspace",
                  "Analytics dashboard",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="px-3 py-2 rounded-full border border-[#E5E7EB] bg-white text-[13px] text-[#6B7280] hover:text-[#111111] hover:border-[#D1D5DB] transition"
                  >
                    {example}
                  </button>
                ))}
              </div>

              {/* Status */}

              {status && (
                <div className="mt-5 text-[14px] text-[#6B7280]">
                  {status}
                </div>
              )}
            </div>
          </div>

          {/* Right Workspace Preview */}

          <div className="relative">
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_24px_rgba(0,0,0,0.03)]">
              {/* Top Bar */}

              <div className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                </div>

                <div className="text-[13px] text-[#9CA3AF]">
                  CRM Workspace
                </div>
              </div>

              {/* Workspace */}

              <div className="grid grid-cols-[220px_1fr] min-h-[540px]">
                {/* Sidebar */}

                <div className="border-r border-[#E5E7EB] bg-[#FAFAF8] p-5">
                  <div className="space-y-2">
                    {[
                      "Dashboard",
                      "Customers",
                      "Deals",
                      "Analytics",
                      "Settings",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`h-11 rounded-xl px-4 flex items-center text-[14px] ${
                          index === 1
                            ? "bg-white border border-[#E5E7EB] text-[#111111]"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}

                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((card) => (
                      <div
                        key={card}
                        className="bg-white border border-[#E5E7EB] rounded-3xl p-5"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-[#F5F5EE]" />

                        <div className="mt-5 h-3 w-24 rounded-full bg-[#ECECEC]" />

                        <div className="mt-3 h-2 w-16 rounded-full bg-[#F1F1F1]" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-white border border-[#E5E7EB] rounded-3xl p-6">
                    <div className="h-3 w-32 rounded-full bg-[#ECECEC]" />

                    <div className="mt-6 space-y-4">
                      {[1, 2, 3, 4].map((row) => (
                        <div
                          key={row}
                          className="flex items-center justify-between"
                        >
                          <div className="h-2 w-40 rounded-full bg-[#F1F1F1]" />

                          <div className="h-2 w-16 rounded-full bg-[#ECECEC]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}

      <section className="border-t border-[#E5E7EB] py-24">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="max-w-[720px]">
            <p className="text-[12px] uppercase tracking-[0.08em] font-semibold text-[#9CA3AF]">
              Templates
            </p>

            <h2 className="mt-4 text-[40px] md:text-[48px] leading-[1] tracking-[-0.03em] font-semibold text-[#111111]">
              Start from a production-ready workspace
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
            {[
              "CRM Workspace",
              "Analytics Dashboard",
              "Inventory System",
              "Admin Portal",
            ].map((template) => (
              <button
                key={template}
                onClick={() =>
                  setPrompt(`Build me a ${template}`)
                }
                className="text-left bg-white border border-[#ECECEC] rounded-[28px] p-7 min-h-[260px] hover:-translate-y-1 hover:border-[#D1D5DB] transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5EE]" />

                <div className="mt-12">
                  <h3 className="text-[22px] font-semibold text-[#111111]">
                    {template}
                  </h3>

                  <p className="mt-3 text-[15px] leading-[1.7] text-[#6B7280]">
                    AI-generated internal workspace with
                    structured data models.
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t border-[#E5E7EB] py-8">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="text-[14px] text-[#9CA3AF]">
            © 2026 OneAtlas
          </span>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[14px] text-[#6B7280] hover:text-[#111111] transition"
            >
              Privacy
            </a>

            <a
              href="#"
              className="text-[14px] text-[#6B7280] hover:text-[#111111] transition"
            >
              Terms
            </a>

            <a
              href="#"
              className="text-[14px] text-[#6B7280] hover:text-[#111111] transition"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
