"use client";

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
  const { data, loading, error } = useQuery<RocketsData>(GET_ROCKETS);

  if (loading) return <LoadingSpinner message="Loading rockets..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const rockets = data?.rockets ?? [];
  const activeCount = rockets.filter((r) => r.active).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rockets</h1>
        <p className="mt-1 text-zinc-400 text-sm">
          {rockets.length} rockets · {activeCount} active
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rockets.map((rocket) => (
          <RocketCard key={rocket.id} rocket={rocket} />
        ))}
      </div>
    </div>
  );
}
