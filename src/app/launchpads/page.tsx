"use client";

import { useQuery } from "@apollo/client/react";
import { GET_LAUNCH_PADS } from "@/graphql/queries";
import { LaunchpadCard } from "@/components/LaunchpadCard";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

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

interface LaunchPadsData {
  launchPads: LaunchPad[];
}

export default function LaunchpadsPage() {
  const { data, loading, error } = useQuery<LaunchPadsData>(GET_LAUNCH_PADS);

  if (loading) return <LoadingSpinner message="Loading launchpads..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const launchpads = data?.launchPads ?? [];
  const activeCount = launchpads.filter((lp) => lp.status === "active").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Launchpads</h1>
        <p className="mt-1 text-zinc-400 text-sm">
          {launchpads.length} sites · {activeCount} active
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {launchpads.map((launchpad) => (
          <LaunchpadCard key={launchpad.id} launchpad={launchpad} />
        ))}
      </div>
    </div>
  );
}
