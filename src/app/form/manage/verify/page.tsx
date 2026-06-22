"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("This link is missing its access token.");
      return;
    }

    fetch(`/api/public/reports/verify-link?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ id: string; email: string }>;
      })
      .then((data) => {
        sessionStorage.setItem("reportAccess", JSON.stringify({ id: data.id, email: data.email }));
        router.replace(`/form/manage/${data.id}`);
      })
      .catch(() => setError("This link is invalid or has expired."));
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
        <i className="ti ti-link-off text-3xl text-red-400" aria-hidden="true" />
        <p className="text-sm text-red-600">{error}</p>
        <a href="/form/manage" className="text-sm text-link-teal hover:underline">
          Look up your report manually instead
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center py-16 text-sm text-slate-500">
      Verifying your link...
    </div>
  );
}

export default function VerifyMagicLinkPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
