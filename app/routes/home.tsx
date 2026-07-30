import { redirect } from "react-router";

export function loader() {
  throw redirect("/app");
}

export function meta() {
  return [
    { title: "Yellow Jackets Coaching" },
    { name: "description", content: "Mobile-first sideline tools for the Yellow Jackets youth tackle football program." },
  ];
}

export default function Home() {
  return null;
}
