import { companyData, rocketsData, launchesData, upcomingLaunchesData, launchPadsData, shipsData } from "./data";

export const resolvers = {
  Query: {
    company: () => companyData,

    rockets: () => rocketsData,

    rocket: (_: unknown, { id }: { id: string }) =>
      rocketsData.find((r) => r.id === id) ?? null,

    launchesPast: (
      _: unknown,
      { limit = 20, offset = 0 }: { limit?: number; offset?: number }
    ) => launchesData.slice(offset, offset + limit),

    launchesUpcoming: (_: unknown, { limit = 5 }: { limit?: number }) =>
      upcomingLaunchesData.slice(0, limit),

    launch: (_: unknown, { id }: { id: string }) => {
      const past = launchesData.find((l) => l.id === id);
      const upcoming = upcomingLaunchesData.find((l) => l.id === id);
      return past ?? upcoming ?? null;
    },

    launchPads: () => launchPadsData,

    launchPad: (_: unknown, { id }: { id: string }) =>
      launchPadsData.find((lp) => lp.id === id) ?? null,

    ships: () => shipsData,

    ship: (_: unknown, { id }: { id: string }) =>
      shipsData.find((s) => s.id === id) ?? null,
  },
};
