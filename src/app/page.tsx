import { redirect } from "next/navigation";

/** Landing experience is the Sentinel dashboard. */
export default function HomePage() {
  redirect("/dashboard");
}
