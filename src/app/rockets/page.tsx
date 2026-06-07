"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ROCKETS } from "@/graphql/queries";
import { RocketCard } from "@/components/RocketCard";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

interface Rocket {
  id: string;
  name: string;
  description: string;
  active: boolean;
  first_flight: string;
  country: string;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  mass: { kg: number } | null;
  height: { meters: number } | null;
  diameter: { meters: number } | null;
  engines: { number: number; type: string; version: string } | null;
  payload_weights: { id: string; name: string; kg: number }[];
}

interface RocketsData {
  rockets: Rocket[];
}

export default function RocketsPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery<RocketsData>(GET_ROCKETS);

  if (loading) return <LoadingSpinner message="Loading rockets..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const rockets = data?.rockets ?? [];
  const activeCount = rockets.filter((r) => r.active).length;

  const query = search.trim().toLowerCase();

  const filtered = query
    ? rockets.filter((r) => {
        const haystack = [
          r.name,
          r.description,
          r.country,
          r.engines?.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : rockets;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rockets</h1>
        <p className="mt-1 text-zinc-400 text-sm">
          {rockets.length} rockets · {activeCount} active
        </p>
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, country, or engine type…"
          className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/25 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Result count */}
      {query && (
        <p className="text-sm text-zinc-500">
          <span className="text-white font-medium">{filtered.length}</span>{" "}
          result{filtered.length !== 1 ? "s" : ""} for{" "}
          <span className="text-zinc-300">&ldquo;{search.trim()}&rdquo;</span>
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-400 font-medium">No rockets found</p>
          <p className="text-zinc-600 text-sm mt-1">
            No results for &ldquo;{search.trim()}&rdquo; — try a different term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((rocket) => (
            <RocketCard key={rocket.id} rocket={rocket} />
          ))}
        </div>
      )}
    </div>
  );
}
