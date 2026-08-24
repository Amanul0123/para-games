export default function LoginSubtitle({
  eventName,
  variant,
}: {
  eventName: string;
  variant: "admin" | "team";
}) {
  return (
    <p className="mt-1 text-center text-xs text-slate-500">
      {eventName} &mdash; {variant === "admin" ? "Admin Login" : "Team Login"}
    </p>
  );
}
