"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!reportId) return;
    await navigator.clipboard.writeText(reportId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/70 bg-white/60 px-10 py-10 text-center shadow-[0_20px_60px_-10px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-progress-green to-emerald-400 shadow-[0_10px_25px_-5px_rgba(76,175,80,0.5)]">
          <i className="ti ti-circle-check text-3xl text-white" aria-hidden="true" />
        </div>
        <p className="text-lg font-medium text-slate-800">
          Thanks for contacting us!
        </p>
        <p className="max-w-sm text-sm text-slate-500">
          Your report has been received. Our medical team will review it and
          be in touch with you shortly.
        </p>

        {reportId && (
          <div className="w-full max-w-sm rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-left">
            <p className="text-xs text-link-teal">
              Save this Report ID to view or edit your submission later.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-white/80 px-2.5 py-1.5 text-xs text-slate-700">
                {reportId}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md bg-link-teal px-2.5 py-1.5 text-xs text-white hover:opacity-90"
              >
                <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} aria-hidden="true" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <Link
          href="/form/manage"
          className="mt-1 flex items-center gap-1.5 text-sm text-link-teal hover:underline"
        >
          <i className="ti ti-edit" aria-hidden="true" />
          View or edit a submitted report
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
