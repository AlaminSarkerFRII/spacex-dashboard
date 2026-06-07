"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { GET_COMPANY, GET_UPCOMING_LAUNCHES } from "@/graphql/queries";
import { LoadingSpinner, ErrorMessage } from "@/components/LoadingSpinner";

interface CompanyInfo {
  company: {
    name: string;
    founder: string;
    founded: number;
    employees: number;
    ceo: string;
    cto: string;
    coo: string;
    summary: string;
    launch_sites: number;
    valuation: number;
  };
}

interface UpcomingLaunch {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  details: string | null;
  rocket: { rocket_name: string } | null;
  launch_site: { site_name_long: string } | null;
}

interface UpcomingLaunches {
  launchesUpcoming: UpcomingLaunch[];
}

export default function DashboardPage() {
  const { data: companyData, loading: companyLoading, error: companyError } = useQuery<CompanyInfo>(GET_COMPANY);
  const { data: upcomingData, loading: upcomingLoading } = useQuery<UpcomingLaunches>(GET_UPCOMING_LAUNCHES);

  if (companyLoading) return <LoadingSpinner message="Loading SpaceX data..." />;
  if (companyError) return <ErrorMessage message={companyError.message} />;

  const company = companyData?.company;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero */}
      <section>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 sm:p-12">
          <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-3">
            Mission Control
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
            {company?.name ?? "SpaceX"} <br />
            <span className="text-zinc-400 font-light">Dashboard</span>
          </h1>
          {company?.summary && (
            <p className="mt-4 max-w-2xl text-zinc-400 text-sm sm:text-base leading-relaxed">
              {company.summary}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/launches"
              className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              View Launches
            </Link>
            <Link
              href="/rockets"
              className="px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Explore Rockets
            </Link>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      {company && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Company Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label="Founded" value={String(company.founded)} />
            <StatCard label="Employees" value={company.employees.toLocaleString()} />
            <StatCard label="Launch Sites" value={String(company.launch_sites)} />
            <StatCard
              label="Valuation"
              value={`$${(company.valuation / 1_000_000_000).toFixed(0)}B`}
            />
            <StatCard label="Founder" value={company.founder} small />
          </div>
        </section>
      )}

      {/* Leadership */}
      {company && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <LeaderCard role="CEO" name={company.ceo} />
            <LeaderCard role="CTO" name={company.cto} />
            {company.coo && <LeaderCard role="COO" name={company.coo} />}
          </div>
        </section>
      )}

      {/* Upcoming Launches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Upcoming Launches</h2>
          <Link href="/launches" className="text-sm text-zinc-400 hover:text-white transition-colors">
            All launches →
          </Link>
        </div>

        {upcomingLoading ? (
          <LoadingSpinner message="Loading upcoming launches..." />
        ) : upcomingData?.launchesUpcoming.length === 0 ? (
          <p className="text-zinc-500 text-sm">No upcoming launches scheduled.</p>
        ) : (
          <div className="space-y-3">
            {upcomingData?.launchesUpcoming.map((launch) => (
              <Link
                key={launch.id}
                href={`/launches/${launch.id}`}
                className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      Upcoming
                    </span>
                    <h3 className="font-medium text-white group-hover:text-zinc-200 truncate">
                      {launch.mission_name}
                    </h3>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-zinc-500">
                    <span>
                      {new Date(launch.launch_date_utc).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {launch.rocket && <span>{launch.rocket.rocket_name}</span>}
                    {launch.launch_site && <span>{launch.launch_site.site_name_long}</span>}
                  </div>
                  {launch.details && (
                    <p className="mt-1.5 text-xs text-zinc-400 line-clamp-1">{launch.details}</p>
                  )}
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 mt-1">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className={`font-semibold text-white ${small ? "text-base" : "text-xl"}`}>{value}</div>
    </div>
  );
}

function LeaderCard({ role, name }: { role: string; name: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
        {name.charAt(0)}
      </div>
      <div>
        <div className="text-xs text-zinc-500">{role}</div>
        <div className="text-sm font-medium text-white">{name}</div>
      </div>
    </div>
  );
}
