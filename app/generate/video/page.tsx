"use client";

import React, { useEffect, useMemo, useState } from "react";
import { apiClient, Model, LoRA } from "../../../lib/api-client";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

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
          apiClient.getLoRAs()
        ]);
        const videoModels = modelsData.filter(model => model.type === 'video');
        setModels(videoModels);
        setLoRAs(lorasData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load persisted selections after data loads
  useEffect(() => {
    try {
      const persistedModel = localStorage.getItem('video_selected_model');
      const persistedLoRAs = JSON.parse(localStorage.getItem('video_selected_loras') || '[]');
      if (persistedModel) setSelectedModel(persistedModel);
      if (Array.isArray(persistedLoRAs)) setSelectedLoRAs(persistedLoRAs);
      if (!persistedModel && models.length > 0) setSelectedModel(models[0].id);
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models.length, loras.length]);

  // Persist selections
  useEffect(() => {
    try {
      if (selectedModel) localStorage.setItem('video_selected_model', selectedModel);
    } catch {}
  }, [selectedModel]);

  useEffect(() => {
    try {
      localStorage.setItem('video_selected_loras', JSON.stringify(selectedLoRAs));
    } catch {}
  }, [selectedLoRAs]);

  const filteredModels = useMemo(() => models.filter(model =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
    model.provider.toLowerCase().includes(modelSearch.toLowerCase())
  ), [models, modelSearch]);

  const filteredLoRAs = useMemo(() => loras.filter(lora =>
    lora.name.toLowerCase().includes(loraSearch.toLowerCase()) ||
    (lora.tags && lora.tags.some(tag => tag.toLowerCase().includes(loraSearch.toLowerCase())))
  ), [loras, loraSearch]);

  const handleLoRAToggle = (loraId: string) => {
    setSelectedLoRAs(prev =>
      prev.includes(loraId)
        ? prev.filter(id => id !== loraId)
        : [...prev, loraId]
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
        <h1 className="text-3xl font-bold text-gray-900">Generate Video</h1>
        <p className="text-gray-600 mt-2">Create amazing videos with AI models and LoRAs</p>
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
              Model Selection ({filteredModels.length} available)
            </h3>
            <input
              type="text"
              placeholder="Search models..."
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="overflow-y-auto" style={{ height: 256 }}>
              <List
                height={256}
                itemCount={filteredModels.length}
                itemSize={80}
                width={"100%"}
                itemKey={(index) => filteredModels[index].id}
              >
                {({ index, style }: ListChildComponentProps) => {
                  const model = filteredModels[index];
                  return (
                    <div style={style}>
                      <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
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
                    </div>
                  );
                }}
              </List>
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
            <div className="overflow-y-auto" style={{ height: 384 }}>
              <List
                height={384}
                itemCount={filteredLoRAs.length}
                itemSize={96}
                width={"100%"}
                itemKey={(index) => filteredLoRAs[index].id}
              >
                {({ index, style }: ListChildComponentProps) => {
                  const lora = filteredLoRAs[index];
                  return (
                    <div style={style}>
                      <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
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
                    </div>
                  );
                }}
              </List>
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
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  className="w-full"
                />
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
