import { redirect } from "next/navigation";

export default function Home() {
  // Instantly redirects the user from the root URL to the dashboard
  redirect("/dashboard");
}