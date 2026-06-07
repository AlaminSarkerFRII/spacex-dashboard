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
  const [offset, setOffset] = useState(0);

  const { data, loading, error } = useQuery<LaunchesData>(GET_PAST_LAUNCHES, {
    variables: { limit: PAGE_SIZE * 4, offset: 0 },
  });

  if (loading) return <LoadingSpinner message="Loading launches..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const allLaunches = data?.launchesPast ?? [];

  const filtered = allLaunches.filter((l) => {
    if (filter === "success") return l.launch_success === true;
    if (filter === "failed") return l.launch_success === false;
    return true;
  });

  const paginated = filtered.slice(offset, offset + PAGE_SIZE);
  const hasMore = offset + PAGE_SIZE < filtered.length;
  const hasPrev = offset > 0;

  const successCount = allLaunches.filter((l) => l.launch_success === true).length;
  const failedCount = allLaunches.filter((l) => l.launch_success === false).length;

  const handleFilterChange = (f: Filter) => {
    setFilter(f);
    setOffset(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Past Launches</h1>
        <p className="mt-1 text-zinc-400 text-sm">
          {allLaunches.length} launches total
        </p>
      </div>

      {/* Filter Tabs */}
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

      {/* Launch List */}
      {paginated.length === 0 ? (
        <p className="text-zinc-500 py-12 text-center">No launches match this filter.</p>
      ) : (
        <div className="space-y-3">
          {paginated.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {(hasPrev || hasMore) && (
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
