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
        const hardwareAllocations = Array.isArray(data?.hardwareAllocations)
          ? data.hardwareAllocations
          : [];
        const members = Array.isArray(data?.members) ? data.members : [];
        setProject({
          ...data,
          projectId: data.projectID || data.projectId,
          hardwareAllocations,
          members,
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
    content = <div className="text-black text-center">Loading project details...</div>;
  } else if (error) {
    content = <div className="text-red-600 text-center">{error}</div>;
  } else if (project) {
    content = (
      <>
        <div className="flex flex-col gap-2 text-black">
          <div className="font-bold text-lg">{project.name}</div>
          <div className="text-sm">ID: {project.projectId}</div>
          <div className="text-sm">Description: {project.description}</div>
          <div className="text-sm">
            Members: {Array.isArray(project.members) && project.members.length > 0 ? project.members.join(", ") : "None"}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-black mb-2">Hardware Management</h3>
          <HardwareManagement
            setNumber={1}
            projectId={project.projectId}
            initialAllocation={project.hardwareAllocations?.[0] ?? 0}
          />
          <HardwareManagement
            setNumber={2}
            projectId={project.projectId}
            initialAllocation={project.hardwareAllocations?.[1] ?? 0}
          />
        </div>
      </>
    );
  } else {
    content = null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  <div className="relative flex flex-col gap-6 p-8 bg-white border border-black rounded w-[42rem] min-w-[28rem] max-w-[48rem] max-h-[90vh] overflow-y-auto text-black">
        <h2 className="text-2xl font-bold text-center">Project Details</h2>
        {content}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            className="px-4 py-2 border border-blue-600 rounded bg-white text-sm font-semibold text-blue-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Return to Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;