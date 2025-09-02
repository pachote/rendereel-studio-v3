"use client";

import React, { useEffect, useState } from "react";
import { apiClient, Model, LoRA } from "../../../lib/api-client";

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
          apiClient.getLoRAs()
        ]);
        
        const imageModels = modelsData.filter(model => model.type === 'image');
        setModels(imageModels);
        setLoRAs(lorasData);
        
        if (imageModels.length > 0) {
          setSelectedModel(imageModels[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
    model.provider.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const filteredLoRAs = loras.filter(lora =>
    lora.name.toLowerCase().includes(loraSearch.toLowerCase()) ||
    (lora.tags && lora.tags.some(tag => tag.toLowerCase().includes(loraSearch.toLowerCase())))
  );

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
        <div className="text-lg text-gray-500">Loading models and LoRAs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Generate Image</h1>
        <p className="text-gray-500 mt-2">Create stunning images with AI models and LoRAs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full h-32 p-3 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-500"
            />
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Model Selection ({filteredModels.length} available)
            </h3>
            <input
              type="text"
              placeholder="Search models..."
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              className="w-full p-2 mb-4 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-500"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredModels.map((model) => (
                <label key={model.id} className="flex items-center p-3 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer">
                  <input
                    type="radio"
                    name="model"
                    value={model.id}
                    checked={selectedModel === model.id}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{model.name}</div>
                    <div className="text-sm text-gray-400">{model.provider} • {model.category}</div>
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
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              LoRA Selection ({selectedLoRAs.length} selected, {filteredLoRAs.length} available)
            </h3>
            <input
              type="text"
              placeholder="Search LoRAs..."
              value={loraSearch}
              onChange={(e) => setLoraSearch(e.target.value)}
              className="w-full p-2 mb-4 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-500"
            />
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredLoRAs.map((lora) => (
                <label key={lora.id} className="flex items-center p-3 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLoRAs.includes(lora.id)}
                    onChange={() => handleLoRAToggle(lora.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{lora.name}</div>
                    <div className="text-sm text-gray-400">
                      {lora.type} • {lora.category} • Strength: {lora.strength}
                    </div>
                    {lora.description && (
                      <div className="text-sm text-gray-400 mt-1">{lora.description}</div>
                    )}
                    {lora.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lora.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 border border-blue-500/30 text-blue-400 text-xs rounded-full">
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

          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Generation Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Width</label>
                <select className="w-full p-2 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white">
                  <option value="512">512px</option>
                  <option value="768">768px</option>
                  <option value="1024" selected>1024px</option>
                  <option value="1536">1536px</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                <select className="w-full p-2 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white">
                  <option value="512">512px</option>
                  <option value="768">768px</option>
                  <option value="1024" selected>1024px</option>
                  <option value="1536">1536px</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Steps</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  defaultValue="50"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>10</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full text-white font-medium py-3 px-4 rounded-lg transition-colors bg-black/40 border border-white/10 hover:bg-black/60">
            Generate Image
          </button>
        </div>
      </div>
    </div>
  );
}
