"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PAST_LAUNCHES } from "@/graphql/queries";
import { LaunchCard } from "@/components/LaunchCard";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

type Filter = "all" | "success" | "failed";

const PAGE_SIZE = 12;

interface Launch {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  launch_success: boolean | null;
  details: string | null;
  rocket: { rocket_name: string; rocket_type: string } | null;
  links: { mission_patch_small: string | null; video_link: string | null } | null;
  launch_site: { site_name_long: string } | null;
}

interface LaunchesData {
  launchesPast: Launch[];
}

export default function LaunchesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);

  const { data, loading, error } = useQuery<LaunchesData>(GET_PAST_LAUNCHES, {
    variables: { limit: PAGE_SIZE * 4, offset: 0 },
  });

  if (loading) return <LoadingSpinner message="Loading launches..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const allLaunches = data?.launchesPast ?? [];

  const query = search.trim().toLowerCase();

  const filtered = allLaunches.filter((l) => {
    // status filter
    if (filter === "success" && l.launch_success !== true) return false;
    if (filter === "failed" && l.launch_success !== false) return false;

    // search filter — mission name, rocket, site, details
    if (query) {
      const haystack = [
        l.mission_name,
        l.rocket?.rocket_name,
        l.rocket?.rocket_type,
        l.launch_site?.site_name_long,
        l.details,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    }

    return true;
  });

  const paginated = filtered.slice(offset, offset + PAGE_SIZE);
  const hasMore = offset + PAGE_SIZE < filtered.length;
  const hasPrev = offset > 0;

  const successCount = allLaunches.filter((l) => l.launch_success === true).length;
  const failedCount = allLaunches.filter((l) => l.launch_success === false).length;

  function handleFilterChange(f: Filter) {
    setFilter(f);
    setOffset(0);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setOffset(0);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Past Launches</h1>
        <p className="mt-1 text-zinc-400 text-sm">
          {allLaunches.length} launches total
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
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by mission, rocket, or launch site…"
          className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-colors"
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
        <div className="flex items-center gap-2">
          {(
            [
              { key: "all", label: `All (${allLaunches.length})` },
              { key: "success", label: `Success (${successCount})` },
              { key: "failed", label: `Failed (${failedCount})` },
            ] as { key: Filter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === key
                ? "bg-white text-black"
                : "text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Result count when searching */}
        {query && (
          <p className="text-sm text-zinc-500">
            <span className="text-white font-medium">{filtered.length}</span>{" "}
            result{filtered.length !== 1 ? "s" : ""} for{" "}
            <span className="text-zinc-300">&ldquo;{search.trim()}&rdquo;</span>
          </p>
        )}
      </div>

      {/* Launch list */}
      {paginated.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-400 font-medium">No launches found</p>
          <p className="text-zinc-600 text-sm mt-1">
            {query ? `No results for "${search.trim()}" — try a different term.` : "No launches match this filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!query && (hasPrev || hasMore) && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
            disabled={!hasPrev}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-zinc-500">
            {offset + 1}–{Math.min(offset + PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <button
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
            disabled={!hasMore}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
