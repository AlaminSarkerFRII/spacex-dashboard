import { resolvers } from "@/graphql/resolvers";
import {
  companyData,
  rocketsData,
  launchesData,
  launchPadsData,
  shipsData,
} from "@/graphql/data";

const Q = resolvers.Query;

// ─── Company ────────────────────────────────────────────────
describe("company resolver", () => {
  it("returns company data", () => {
    expect(Q.company()).toBe(companyData);
  });

  it("has required fields", () => {
    const c = Q.company();
    expect(c.name).toBeTruthy();
    expect(c.ceo).toBeTruthy();
    expect(typeof c.employees).toBe("number");
    expect(typeof c.founded).toBe("number");
  });
});

// ─── Rockets ─────────────────────────────────────────────────
describe("rockets resolver", () => {
  it("returns all rockets", () => {
    expect(Q.rockets()).toEqual(rocketsData);
  });

  it("finds a rocket by id", () => {
    const rocket = Q.rocket({}, { id: "falcon9" });
    expect(rocket?.name).toBe("Falcon 9");
  });

  it("returns null for unknown rocket id", () => {
    const rocket = Q.rocket({}, { id: "nonexistent" });
    expect(rocket).toBeNull();
  });
});

// ─── Launches ────────────────────────────────────────────────
describe("launchesPast resolver", () => {
  it("returns launches up to the default limit", () => {
    const result = Q.launchesPast({}, {});
    expect(result.length).toBeLessThanOrEqual(20);
  });

  it("respects the limit argument", () => {
    const result = Q.launchesPast({}, { limit: 5 });
    expect(result).toHaveLength(5);
  });

  it("respects the offset argument", () => {
    const first = Q.launchesPast({}, { limit: 1, offset: 0 });
    const second = Q.launchesPast({}, { limit: 1, offset: 1 });
    expect(first[0].id).not.toBe(second[0].id);
  });

  it("finds a launch by id", () => {
    const id = launchesData[0].id;
    const launch = Q.launch({}, { id });
    expect(launch?.id).toBe(id);
  });

  it("returns null for unknown launch id", () => {
    const launch = Q.launch({}, { id: "does-not-exist" });
    expect(launch).toBeNull();
  });
});

// ─── LaunchPads ──────────────────────────────────────────────
describe("launchPads resolver", () => {
  it("returns all launchpads", () => {
    expect(Q.launchPads()).toEqual(launchPadsData);
  });

  it("finds a launchpad by id", () => {
    const pad = Q.launchPad({}, { id: "ksc-lc-39a" });
    expect(pad?.name).toBe("KSC LC 39A");
  });

  it("returns null for unknown launchpad id", () => {
    const pad = Q.launchPad({}, { id: "unknown-pad" });
    expect(pad).toBeNull();
  });
});

// ─── Ships ───────────────────────────────────────────────────
describe("ships resolver", () => {
  it("returns all ships", () => {
    expect(Q.ships()).toEqual(shipsData);
  });

  it("finds a ship by id", () => {
    const ship = Q.ship({}, { id: "ocisly" });
    expect(ship?.name).toBe("Of Course I Still Love You");
  });

  it("returns null for unknown ship id", () => {
    const ship = Q.ship({}, { id: "ghost-ship" });
    expect(ship).toBeNull();
  });
});
