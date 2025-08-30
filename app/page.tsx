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
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Rendereel Studio V3</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{projects.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total projects</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Renders</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{renders.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total renders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Status</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">Active</p>
          <p className="text-sm text-gray-500 mt-1">System status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
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

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Renders</h3>
          {renders.length > 0 ? (
            <div className="space-y-3">
              {renders.slice(0, 5).map((render) => (
                <div key={render.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">Render {render.id}</p>
                    <p className="text-sm text-gray-500">Project: {render.projectId}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      render.status === 'completed' ? 'bg-green-100 text-green-800' :
                      render.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
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

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">🖼️</div>
            <p className="font-medium text-blue-900">Generate Image</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">🎬</div>
            <p className="font-medium text-purple-900">Generate Video</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">📁</div>
            <p className="font-medium text-green-900">New Project</p>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">⚡</div>
            <p className="font-medium text-orange-900">View Renders</p>
          </button>
        </div>
      </div>
    </div>
  );
}
