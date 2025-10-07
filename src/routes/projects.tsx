import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

type HWSetName = 'HWSet1' | 'HWSet2';

function ProjectsPage() {
  // Project management state
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");

  // HWSet state (mocked for now, replace with DB integration later)
  const [hwSets, setHwSets] = useState([
    { name: "HWSet1", capacity: 100, available: 60 },
    { name: "HWSet2", capacity: 200, available: 150 },
  ]);
  // User input for check-in/out (single field per HWSet)
  const [hwInput, setHwInput] = useState<Record<HWSetName, number>>({ HWSet1: 0, HWSet2: 0 });

  function handleCreateProject() {
    alert(`Project '${projectName}' created!`);
    setProjectName("");
  }

  function handleLoginProject() {
    alert(`Logged into project with ID: ${projectId}`);
    setProjectId("");
  }

  // Handlers for checkout/check-in (mocked, no DB yet)
  function handleCheckout(hwset: HWSetName) {
    setHwSets((prev) =>
      prev.map((set) =>
        set.name === hwset
          ? {
              ...set,
              available: set.available - hwInput[hwset],
            }
          : set
      )
    );
    setHwInput((prev) => ({ ...prev, [hwset]: 0 }));
  }

  function handleCheckin(hwset: HWSetName) {
    setHwSets((prev) =>
      prev.map((set) =>
        set.name === hwset
          ? {
              ...set,
              available: set.available + hwInput[hwset],
            }
          : set
      )
    );
    setHwInput((prev) => ({ ...prev, [hwset]: 0 }));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-row gap-8">
        {/* Project Management Section */}
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
        {/* Resources Management Section */}
  <div className="flex flex-col gap-8 p-8 bg-white border border-black rounded w-[35rem] min-w-[20rem]">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Resources</h2>
          {/* HWSet Capacity & Availability */}
          <div className="flex flex-col gap-16">
            {hwSets.map((set) => {
              const hwset = set.name as HWSetName;
              return (
                <div key={set.name} className="flex flex-row items-center gap-4 justify-between">
                  {/* Capacity & Available, left-aligned and vertically aligned */}
                  <div className="flex flex-col gap-1 w-1/2 min-w-[10rem]">
                    <span className="font-semibold text-gray-900 w-24 block">{set.name}:</span>
                    <div className="flex flex-row gap-2 items-center mt-1">
                      <span className="text-gray-700 text-left w-20 block">Capacity:</span>
                      <span className="font-mono text-gray-900">{set.capacity}</span>
                    </div>
                    <div className="flex flex-row gap-2 items-center mt-1">
                      <span className="text-gray-700 text-left w-20 block">Available:</span>
                      <span className="font-mono text-gray-900">{set.available}</span>
                    </div>
                  </div>
                  {/* Single input for both actions, both buttons */}
                  <div className="flex flex-row gap-2 items-center min-w-[20rem]">
                    <input
                      type="number"
                      min={0}
                      max={set.capacity}
                      value={hwInput[hwset]}
                      onChange={e => setHwInput((prev) => ({ ...prev, [hwset]: Math.max(0, Math.min(set.capacity, Number(e.target.value))) }))}
                      className="border rounded w-20 px-2 py-1"
                    />
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded whitespace-nowrap"
                      onClick={() => handleCheckout(hwset)}
                      disabled={hwInput[hwset] <= 0 || hwInput[hwset] > set.available}
                    >
                      Checkout
                    </button>
                    <button
                      type="button"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded whitespace-nowrap"
                      onClick={() => handleCheckin(hwset)}
                      disabled={hwInput[hwset] <= 0 || hwInput[hwset] > (set.capacity - set.available)}
                    >
                      Check-in
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
