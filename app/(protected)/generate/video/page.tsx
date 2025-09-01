"use client";

import React, { useEffect, useState } from "react";
import { apiClient, Model, LoRA } from "@/lib/api-client";

export default function GenerateVideo() {
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

        // Only allow Kling v1.6/v2.1 variants and WAN 2.2
        const approved = modelsData.filter((m) => {
          const name = (m.name || '').toLowerCase();
          return (
            name.includes('kling') && (name.includes('v1.6') || name.includes('v2.1'))
          ) || name.includes('wan 2.2');
        });

        setModels(approved);
        setLoRAs(lorasData);

        if (approved.length > 0) {
          setSelectedModel(approved[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
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

  const selectedModelName = models.find((m) => m.id === selectedModel)?.name?.toLowerCase() || "";
  const filteredLoRAs = loras.filter((lora) => {
    const matchesSearch =
      lora.name.toLowerCase().includes(loraSearch.toLowerCase()) ||
      (lora.tags && lora.tags.some((tag) => tag.toLowerCase().includes(loraSearch.toLowerCase())));
    if (selectedModelName.includes('wan')) {
      return matchesSearch && (lora.tags || []).some((t) => t.toLowerCase().includes('wan'));
    }
    if (selectedModelName.includes('kling')) {
      return matchesSearch && (lora.tags || []).some((t) => t.toLowerCase().includes('kling'));
    }
    return matchesSearch;
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Video Studio</h1>
        <p className="text-gray-600 mt-2">Kling and WAN 2.2 with LoRAs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Approved Models ({filteredModels.length})
            </h3>
            <input
              type="text"
              placeholder="Search models..."
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
                    {model.description && (
                      <div className="text-sm text-gray-400 mt-1">{model.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              LoRA Selection ({selectedLoRAs.length} selected, {filteredLoRAs.length} available)
            </h3>
            <input
              type="text"
              placeholder="Search LoRAs..."
              value={loraSearch}
              onChange={(e) => setLoraSearch(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="max-h-96 overflow-y-auto space-y-2">
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
                    <div className="text-sm text-gray-500">
                      {lora.type} • {lora.category} • Strength: {lora.strength}
                    </div>
                    {lora.description && (
                      <div className="text-sm text-gray-400 mt-1">{lora.description}</div>
                    )}
                    {lora.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lora.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="2">2 seconds</option>
                  <option value="4" selected>4 seconds</option>
                  <option value="6">6 seconds</option>
                  <option value="8">8 seconds</option>
                  <option value="10">10 seconds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="720p">720p (1280x720)</option>
                  <option value="1080p" selected>1080p (1920x1080)</option>
                  <option value="4k">4K (3840x2160)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frame Rate</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="24">24 FPS</option>
                  <option value="30" selected>30 FPS</option>
                  <option value="60">60 FPS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motion Intensity</label>
                <input type="range" min="1" max="10" defaultValue="5" className="w-full" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Generate Video
          </button>
        </div>
      </div>
    </div>
  );
}


