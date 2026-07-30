import { Navigate } from "react-router";

export function meta() {
  return [
    { title: "Yellow Jackets Coaching" },
    { name: "description", content: "Mobile-first sideline tools for the Yellow Jackets youth tackle football program." },
  ];
}

export default function Home() {
  return <Navigate to="/app" replace />;
}
