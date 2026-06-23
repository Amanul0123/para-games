"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InjuryForm from "@/components/InjuryForm";
import IllnessForm from "@/components/IllnessForm";
import PhoneInput from "@/components/PhoneInput";
import { getNpcFlag } from "@/lib/npcFlags";
import { exportReportDetailToPdf } from "@/lib/exportReports";
import { InjuryEntry, IllnessEntry, Step1Data } from "@/types";

const STATUS_INFO: Record<string, { label: string; dot: string; description: string }> = {
  submitted: {
    label: "New",
    dot: "bg-green-500",
    description: "We've received your report. Our medical team will review it shortly.",
  },
  under_review: {
    label: "Under Review",
    dot: "bg-amber-500",
    description: "Our medical team is currently reviewing this report.",
  },
  resolved: {
    label: "Resolved",
    dot: "bg-slate-400",
    description: "This report has been reviewed and marked as resolved.",
  },
};

const NPC_OPTIONS = [
  "Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia",
  "China", "Chinese Taipei", "Hong Kong China", "India", "Indonesia", "Iran",
  "Iraq", "Japan", "Jordan", "Kazakhstan", "South Korea", "Kuwait",
  "Kyrgyzstan", "Laos", "Lebanon", "Macau China", "Malaysia", "Maldives",
  "Mongolia", "Myanmar", "Nepal", "Pakistan", "Palestine", "Philippines",
  "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syria", "Tajikistan",
  "Thailand", "Timor-Leste", "Turkmenistan", "UAE", "Uzbekistan", "Vietnam",
  "Yemen",
];

interface ReportApiResponse {
  npc: string;
  reportedBy: string;
  dateOfReport: string;
  email: string;
  phone: string;
  status: string;
  injuries: InjuryEntry[];
  illnesses: IllnessEntry[];
}

