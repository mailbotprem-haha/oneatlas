"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Field = {
  name: string;
  type: string;
  required?: boolean;
};

type Component = {
  id: string;
  name: string;
  type: string;
  order: number;
  fields: Field[];
};

type Schema = {
  title: string;
  layout: string;
  components: Component[];
};

type AppData = {
  id: string;
  name: string;
  schema: Schema;
  version: number;
  templateUsed: string;
};

export default function BuilderPage() {
  const { id } = useParams();

  const [app, setApp] = useState<AppData | null>(null);
  const [selected, setSelected] = useState<Component | null>(
    null
  );

  const [instruction, setInstruction] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/apps/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setApp(d.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5EE] flex items-center justify-center">
        <div className="text-[15px] text-[#6B7280]">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-[#F5F5EE] flex items-center justify-center">
        <div className="text-[15px] text-[#6B7280]">
          App not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5EE] text-[#111111] flex flex-col">
      {/* Topbar */}

      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-[#F5F5EE]/90 backdrop-blur-sm">
        <div className="h-[72px] px-5 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[18px] font-semibold tracking-[-0.03em]">
              OneAtlas
            </span>

            <div className="hidden md:block w-px h-5 bg-[#E5E7EB]" />

            <div className="hidden md:flex items-center gap-3">
              <span className="text-[14px] text-[#6B7280]">
                {app.name}
              </span>

              <span className="px-2 py-1 rounded-full border border-[#E5E7EB] bg-white text-[11px] text-[#9CA3AF]">
                v{app.version}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex h-11 px-4 rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-medium text-[#111111] hover:bg-[#FAFAFA] transition">
              Share
            </button>

            <button className="h-11 px-5 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white text-[14px] font-semibold transition">
              Deploy
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}

        <aside className="hidden lg:flex w-[260px] border-r border-[#E5E7EB] bg-[#F8F8F3] flex-col">
          <div className="p-6 border-b border-[#E5E7EB]">
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#9CA3AF]">
              Components
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {app.schema.components
                .sort((a, b) => a.order - b.order)
                .map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelected(comp)}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition ${
                      selected?.id === comp.id
                        ? "bg-white border border-[#E5E7EB]"
                        : "hover:bg-white/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium text-[#111111]">
                        {comp.name}
                      </span>

                      <span className="text-[11px] text-[#9CA3AF] uppercase">
                        {comp.type}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </aside>

        {/* Main Canvas */}

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-5 md:px-10 py-10 md:py-14">
            {/* Title */}

            <div className="mb-12">
              <p className="text-[12px] uppercase tracking-[0.08em] font-semibold text-[#9CA3AF]">
                Generated Workspace
              </p>

              <h1 className="mt-4 text-[40px] md:text-[56px] leading-[0.95] tracking-[-0.04em] font-bold">
                {app.schema.title}
              </h1>

              <p className="mt-5 max-w-2xl text-[18px] leading-[1.7] text-[#6B7280]">
                AI-generated operational interface structured
                from your prompt and connected data schema.
              </p>
            </div>

            {/* Components */}

            <div className="space-y-5">
              {app.schema.components
                .sort((a, b) => a.order - b.order)
                .map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => setSelected(comp)}
                    className={`bg-white border rounded-[28px] p-6 md:p-8 cursor-pointer transition ${
                      selected?.id === comp.id
                        ? "border-[#FF6600]"
                        : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-[22px] font-semibold text-[#111111]">
                          {comp.name}
                        </h3>

                        <p className="mt-2 text-[15px] text-[#6B7280] capitalize">
                          {comp.type} component
                        </p>
                      </div>

                      <div className="px-3 py-1 rounded-full border border-[#E5E7EB] bg-[#FAFAFA] text-[11px] uppercase tracking-[0.08em] text-[#9CA3AF]">
                        {comp.fields.length} fields
                      </div>
                    </div>

                    {/* Fields */}

                    <div className="flex flex-wrap gap-3 mt-8">
                      {comp.fields.map((field) => (
                        <div
                          key={field.name}
                          className="px-4 py-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]"
                        >
                          <p className="text-[14px] font-medium text-[#111111]">
                            {field.name}
                          </p>

                          <p className="mt-1 text-[12px] text-[#9CA3AF]">
                            {field.type}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </main>

        {/* Right Panel */}

        <aside className="hidden xl:flex w-[320px] border-l border-[#E5E7EB] bg-[#FAFAF8] flex-col">
          <div className="p-6 border-b border-[#E5E7EB]">
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#9CA3AF]">
              Properties
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selected ? (
              <>
                <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6">
                  <h3 className="text-[22px] font-semibold text-[#111111]">
                    {selected.name}
                  </h3>

                  <p className="mt-2 text-[15px] text-[#6B7280] capitalize">
                    {selected.type} component
                  </p>

                  <div className="mt-8 space-y-3">
                    {selected.fields.map((field) => (
                      <div
                        key={field.name}
                        className="border border-[#E5E7EB] rounded-2xl p-4"
                      >
                        <p className="text-[14px] font-medium text-[#111111]">
                          {field.name}
                        </p>

                        <p className="mt-1 text-[12px] text-[#9CA3AF]">
                          {field.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-[14px] text-[#9CA3AF]">
                Select a component
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom Prompt */}

      <div className="border-t border-[#E5E7EB] bg-[#F5F5EE]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-5">
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={instruction}
              onChange={(e) =>
                setInstruction(e.target.value)
              }
              placeholder="Add priority field to tasks..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#111111] placeholder:text-[#9CA3AF] px-2 py-3"
            />

            <button className="h-12 px-6 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white text-[15px] font-semibold transition whitespace-nowrap">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
