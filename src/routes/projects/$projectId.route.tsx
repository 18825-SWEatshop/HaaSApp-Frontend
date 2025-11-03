import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import HardwareManagement from "../../components/HardwareManagement";

function ProjectDetails() {
  const { projectId } = Route.useParams() as { projectId?: string };
  const navigate = Route.useNavigate();
  const API = (import.meta as any).env?.VITE_API_URL ?? "http://127.0.0.1:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectDetails() {
      if (!token) {
        setError("Please log in first.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API}/projects/details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectId: projectId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.detail || "Failed to fetch project details");
        // Map projectID to projectId for frontend consistency
        setProject({
          ...data,
          projectId: data.projectID || data.projectId,
        });
      } catch (err: any) {
        setError(err?.message ?? String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProjectDetails();
  }, [projectId, token, API]);

  let content;
  if (loading) {
    content = <div className="text-gray-700 text-center">Loading project details...</div>;
  } else if (error) {
    content = <div className="text-red-600 text-center">{error}</div>;
  } else if (project) {
    content = (
      <>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-lg text-gray-900">{project.name}</div>
          <div className="text-gray-700 text-sm">ID: {project.projectId}</div>
          <div className="text-gray-700 text-sm">Description: {project.description}</div>
          <div className="text-gray-700 text-sm">Owner: {project.owner}</div>
          <div className="text-gray-700 text-sm">Authorized Users: {project.authorizedUsers?.join(", ")}</div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Hardware Management</h3>
          <HardwareManagement label="HWSet1" projectId={project.projectId} />
          <HardwareManagement label="HWSet2" projectId={project.projectId} />
        </div>
        <button
          type="button"
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded mt-6"
          onClick={() => navigate({ to: "/projects" })}
        >
          Return to Projects
        </button>
      </>
    );
  } else {
    content = null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-8 p-8 bg-white border border-black rounded w-[35rem] min-w-[20rem]">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Project Details</h2>
        {content}
      </div>
    </div>
  );

}

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetails,
});