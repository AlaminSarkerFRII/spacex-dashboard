"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_SHIPS } from "@/graphql/queries";
import { ShipCard } from "@/components/ShipCard";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

type Filter = "all" | "Drone Ship" | "Recovery Ship" | "Fairing Recovery";

interface Ship {
  id: string;
  name: string;
  type: string;
  roles: string[];
  home_port: string;
  status: string;
  active: boolean;
  year_built: number | null;
  launches: string[];
  image: string | null;
}

interface ShipsData {
  ships: Ship[];
}

export default function ShipsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const { data, loading, error } = useQuery<ShipsData>(GET_SHIPS);

  if (loading) return <LoadingSpinner message="Loading ships..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const ships = data?.ships ?? [];
  const activeCount = ships.filter((s) => s.active).length;

  const filtered =
    filter === "all" ? ships : ships.filter((s) => s.type === filter);

  const filterOptions: { key: Filter; label: string }[] = [
    { key: "all", label: `All (${ships.length})` },
    {
      key: "Drone Ship",
      label: `Drone Ships (${ships.filter((s) => s.type === "Drone Ship").length})`,
    },
    {
      key: "Recovery Ship",
      label: `Recovery (${ships.filter((s) => s.type === "Recovery Ship").length})`,
    },
    {
      key: "Fairing Recovery",
      label: `Fairing (${ships.filter((s) => s.type === "Fairing Recovery").length})`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Fleet</h1>
        <p className="mt-1 text-zinc-400 text-sm">
          {ships.length} vessels · {activeCount} active
        </p>
      </div>

      {/* Fleet stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Drone Ships"
          value={String(ships.filter((s) => s.type === "Drone Ship").length)}
          sub="Booster landing platforms"
        />
        <StatCard
          label="Recovery Ships"
          value={String(ships.filter((s) => s.type === "Recovery Ship").length)}
          sub="Dragon capsule recovery"
        />
        <StatCard
          label="Fairing Recovery"
          value={String(ships.filter((s) => s.type === "Fairing Recovery").length)}
          sub="Nose cone retrieval"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key
                ? "bg-white text-black"
                : "text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Ship list */}
      {filtered.length === 0 ? (
        <p className="text-zinc-500 py-12 text-center">No ships match this filter.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((ship) => (
            <ShipCard key={ship.id} ship={ship} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-zinc-600 mt-1">{sub}</div>
    </div>
  );
}
