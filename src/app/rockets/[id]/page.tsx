"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { GET_ROCKET } from "@/graphql/queries";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

interface RocketDetail {
  rocket: {
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
    engines: {
      number: number;
      type: string;
      version: string;
      propellant_1: string;
      propellant_2: string;
      thrust_to_weight: number;
    } | null;
    payload_weights: { id: string; name: string; kg: number }[];
    flickr_images: string[];
    wikipedia: string | null;
  } | null;
}

export default function RocketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error } = useQuery<RocketDetail>(GET_ROCKET, {
    variables: { id },
  });

  if (loading) return <LoadingSpinner message="Loading rocket details..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const rocket = data?.rocket;
  if (!rocket) return <ErrorMessage message="Rocket not found." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link href="/rockets" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        ← Back to Rockets
      </Link>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${
              rocket.active
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
            }`}
          >
            {rocket.active ? "Active" : "Retired"}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {rocket.country}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white">{rocket.name}</h1>
        <p className="mt-3 text-zinc-400 leading-relaxed">{rocket.description}</p>

        {rocket.wikipedia && (
          <a
            href={rocket.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-xs px-3 py-1.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors"
          >
            Wikipedia →
          </a>
        )}
      </div>

      {/* Key Stats */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
          Specifications
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="First Flight" value={rocket.first_flight} />
          <StatCard label="Success Rate" value={`${rocket.success_rate_pct}%`} />
          <StatCard
            label="Cost / Launch"
            value={`$${(rocket.cost_per_launch / 1_000_000).toFixed(0)}M`}
          />
          <StatCard label="Stages" value={String(rocket.stages)} />
          {rocket.boosters > 0 && (
            <StatCard label="Boosters" value={String(rocket.boosters)} />
          )}
          {rocket.height && (
            <StatCard label="Height" value={`${rocket.height.meters} m`} />
          )}
          {rocket.diameter && (
            <StatCard label="Diameter" value={`${rocket.diameter.meters} m`} />
          )}
          {rocket.mass && (
            <StatCard
              label="Mass"
              value={`${(rocket.mass.kg / 1000).toFixed(0)} t`}
            />
          )}
        </div>
      </section>

      {/* Engines */}
      {rocket.engines && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Engine Configuration
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <Detail label="Count" value={String(rocket.engines.number)} />
              <Detail label="Type" value={rocket.engines.type} />
              {rocket.engines.version && (
                <Detail label="Version" value={rocket.engines.version} />
              )}
              <Detail label="Propellant 1" value={rocket.engines.propellant_1} />
              <Detail label="Propellant 2" value={rocket.engines.propellant_2} />
              {rocket.engines.thrust_to_weight > 0 && (
                <Detail
                  label="Thrust-to-Weight"
                  value={String(rocket.engines.thrust_to_weight)}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Payload Weights */}
      {rocket.payload_weights?.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Payload Capacity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rocket.payload_weights.map((pw) => (
              <div
                key={pw.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between"
              >
                <span className="text-zinc-300 text-sm">{pw.name}</span>
                <span className="font-semibold text-white">
                  {pw.kg.toLocaleString()} kg
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {rocket.flickr_images?.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Gallery
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rocket.flickr_images.slice(0, 6).map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-video relative rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
              >
                <Image
                  src={url}
                  alt={`${rocket.name} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-zinc-200 mt-0.5">{value}</div>
    </div>
  );
}
