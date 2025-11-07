interface ProjectCardProps {
  readonly project: any;
  readonly onDetails?: (projectId: string) => void;
}

export function ProjectCard({ project, onDetails }: ProjectCardProps) {
  return (
  <div className="bg-white border border-gray-300 rounded-lg p-6 w-full flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="font-bold text-lg text-gray-900">{project.name}</div>
          <div className="text-gray-700 text-sm">ID: {project.projectId}</div>
          <div className="text-gray-700 text-sm">Description: {project.description}</div>
        </div>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          onClick={() => {
            if (onDetails) {
              onDetails(project.projectId);
              return;
            }
            window.location.href = `/projects/${project.projectId}`;
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}