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
  const [search, setSearch] = useState("");

  const { data, loading, error } = useQuery<ShipsData>(GET_SHIPS);

  if (loading) return <LoadingSpinner message="Loading ships..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const ships = data?.ships ?? [];
  const activeCount = ships.filter((s) => s.active).length;

  const query = search.trim().toLowerCase();

  const filtered = ships.filter((s) => {
    // type filter
    if (filter !== "all" && s.type !== filter) return false;

    // search filter — name, type, roles, home port
    if (query) {
      const haystack = [s.name, s.type, s.home_port, ...s.roles]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    }

    return true;
  });

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

  function handleFilterChange(f: Filter) {
    setFilter(f);
  }

  function handleSearch(value: string) {
    setSearch(value);
  }

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

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, type, or home port…"
          className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/25 transition-colors"
        />
        {search && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter tabs + result count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
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

        {query && (
          <p className="text-sm text-zinc-500">
            <span className="text-white font-medium">{filtered.length}</span>{" "}
            result{filtered.length !== 1 ? "s" : ""} for{" "}
            <span className="text-zinc-300">&ldquo;{search.trim()}&rdquo;</span>
          </p>
        )}
      </div>

      {/* Ship list */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-400 font-medium">No ships found</p>
          <p className="text-zinc-600 text-sm mt-1">
            {query
              ? `No results for "${search.trim()}" — try a different term.`
              : "No ships match this filter."}
          </p>
        </div>
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
