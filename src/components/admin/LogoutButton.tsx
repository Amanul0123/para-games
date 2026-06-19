"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-md border border-border-gray px-4 py-2 text-sm font-medium text-text-dark hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
