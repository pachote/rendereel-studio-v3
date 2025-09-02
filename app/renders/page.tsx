"use client";

import React, { useEffect, useState } from "react";
import { apiClient, Render } from "../../lib/api-client";

export default function Renders() {
  const [renders, setRenders] = useState<Render[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRender, setNewRender] = useState({ projectId: "", status: "queued", progress: 0 });

  useEffect(() => {
    fetchRenders();
  }, []);

  const fetchRenders = async () => {
    try {
      const response = await apiClient.getRenders();
      setRenders(response.data);
    } catch (error) {
      console.error('Failed to fetch renders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRender.projectId.trim()) return;

    try {
      await apiClient.createRender(newRender);
      setNewRender({ projectId: "", status: "queued", progress: 0 });
      setShowCreateForm(false);
      fetchRenders();
    } catch (error) {
      console.error('Failed to create render:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading renders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Renders</h1>
          <p className="text-gray-500 mt-2">Monitor your AI generation tasks</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 rounded-lg font-medium transition-colors text-white bg-black/40 border border-white/10 hover:bg-black/60"
        >
          New Render
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Render</h3>
          <form onSubmit={handleCreateRender} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project ID</label>
              <input
                type="text"
                value={newRender.projectId}
                onChange={(e) => setNewRender({ ...newRender, projectId: e.target.value })}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-500"
                placeholder="Enter project ID..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={newRender.status}
                onChange={(e) => setNewRender({ ...newRender, status: e.target.value })}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="queued">Queued</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newRender.progress}
                onChange={(e) => setNewRender({ ...newRender, progress: parseInt(e.target.value) || 0 })}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="text-white px-4 py-2 rounded-md font-medium transition-colors bg-black/40 border border-white/10 hover:bg-black/60"
              >
                Create Render
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

      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">All Renders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Render ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Project ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-black/20 divide-y divide-white/10">
              {renders.map((render) => (
                <tr key={render.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {render.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {render.projectId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${render.status === 'completed' ? 'border-green-500/30 text-green-400' : render.status === 'processing' ? 'border-blue-500/30 text-blue-400' : render.status === 'failed' ? 'border-red-500/30 text-red-400' : 'border-yellow-500/30 text-yellow-400'}`}>
                      {render.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center">
                      <div className="w-16 bg-white/10 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${render.progress}%` }}></div>
                      </div>
                      <span>{render.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(render.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(render.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {renders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-lg font-medium text-white mb-2">No renders yet</h3>
          <p className="text-gray-500 mb-4">Start your first render to see AI generation in action</p>
          <button onClick={() => setShowCreateForm(true)} className="px-6 py-3 rounded-lg font-medium transition-colors text-white bg-black/40 border border-white/10 hover:bg-black/60">
            Create Your First Render
          </button>
        </div>
      )}
    </div>
  );
}
