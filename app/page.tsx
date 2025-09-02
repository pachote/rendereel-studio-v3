"use client";

import React, { useEffect, useState } from "react";
import { apiClient, Project, Render } from "../lib/api-client";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [renders, setRenders] = useState<Render[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, rendersResponse] = await Promise.all([
          apiClient.getProjects(),
          apiClient.getRenders()
        ]);
        setProjects(projectsResponse.data);
        setRenders(rendersResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to Rendereel Studio V3</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/70 transition-all">
          <div className="text-sm text-gray-400 mb-2">Projects</div>
          <div className="text-3xl font-bold">{projects.length}</div>
        </div>

        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/70 transition-all">
          <div className="text-sm text-gray-400 mb-2">Renders</div>
          <div className="text-3xl font-bold">{renders.length}</div>
        </div>

        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/70 transition-all">
          <div className="text-sm text-gray-400 mb-2">Status</div>
          <div className="text-3xl font-bold text-blue-500">Active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/70 transition-all">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex justify-between items-center p-3 bg-black/40 border border-white/10 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects yet</p>
          )}
        </div>

        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/70 transition-all">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Renders</h3>
          {renders.length > 0 ? (
            <div className="space-y-3">
              {renders.slice(0, 5).map((render) => (
                <div key={render.id} className="flex justify-between items-center p-3 bg-black/40 border border-white/10 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Render {render.id}</p>
                    <p className="text-sm text-gray-500">Project: {render.projectId}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full border ${
                      render.status === 'completed' ? 'border-green-500/30 text-green-400' :
                      render.status === 'processing' ? 'border-blue-500/30 text-blue-400' :
                      'border-yellow-500/30 text-yellow-400'
                    }`}>
                      {render.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{render.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No renders yet</p>
          )}
        </div>
      </div>

      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/70 transition-all">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-black/60 hover:scale-105 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
            <span className="text-sm text-gray-300">Generate Image</span>
          </button>
          <button className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-black/60 hover:scale-105 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
            <span className="text-sm text-gray-300">Generate Video</span>
          </button>
          <button className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-black/60 hover:scale-105 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
            <span className="text-sm text-gray-300">New Project</span>
          </button>
          <button className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-black/60 hover:scale-105 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <span className="text-sm text-gray-300">View Renders</span>
          </button>
        </div>
      </div>
    </div>
  );
}
