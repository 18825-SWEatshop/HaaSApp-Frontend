import { createFileRoute } from "@tanstack/react-router";
import { Test } from "~/start";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-2">
      <h3>Hello world!</h3>
    </div>
  );
}
