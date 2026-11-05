"use client";

import { useRouter } from "next/navigation";
import { ui } from "@/lib/ui";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="{ui.secondary} border-r-3 border-b-4 border rounded-lg border-red-500 px-2 py-1 text-red hover:bg-red-400 focus:ring-red-500"
    >
      Logout
    </button>
  );
}
