"use client";

import React, { useEffect, useMemo, useState } from "react";
import { apiClient, Model, LoRA } from "@/lib/api-client";

export default function GenerateImage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loras, setLoRAs] = useState<LoRA[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedLoRAs, setSelectedLoRAs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [loraSearch, setLoraSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsData, lorasData] = await Promise.all([
          apiClient.getModels(),
          apiClient.getLoRAs(),
        ]);

        const imageModels = modelsData.filter((model) => model.type === "image");
        setModels(imageModels);
        setLoRAs(lorasData);

        if (imageModels.length > 0) {
          setSelectedModel(imageModels[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
      model.provider.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const selectedModelCategory = useMemo(() => {
    return models.find((m) => m.id === selectedModel)?.category?.toLowerCase();
  }, [models, selectedModel]);

  const filteredLoRAs = loras.filter((lora) => {
    const matchesSearch =
      lora.name.toLowerCase().includes(loraSearch.toLowerCase()) ||
      (lora.tags &&
        lora.tags.some((tag) => tag.toLowerCase().includes(loraSearch.toLowerCase())));
    const isContextMatch = selectedModelCategory
      ? (lora.tags || []).some((t) => t.toLowerCase().includes(selectedModelCategory))
      : true;
    return matchesSearch && isContextMatch;
  });

  const handleLoRAToggle = (loraId: string) => {
    setSelectedLoRAs((prev) =>
      prev.includes(loraId) ? prev.filter((id) => id !== loraId) : [...prev, loraId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading models and LoRAs...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Image Studio</h1>
          <p className="text-gray-600 mt-2">Forge‑style advanced controls</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prompt</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Negative Prompt</label>
              <textarea className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sampler</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Euler a</option>
                  <option>DPM++ 2M Karras</option>
                  <option>DDIM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
                <input type="range" min="10" max="100" defaultValue="40" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                <div className="grid grid-cols-2 gap-2">
                  <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>1024</option>
                    <option>768</option>
                    <option>1536</option>
                  </select>
                  <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>1024</option>
                    <option>768</option>
                    <option>1536</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CFG Scale</label>
                <input type="range" min="1" max="20" defaultValue="7" className="w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model</h3>
            <input
              type="text"
              placeholder="Search models... (Flux, SDXL)"
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredModels.map((model) => (
                <label key={model.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="model"
                    value={model.id}
                    checked={selectedModel === model.id}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.provider} • {model.category}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ADetailer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Face Restore</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Off</option>
                  <option>GFPGAN</option>
                  <option>CodeFormer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upscaler</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>None</option>
                  <option>ESRGAN 1x</option>
                  <option>ESRGAN 2x</option>
                  <option>4x-UltraSharp</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">LoRA Selector</h3>
          <input
            type="text"
            placeholder="Search LoRAs (context-aware by model)"
            value={loraSearch}
            onChange={(e) => setLoraSearch(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="max-h-72 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredLoRAs.map((lora) => (
              <label key={lora.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLoRAs.includes(lora.id)}
                  onChange={() => handleLoRAToggle(lora.id)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{lora.name}</div>
                  <div className="text-sm text-gray-500">{lora.type} • {lora.category}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">Generate</button>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Generations</h3>
          <div className="space-y-3">
            <div className="h-36 bg-gray-100 rounded-md" />
            <div className="h-36 bg-gray-100 rounded-md" />
            <div className="h-36 bg-gray-100 rounded-md" />
          </div>
        </div>
      </aside>
    </div>
  );
}


