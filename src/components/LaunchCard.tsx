import Link from "next/link";
import Image from "next/image";

interface Launch {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  launch_success: boolean | null;
  details: string | null;
  rocket: { rocket_name: string; rocket_type?: string } | null;
  links: { mission_patch_small: string | null; video_link: string | null } | null;
  launch_site: { site_name_long: string } | null;
}

export function LaunchCard({ launch }: { launch: Launch }) {
  const date = new Date(launch.launch_date_utc);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/launches/${launch.id}`}
      className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
    >
      <div className="shrink-0 w-16 h-16 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden">
        {launch.links?.mission_patch_small ? (
          <Image
            src={launch.links.mission_patch_small}
            alt={launch.mission_name}
            width={56}
            height={56}
            className="object-contain p-1"
            unoptimized
          />
        ) : (
          <span className="text-2xl">🚀</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white group-hover:text-zinc-200 truncate">
            {launch.mission_name}
          </h3>
          <StatusBadge success={launch.launch_success} />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span>{formattedDate}</span>
          {launch.rocket && <span>{launch.rocket.rocket_name}</span>}
          {launch.launch_site && (
            <span className="truncate max-w-50">{launch.launch_site.site_name_long}</span>
          )}
        </div>

        {launch.details && (
          <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{launch.details}</p>
        )}
      </div>
    </Link>
  );
}

function StatusBadge({ success }: { success: boolean | null }) {
  if (success === null) {
    return (
      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        Upcoming
      </span>
    );
  }
  if (success) {
    return (
      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
        Success
      </span>
    );
  }
  return (
    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
      Failed
    </span>
  );
}
