import Link from "next/link";

interface Ship {
  id: string;
  name: string;
  type: string;
  roles: string[];
  home_port: string;
  status: string;
  active: boolean;
  year_built: number | null;
  launches?: string[];
  image: string | null;
}

export function ShipCard({ ship }: { ship: Ship }) {
  return (
    <Link
      href={`/ships/${ship.id}`}
      className="group flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
    >
      {/* Icon / avatar */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl">
        {typeIcon(ship.type)}
      </div>

      <div className="flex-1 min-w-0">
        {/* Name + status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white group-hover:text-zinc-200 leading-snug">
            {ship.name}
          </h3>
          <StatusBadge active={ship.active} status={ship.status} />
        </div>

        {/* Type + port */}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500">
          <span>{ship.type}</span>
          <span>{ship.home_port}</span>
          {ship.year_built && <span>Built {ship.year_built}</span>}
        </div>

        {/* Roles */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ship.roles.map((role) => (
            <span
              key={role}
              className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
            >
              {role}
            </span>
          ))}
        </div>

        {/* Launch count */}
        <p className="mt-2 text-xs text-zinc-500">
          {ship.launches?.length ?? 0} mission{(ship.launches?.length ?? 0) !== 1 ? "s" : ""} supported
        </p>
      </div>
    </Link>
  );
}

function StatusBadge({ active, status }: { active: boolean; status: string }) {
  if (active) {
    return (
      <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 capitalize">
        {status}
      </span>
    );
  }
  return (
    <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 capitalize">
      {status}
    </span>
  );
}

function typeIcon(type: string): string {
  if (type === "Drone Ship") return "🛳️";
  if (type === "Recovery Ship") return "⛵";
  if (type === "Fairing Recovery") return "🪝";
  return "🚢";
}
