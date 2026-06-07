"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { GET_LAUNCH } from "@/graphql/queries";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

interface LaunchDetail {
  launch: {
    id: string;
    mission_name: string;
    launch_date_utc: string;
    launch_success: boolean | null;
    details: string | null;
    rocket: {
      rocket_name: string;
      rocket_type: string;
      second_stage: {
        payloads: {
          payload_id: string;
          payload_type: string;
          payload_mass_kg: number | null;
          orbit: string | null;
          nationality: string | null;
          manufacturer: string | null;
          customers: string[];
        }[];
      } | null;
    } | null;
    launch_site: { site_name_long: string } | null;
    links: {
      mission_patch: string | null;
      mission_patch_small: string | null;
      video_link: string | null;
      wikipedia: string | null;
      reddit_campaign: string | null;
      presskit: string | null;
      flickr_images: string[];
    } | null;
    ships: { name: string; type: string; home_port: string }[];
  } | null;
}

export default function LaunchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error } = useQuery<LaunchDetail>(GET_LAUNCH, {
    variables: { id },
  });

  if (loading) return <LoadingSpinner message="Loading launch details..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const launch = data?.launch;
  if (!launch) return <ErrorMessage message="Launch not found." />;

  const date = new Date(launch.launch_date_utc);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const youtubeId = launch.links?.video_link
    ? extractYoutubeId(launch.links.video_link)
    : null;

  const payloads = launch.rocket?.second_stage?.payloads ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back */}
      <Link href="/launches" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        ← Back to Launches
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {launch.links?.mission_patch && (
          <div className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 relative">
            <Image
              src={launch.links.mission_patch}
              alt={launch.mission_name}
              fill
              className="object-contain drop-shadow-lg"
              unoptimized
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge success={launch.launch_success} />
            {launch.rocket && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {launch.rocket.rocket_name}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{launch.mission_name}</h1>
          <div className="mt-2 space-y-1 text-sm text-zinc-400">
            <p>{formattedDate} at {formattedTime}</p>
            {launch.launch_site && <p>{launch.launch_site.site_name_long}</p>}
          </div>

          {/* External Links */}
          <div className="mt-4 flex flex-wrap gap-2">
            {launch.links?.video_link && (
              <a
                href={launch.links.video_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                YouTube →
              </a>
            )}
            {launch.links?.wikipedia && (
              <a
                href={launch.links.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors"
              >
                Wikipedia →
              </a>
            )}
            {launch.links?.reddit_campaign && (
              <a
                href={launch.links.reddit_campaign}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
              >
                Reddit →
              </a>
            )}
            {launch.links?.presskit && (
              <a
                href={launch.links.presskit}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors"
              >
                Press Kit →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mission Details */}
      {launch.details && (
        <section className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Mission Details
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed">{launch.details}</p>
        </section>
      )}

      {/* Video Embed */}
      {youtubeId && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Launch Video
          </h2>
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Launch Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </section>
      )}

      {/* Payloads */}
      {payloads.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Payloads
          </h2>
          <div className="space-y-3">
            {payloads.map((p) => (
              <div key={p.payload_id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-medium text-white">{p.payload_id}</div>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <Detail label="Type" value={p.payload_type} />
                  {p.orbit && <Detail label="Orbit" value={p.orbit} />}
                  {p.payload_mass_kg && (
                    <Detail label="Mass" value={`${p.payload_mass_kg.toLocaleString()} kg`} />
                  )}
                  {p.nationality && <Detail label="Nationality" value={p.nationality} />}
                  {p.manufacturer && <Detail label="Manufacturer" value={p.manufacturer} />}
                  {p.customers.length > 0 && (
                    <Detail label="Customer" value={p.customers.join(", ")} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ships */}
      {launch.ships?.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Recovery Ships
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {launch.ships.map((ship) => (
              <div key={ship.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-medium text-white">{ship.name}</div>
                <div className="text-xs text-zinc-500 mt-1">
                  {ship.type} · {ship.home_port}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Flickr Gallery */}
      {launch.links?.flickr_images && launch.links.flickr_images.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Photos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {launch.links.flickr_images.slice(0, 6).map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-video relative rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
              >
                <Image
                  src={url}
                  alt={`Launch photo ${i + 1}`}
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

function StatusBadge({ success }: { success: boolean | null }) {
  if (success === null) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        Upcoming
      </span>
    );
  }
  return success ? (
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
      Success
    </span>
  ) : (
    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
      Failed
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-zinc-200">{value}</div>
    </div>
  );
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\s]+)/);
  return match?.[1] ?? null;
}
