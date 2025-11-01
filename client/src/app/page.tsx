import { redirect } from "next/navigation";
import { getAuthToken } from "@/actions/auth";

export default async function Home() {
  const token = await getAuthToken();

  if (token) {
    redirect("/habits");
  } else {
    redirect("/signin");
  }
}
