import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import ProjectDetailsModal from "../components/ProjectDetailsModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const Route = createFileRoute("/projects")({
  component: Projects,
});
function Projects() {
  // ─────────────────────────────────────────────
  // API base & auth
  // ─────────────────────────────────────────────
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const navigate = Route.useNavigate();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // State for create/login form
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [loginProjectId, setLoginProjectId] = useState("");

  React.useEffect(() => {
    if (!token) {
      setUsername(null);
      navigate({ to: "/login" });
    }
  }, [token, navigate]);

  React.useEffect(() => {
    if (!token) {
      setUsername(null);
      return;
    }
    try {
      const [, payloadSegment] = token.split(".");
      if (!payloadSegment) {
        setUsername(null);
        return;
      }
  const base64 = payloadSegment.replaceAll("-", "+").replaceAll("_", "/");
      const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
      const decoded = JSON.parse(window.atob(padded));
      setUsername(typeof decoded?.u === "string" ? decoded.u : null);
    } catch {
      setUsername(null);
    }
  }, [token]);

  // Fetch projects user has joined/created
  const fetchProjects = React.useCallback(async () => {
    if (!token) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/projects/my-projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.detail || "Failed to fetch projects");
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const handleDetails = React.useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const handleLogout = React.useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("projectId");
    }
    setSelectedProjectId(null);
    setProjects([]);
    setError(null);
    setLoading(false);
    setToken(null);
    setUsername(null);
    navigate({ to: "/login" });
  }, [navigate]);

  // Handler for creating a project
  async function handleCreateProject() {
    try {
      if (!token) {
        alert("Please log in first.");
        return;
      }
      const body = {
        projectId: projectId.trim(),
        name: projectName.trim(),
        description: projectDescription.trim(),
      };
      const res = await fetch(`${baseUrl}/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || "Create failed");
      setProjectName("");
      setProjectId("");
      setProjectDescription("");
      await fetchProjects();
    } catch (err: any) {
      alert(err?.message ?? String(err));
    }
  }

  // Handler for logging into a project
  async function handleLoginProject() {
    try {
      if (!token) {
        alert("Please log in first.");
        return;
      }
      const res = await fetch(`${baseUrl}/projects/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId: loginProjectId.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || "Join failed");
      localStorage.setItem("projectId", data.projectId);
      setLoginProjectId("");
      await fetchProjects();
    } catch (err: any) {
      alert(err?.message ?? String(err));
    }
  }

  let projectListContent;
  if (loading) {
    projectListContent = <div className="text-gray-700 text-center">Loading projects...</div>;
  } else if (error) {
    projectListContent = <div className="text-red-600 text-center">{error}</div>;
  } else if (projects.length === 0) {
    projectListContent = <div className="text-gray-700 text-center">No projects found.</div>;
  } else {
    projectListContent = (
      <div className="flex flex-col gap-2">
        {projects.map((project: any) => (
          <ProjectCard
            key={project.projectId}
            project={project}
            onDetails={handleDetails}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 py-20">
      {username ? (
        <div className="w-full max-w-6xl px-8 pb-6 text-center text-gray-900 text-lg font-semibold">
          {`Username: ${username}`}
        </div>
      ) : null}
      <div className="flex flex-row gap-8">
        {/* Project List Section */}
        <div className="flex flex-col gap-6 p-8 bg-white border border-black rounded w-[35rem] min-w-[20rem] h-[32rem]">
          <h2 className="text-2xl font-bold text-center text-gray-900">Project List</h2>
          <div className="flex-1 overflow-y-auto pr-2">{projectListContent}</div>
        </div>
        
        {/* Project Management Section */}
        <div className="flex flex-col gap-6 p-8 bg-white border border-black rounded w-96">
          <h1 className="text-2xl font-bold text-center text-gray-900">Project Management</h1>

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
            {/* Unique project ID */}
            <input
              id="projectId"
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="border rounded w-full px-2 py-1"
              placeholder="Project ID (unique)"
            />
            {/* Description */}
            <input
              id="projectDescription"
              value={projectDescription}
              onChange={e => setProjectDescription(e.target.value)}
              className="border rounded w-full px-2 py-1"
              placeholder="Project Description"
            />
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded mt-2"
              onClick={handleCreateProject}
              disabled={
                !projectName.trim() ||
                !projectId.trim()
              }
            >
              Create Project
            </button>
          </div>

          {/* Login to Project */}
          <div className="flex flex-col gap-2">
            <label htmlFor="loginProjectId" className="font-semibold text-gray-900">Join an existing project</label>
            <input
              id="loginProjectId"
              value={loginProjectId}
              onChange={e => setLoginProjectId(e.target.value)}
              className="border rounded w-full px-2 py-1"
              placeholder="Project ID"
            />
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mt-2"
              onClick={handleLoginProject}
              disabled={!loginProjectId.trim()}
            >
              Join Project
            </button>
          </div>
        </div>
      </div>
      {selectedProjectId ? (
        <ProjectDetailsModal
          projectId={selectedProjectId}
          onClose={handleCloseModal}
        />
      ) : null}
      <div className="w-full max-w-6xl flex justify-center px-8 pt-6">
        <button
          type="button"
          className="bg-gray-900 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
