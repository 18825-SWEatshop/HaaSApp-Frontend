import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");

  function handleCreateProject() {
    alert(`Project '${projectName}' created!`);
    setProjectName("");
  }

  function handleLoginProject() {
    alert(`Logged into project with ID: ${projectId}`);
    setProjectId("");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-8 p-8 bg-white border border-black rounded w-96">
      <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Project Management</h1>
        {/* Create Project */}
        <div className="flex flex-col gap-2">
          <label htmlFor="projectName" className="font-semibold text-gray-900">Create a new project</label>
          <input
            id="projectName"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            className="border rounded w-full px-2 py-1"
            placeholder="Project Name"
          />
          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded mt-2"
            onClick={handleCreateProject}
            disabled={!projectName.trim()}
          >
            Create Project
          </button>
        </div>
        {/* Login to Project */}
        <div className="flex flex-col gap-2">
          <label htmlFor="projectId" className="font-semibold text-gray-900">Login to existing project</label>
          <input
            id="projectId"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="border rounded w-full px-2 py-1"
            placeholder="Project ID"
          />
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mt-2"
            onClick={handleLoginProject}
            disabled={!projectId.trim()}
          >
            Login to Project
          </button>
        </div>
      </div>
    </div>
  );
}
