"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { GET_SHIP } from "@/graphql/queries";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

interface ShipDetail {
  ship: {
    id: string;
    name: string;
    type: string;
    roles: string[];
    home_port: string;
    status: string;
    active: boolean;
    imo: number | null;
    mmsi: number | null;
    year_built: number | null;
    image: string | null;
    url: string | null;
    launches: string[];
  } | null;
}

export default function ShipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error } = useQuery<ShipDetail>(GET_SHIP, {
    variables: { id },
  });

  if (loading) return <LoadingSpinner message="Loading ship details..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const ship = data?.ship;
  if (!ship) return <ErrorMessage message="Ship not found." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/ships"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        ← Back to Fleet
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Ship image */}
        <div className="flex-shrink-0 w-full sm:w-48 h-36 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
          {ship.image ? (
            <Image
              src={ship.image}
              alt={ship.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl">
              {typeIcon(ship.type)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge active={ship.active} status={ship.status} />
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
              {ship.type}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight">{ship.name}</h1>
          <p className="mt-1 text-zinc-400 text-sm">{ship.home_port}</p>

          {/* Roles */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ship.roles.map((role) => (
              <span
                key={role}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                {role}
              </span>
            ))}
          </div>

          {/* External link */}
          {ship.url && (
            <a
              href={ship.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-xs px-3 py-1.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors"
            >
              MarineTraffic →
            </a>
          )}
        </div>
      </div>

      {/* Vessel info */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
          Vessel Information
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ship.year_built && (
            <StatCard label="Year Built" value={String(ship.year_built)} />
          )}
          {ship.imo ? (
            <StatCard label="IMO Number" value={String(ship.imo)} />
          ) : null}
          {ship.mmsi ? (
            <StatCard label="MMSI" value={String(ship.mmsi)} />
          ) : null}
          <StatCard label="Missions" value={String(ship.launches.length)} />
        </div>
      </section>

      {/* Missions supported */}
      {ship.launches.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Missions Supported
          </h2>
          <div className="flex flex-wrap gap-2">
            {ship.launches.map((mission) => (
              <span
                key={mission}
                className="text-sm px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300"
              >
                {mission}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatusBadge({ active, status }: { active: boolean; status: string }) {
  return active ? (
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 capitalize">
      {status}
    </span>
  ) : (
    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 capitalize">
      {status}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="font-semibold text-white text-lg">{value}</div>
    </div>
  );
}

function typeIcon(type: string): string {
  if (type === "Drone Ship") return "🛳️";
  if (type === "Recovery Ship") return "⛵";
  if (type === "Fairing Recovery") return "🪝";
  return "🚢";
}
