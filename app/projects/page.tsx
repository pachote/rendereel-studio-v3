"use client";

import React, { useEffect, useState } from "react";
import { apiClient, Project } from "../../lib/api-client";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    try {
      await apiClient.createProject(newProject);
      setNewProject({ name: "", description: "" });
      setShowCreateForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-500 mt-2">Manage your AI generation projects</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 rounded-lg font-medium transition-colors text-white bg-black/40 border border-white/10 hover:bg-black/60"
        >
          New Project
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-500"
                placeholder="Enter project name..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-500"
                placeholder="Enter project description..."
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="text-white px-4 py-2 rounded-md font-medium transition-colors bg-black/40 border border-white/10 hover:bg-black/60"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-gray-300 px-4 py-2 rounded-md font-medium transition-colors bg-black/20 border border-white/10 hover:bg-black/40"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/70 transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">{project.name}</h3>
              <span className="text-xs text-gray-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-500 mb-4">{project.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>ID: {project.id}</span>
              <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-black/40 border border-white/10 hover:bg-black/60 text-white py-2 px-3 rounded-md text-sm font-medium transition-all">
                View Details
              </button>
              <button className="flex-1 bg-black/40 border border-white/10 hover:bg-black/60 text-white py-2 px-3 rounded-md text-sm font-medium transition-all">
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started with AI generation</p>
          <button onClick={() => setShowCreateForm(true)} className="px-6 py-3 rounded-lg font-medium transition-colors text-white bg-black/40 border border-white/10 hover:bg-black/60">
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
}
