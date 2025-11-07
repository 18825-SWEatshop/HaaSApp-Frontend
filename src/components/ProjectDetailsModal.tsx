import React, { useState, useEffect } from "react";
import HardwareManagement from "./HardwareManagement";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ProjectDetailsModalProps {
  projectId: string;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ projectId, onClose }) => {
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
        const res = await fetch(`${baseUrl}/projects/details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.detail || "Failed to fetch project details");
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
  }, [projectId, token]);

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
      </>
    );
  } else {
    content = null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative flex flex-col gap-8 p-8 bg-white border border-black rounded w-[35rem] min-w-[20rem] max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          className="absolute right-4 top-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
          onClick={onClose}
        >
          Return to Projects
        </button>
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Project Details</h2>
        {content}
      </div>
    </div>
  );
};

export default ProjectDetailsModal;