export default function ManageReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [accessEmail, setAccessEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [step1, setStep1] = useState<Step1Data | null>(null);
  const [status, setStatus] = useState<string>("submitted");
  const [injuries, setInjuries] = useState<InjuryEntry[]>([]);
  const [illnesses, setIllnesses] = useState<IllnessEntry[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("reportAccess");
    if (!raw) {
      router.replace("/form/manage");
      return;
    }

    const access = JSON.parse(raw) as { id: string; email: string };
    if (access.id !== params.id) {
      router.replace("/form/manage");
      return;
    }
    setAccessEmail(access.email);
  }, [params.id, router]);

  useEffect(() => {
    if (!accessEmail) return;

    const load = async () => {
      try {
        const res = await fetch(
          `/api/public/reports/${params.id}?email=${encodeURIComponent(accessEmail)}`,
        );
        if (!res.ok) throw new Error("Report not found");

        const data: ReportApiResponse = await res.json();
        setStep1({
          npc: data.npc,
          reportedBy: data.reportedBy,
          dateOfReport: data.dateOfReport.slice(0, 10),
          email: data.email,
          phone: data.phone,
        });
        setStatus(data.status);
        setInjuries(data.injuries.length > 0 ? data.injuries : []);
        setIllnesses(data.illnesses.length > 0 ? data.illnesses : []);
      } catch {
        router.replace("/form/manage");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [accessEmail, params.id, router]);

  const updateInjury = (index: number, value: InjuryEntry) => {
    setInjuries((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const updateIllness = (index: number, value: IllnessEntry) => {
    setIllnesses((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleSave = async () => {
    if (!step1 || !accessEmail) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/public/reports/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: accessEmail, step1, injuries, illnesses }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ? JSON.stringify(body.error) : "Failed to save changes");
      }

      sessionStorage.setItem(
        "reportAccess",
        JSON.stringify({ id: params.id, email: step1.email }),
      );
      setAccessEmail(step1.email);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !step1) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-sm text-slate-500">
        Loading your report...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <i className="ti ti-edit text-xl text-brand-cyan" aria-hidden="true" />
          <h3 className="font-semibold text-slate-800">Edit Your Report</h3>
        </div>
        <button
          type="button"
          onClick={() =>
            exportReportDetailToPdf({
              id: params.id,
              status,
              step1,
              injuries,
              illnesses,
            })
          }
          className="flex items-center gap-1.5 rounded-md border border-white/70 bg-white/60 px-3 py-1.5 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl hover:bg-white/90"
        >
          <i className="ti ti-file-type-pdf text-slate-500" aria-hidden="true" />
          Download PDF
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/60 px-5 py-3 text-sm shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <span className={`h-2 w-2 rounded-full ${STATUS_INFO[status]?.dot ?? "bg-slate-400"}`} />
        <span className="font-medium text-slate-800">
          {STATUS_INFO[status]?.label ?? status}
        </span>
        <span className="text-slate-500">
          &mdash; {STATUS_INFO[status]?.description}
        </span>
      </div>

      <section className="rounded-xl border border-white/70 bg-white/60 p-6 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-8">
        <h4 className="mb-4 flex items-center gap-1.5 font-semibold text-slate-800">
          <i className="ti ti-user text-slate-500" aria-hidden="true" />
          Reporter Information
        </h4>
        <div className="space-y-5">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-flag text-slate-500" aria-hidden="true" />
              NPC
            </label>
            <select
              value={step1.npc}
              onChange={(e) => setStep1({ ...step1, npc: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            >
              {NPC_OPTIONS.map((npc) => (
                <option key={npc} value={npc}>
                  {getNpcFlag(npc)} {npc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-id-badge-2 text-slate-500" aria-hidden="true" />
              Report by (name)
            </label>
            <input
              value={step1.reportedBy}
              onChange={(e) => setStep1({ ...step1, reportedBy: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-calendar-event text-slate-500" aria-hidden="true" />
              Date of report
            </label>
            <input
              type="date"
              value={step1.dateOfReport}
              onChange={(e) => setStep1({ ...step1, dateOfReport: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <i className="ti ti-mail text-slate-500" aria-hidden="true" />
              Email
            </label>
            <input
              type="email"
              value={step1.email}
              onChange={(e) => setStep1({ ...step1, email: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 shadow-inner focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            />
          </div>

          <PhoneInput
            value={step1.phone}
            onChange={(value) => setStep1({ ...step1, phone: value })}
          />
        </div>
      </section>

      <section className="rounded-xl border border-white/70 bg-white/60 p-6 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 font-semibold text-slate-800">
            <i className="ti ti-bandage text-brand-red" aria-hidden="true" />
            Injuries ({injuries.length})
          </h4>
          <button
            type="button"
            onClick={() =>
              setInjuries((prev) => [
                ...prev,
                {
                  accreditationNo: "",
                  sportEvent: "",
                  roundHeat: "",
                  injuryDate: "",
                  injuryTime: "",
                  bodyPart: "",
                  bodyPartCode: "",
                  injuryType: "",
                  injuryTypeCode: "",
                  causeOfInjury: "",
                  causeCode: "",
                  absenceDays: undefined,
                },
              ])
            }
            className="flex items-center gap-1 text-sm text-link-teal hover:underline"
          >
            <i className="ti ti-circle-plus" aria-hidden="true" />
            Add injury
          </button>
        </div>
        <div className="space-y-4">
          {injuries.map((injury, i) => (
            <InjuryForm
              key={i}
              index={i}
              value={injury}
              onChange={updateInjury}
              onRemove={() => setInjuries((prev) => prev.filter((_, idx) => idx !== i))}
            />
          ))}
          {injuries.length === 0 && (
            <p className="text-sm text-slate-500">No injuries recorded.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-white/70 bg-white/60 p-6 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 font-semibold text-slate-800">
            <i className="ti ti-virus text-amber-500" aria-hidden="true" />
            Illnesses ({illnesses.length})
          </h4>
          <button
            type="button"
            onClick={() =>
              setIllnesses((prev) => [
                ...prev,
                {
                  accreditationNo: "",
                  sportEvent: "",
                  occurredOn: "",
                  diagnosis: "",
                  affectedSystem: "",
                  systemCode: "",
                  mainSymptoms: "",
                  symptomCodes: "",
                  causeOfIllness: "",
                  causeCode: "",
                  absenceDays: undefined,
                },
              ])
            }
            className="flex items-center gap-1 text-sm text-link-teal hover:underline"
          >
            <i className="ti ti-circle-plus" aria-hidden="true" />
            Add illness
          </button>
        </div>
        <div className="space-y-4">
          {illnesses.map((illness, i) => (
            <IllnessForm
              key={i}
              index={i}
              value={illness}
              onChange={updateIllness}
              onRemove={() => setIllnesses((prev) => prev.filter((_, idx) => idx !== i))}
            />
          ))}
          {illnesses.length === 0 && (
            <p className="text-sm text-slate-500">No illnesses recorded.</p>
          )}
        </div>
      </section>

      {error && (
        <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <i className="ti ti-alert-circle mt-0.5 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {saved && (
        <p className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600">
          <i className="ti ti-circle-check mt-0.5 flex-shrink-0" aria-hidden="true" />
          Your changes have been saved.
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-cyan to-cyan-400 px-6 py-2.5 font-medium text-white shadow-[0_8px_20px_-4px_rgba(0,188,212,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
          {!saving && <i className="ti ti-device-floppy" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
