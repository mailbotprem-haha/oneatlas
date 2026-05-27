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
  const [selected, setSelected] = useState<Component | null>(null);
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
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="w-2 h-2 rounded-full bg-[#635BFF] animate-ping" />
          Loading app...
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        App not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-[#635BFF] font-bold text-sm">OneAtlas</span>
          <span className="text-gray-300 text-sm">→</span>
          <span className="text-sm font-medium text-gray-800">{app.name}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            v{app.version}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Generated from {app.templateUsed}
          </span>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg transition active:scale-95">
            Share
          </button>
          <button className="bg-[#635BFF] hover:bg-[#4f3fd1] text-white text-xs px-3 py-1.5 rounded-lg transition shadow-sm shadow-indigo-100 active:scale-95">
            Deploy
          </button>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Component Tree */}
        <div className="w-56 border-r border-gray-100 bg-gray-50/70 p-4 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">
            Components
          </p>
          <div className="flex flex-col gap-1">
            {app.schema.components
              .sort((a, b) => a.order - b.order)
              .map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelected(comp)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition ${
                    selected?.id === comp.id
                      ? "bg-indigo-50 text-[#635BFF] font-medium"
                      : "text-gray-500 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  <span className="text-xs mr-2 opacity-50">
                    {comp.type === "table"
                      ? "⊞"
                      : comp.type === "chart"
                        ? "↗"
                        : comp.type === "card"
                          ? "◻"
                          : "≡"}
                  </span>
                  {comp.name}
                </button>
              ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            {app.schema.title}
          </h2>
          <div className="grid gap-4">
            {app.schema.components
              .sort((a, b) => a.order - b.order)
              .map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => setSelected(comp)}
                  className={`bg-white border rounded-xl p-5 cursor-pointer transition shadow-sm ${
                    selected?.id === comp.id
                      ? "border-[#635BFF] ring-4 ring-indigo-50"
                      : "border-gray-200 hover:border-indigo-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm text-gray-800">
                      {comp.name}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {comp.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {comp.fields.map((f) => (
                      <span
                        key={f.name}
                        className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600"
                      >
                        {f.name}
                        <span className="text-gray-400 ml-1">{f.type}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Panel — Field Editor */}
        <div className="w-64 border-l border-gray-100 bg-gray-50/70 p-4 overflow-y-auto">
          {selected ? (
            <>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">
                Properties
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {selected.name}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Type: {selected.type}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                Fields
              </p>
              <div className="flex flex-col gap-2">
                {selected.fields.map((f) => (
                  <div
                    key={f.name}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
                  >
                    <p className="text-xs font-medium text-gray-800">
                      {f.name}
                    </p>
                    <p className="text-xs text-gray-400">{f.type}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400 mt-4">
              Select a component to edit
            </p>
          )}
        </div>
      </div>

      {/* Conversational Input */}
      <div className="border-t border-gray-100 bg-white px-6 py-4">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Add a priority field to tasks, rename contact to client..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-indigo-50 transition"
          />
          <button className="bg-[#635BFF] hover:bg-[#4f3fd1] text-white text-sm px-4 py-2.5 rounded-xl transition shadow-sm shadow-indigo-100 active:scale-95">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
