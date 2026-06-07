"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { GET_LAUNCH_PAD } from "@/graphql/queries";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

interface LaunchPadDetail {
  launchPad: {
    id: string;
    name: string;
    full_name: string;
    locality: string;
    region: string;
    details: string;
    status: string;
    launch_attempts: number;
    launch_successes: number;
    wikipedia: string;
    images: string[];
  } | null;
}

export default function LaunchpadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error } = useQuery<LaunchPadDetail>(GET_LAUNCH_PAD, {
    variables: { id },
  });

  if (loading) return <LoadingSpinner message="Loading launchpad details..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const launchpad = data?.launchPad;
  if (!launchpad) return <ErrorMessage message="Launchpad not found." />;

  const successRate =
    launchpad.launch_attempts > 0
      ? Math.round((launchpad.launch_successes / launchpad.launch_attempts) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/launchpads"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        ← Back to Launchpads
      </Link>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <StatusBadge status={launchpad.status} />
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {launchpad.locality}, {launchpad.region}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white">{launchpad.name}</h1>
        <p className="mt-1 text-zinc-500 text-sm">{launchpad.full_name}</p>
        <p className="mt-3 text-zinc-400 leading-relaxed">{launchpad.details}</p>

        {launchpad.wikipedia && (
          <a
            href={launchpad.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-xs px-3 py-1.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors"
          >
            Wikipedia →
          </a>
        )}
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
          Launch Record
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Attempts" value={String(launchpad.launch_attempts)} />
          <StatCard label="Successes" value={String(launchpad.launch_successes)} />
          <StatCard label="Success Rate" value={`${successRate}%`} />
        </div>
      </section>

      {/* Gallery */}
      {launchpad.images.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Photos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {launchpad.images.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-video relative rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
              >
                <Image
                  src={url}
                  alt={`${launchpad.name} photo ${i + 1}`}
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    retired: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    "under construction": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
        styles[status] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="font-semibold text-white text-xl">{value}</div>
    </div>
  );
}
