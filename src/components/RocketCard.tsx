import Link from "next/link";

interface Rocket {
  id: string;
  name: string;
  description: string;
  active: boolean;
  first_flight: string;
  country: string;
  stages: number;
  cost_per_launch: number;
  success_rate_pct: number;
  mass: { kg: number } | null;
  height: { meters: number } | null;
  engines: { number: number; type: string; version: string } | null;
}

export function RocketCard({ rocket }: { rocket: Rocket }) {
  return (
    <Link
      href={`/rockets/${rocket.id}`}
      className="group flex flex-col p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-lg group-hover:text-zinc-200">
          {rocket.name}
        </h3>
        <span
          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${
            rocket.active
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
          }`}
        >
          {rocket.active ? "Active" : "Retired"}
        </span>
      </div>

      <p className="mt-2 text-sm text-zinc-400 line-clamp-3 flex-1">{rocket.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="First Flight" value={rocket.first_flight} />
        <Stat label="Success Rate" value={`${rocket.success_rate_pct}%`} />
        {rocket.height && (
          <Stat label="Height" value={`${rocket.height.meters}m`} />
        )}
        {rocket.mass && (
          <Stat label="Mass" value={`${(rocket.mass.kg / 1000).toFixed(0)}t`} />
        )}
        {rocket.engines && (
          <Stat label="Engines" value={`${rocket.engines.number}× ${rocket.engines.type}`} />
        )}
        <Stat label="Stages" value={String(rocket.stages)} />
      </div>
    </Link>
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
