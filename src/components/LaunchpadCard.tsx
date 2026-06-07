import Link from "next/link";

interface LaunchPad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  status: string;
  launch_attempts: number;
  launch_successes: number;
  images: string[];
}

export function LaunchpadCard({ launchpad }: { launchpad: LaunchPad }) {
  const successRate =
    launchpad.launch_attempts > 0
      ? Math.round((launchpad.launch_successes / launchpad.launch_attempts) * 100)
      : 0;

  return (
    <Link
      href={`/launchpads/${launchpad.id}`}
      className="group flex flex-col p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-lg group-hover:text-zinc-200">
          {launchpad.name}
        </h3>
        <StatusBadge status={launchpad.status} />
      </div>

      <p className="mt-1 text-sm text-zinc-500">
        {launchpad.locality}, {launchpad.region}
      </p>

      <p className="mt-2 text-sm text-zinc-400 line-clamp-2 flex-1">
        {launchpad.full_name}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Attempts" value={String(launchpad.launch_attempts)} />
        <Stat label="Successes" value={String(launchpad.launch_successes)} />
        <Stat label="Success Rate" value={`${successRate}%`} />
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    retired: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    "under construction": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };

  return (
    <span
      className={`flex shrink-0 text-xs px-2 py-0.5 rounded-full border capitalize ${
        styles[status] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
      }`}
    >
      {status}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/30 rounded-lg p-2">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-sm font-medium text-zinc-200 mt-0.5">{value}</div>
    </div>
  );
}
