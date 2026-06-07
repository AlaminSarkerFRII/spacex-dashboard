import {
  companyData,
  rocketsData,
  launchesData,
  upcomingLaunchesData,
  launchPadsData,
  shipsData,
} from "@/graphql/data";

// ─── Company ─────────────────────────────────────────────────
describe("companyData", () => {
  it("has all required fields", () => {
    expect(companyData.name).toBeTruthy();
    expect(companyData.founder).toBeTruthy();
    expect(companyData.ceo).toBeTruthy();
    expect(companyData.coo).toBeTruthy();
    expect(companyData.employees).toBeGreaterThan(0);
    expect(companyData.founded).toBeGreaterThan(2000);
    expect(companyData.valuation).toBeGreaterThan(0);
  });
});

// ─── Rockets ─────────────────────────────────────────────────
describe("rocketsData", () => {
  it("has at least one rocket", () => {
    expect(rocketsData.length).toBeGreaterThan(0);
  });

  it("every rocket has required fields", () => {
    for (const rocket of rocketsData) {
      expect(rocket.id).toBeTruthy();
      expect(rocket.name).toBeTruthy();
      expect(rocket.description).toBeTruthy();
      expect(typeof rocket.active).toBe("boolean");
      expect(rocket.stages).toBeGreaterThan(0);
    }
  });

  it("contains Falcon 9 and Starship", () => {
    const names = rocketsData.map((r) => r.name);
    expect(names).toContain("Falcon 9");
    expect(names).toContain("Starship");
  });
});

// ─── Past Launches ────────────────────────────────────────────
describe("launchesData", () => {
  it("has multiple launches", () => {
    expect(launchesData.length).toBeGreaterThan(5);
  });

  it("every launch has an id, mission name and date", () => {
    for (const launch of launchesData) {
      expect(launch.id).toBeTruthy();
      expect(launch.mission_name).toBeTruthy();
      expect(launch.launch_date_utc).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it("launch_success is boolean or null (never undefined)", () => {
    for (const launch of launchesData) {
      expect([true, false, null]).toContain(launch.launch_success);
    }
  });
});

// ─── Upcoming Launches ────────────────────────────────────────
describe("upcomingLaunchesData", () => {
  it("has at least one upcoming launch", () => {
    expect(upcomingLaunchesData.length).toBeGreaterThan(0);
  });

  it("all upcoming launches have future dates", () => {
    const now = new Date("2026-01-01").getTime();
    for (const launch of upcomingLaunchesData) {
      expect(new Date(launch.launch_date_utc).getTime()).toBeGreaterThan(now);
    }
  });
});

// ─── Launchpads ──────────────────────────────────────────────
describe("launchPadsData", () => {
  it("has five launchpads", () => {
    expect(launchPadsData).toHaveLength(5);
  });

  it("every launchpad has required fields", () => {
    for (const pad of launchPadsData) {
      expect(pad.id).toBeTruthy();
      expect(pad.name).toBeTruthy();
      expect(pad.full_name).toBeTruthy();
      expect(pad.locality).toBeTruthy();
      expect(pad.status).toMatch(/^(active|retired|under construction)$/);
      expect(pad.launch_attempts).toBeGreaterThanOrEqual(0);
      expect(pad.launch_successes).toBeLessThanOrEqual(pad.launch_attempts);
    }
  });

  it("success count never exceeds attempt count", () => {
    for (const pad of launchPadsData) {
      expect(pad.launch_successes).toBeLessThanOrEqual(pad.launch_attempts);
    }
  });
});

// ─── Ships ───────────────────────────────────────────────────
describe("shipsData", () => {
  it("has at least one ship", () => {
    expect(shipsData.length).toBeGreaterThan(0);
  });

  it("every ship has required fields", () => {
    for (const ship of shipsData) {
      expect(ship.id).toBeTruthy();
      expect(ship.name).toBeTruthy();
      expect(ship.type).toBeTruthy();
      expect(ship.home_port).toBeTruthy();
      expect(typeof ship.active).toBe("boolean");
      expect(Array.isArray(ship.roles)).toBe(true);
      expect(Array.isArray(ship.launches)).toBe(true);
    }
  });

  it("contains the three drone ships", () => {
    const droneShips = shipsData
      .filter((s) => s.type === "Drone Ship")
      .map((s) => s.name);
    expect(droneShips).toContain("Just Read The Instructions");
    expect(droneShips).toContain("Of Course I Still Love You");
    expect(droneShips).toContain("A Shortfall of Gravitas");
  });
});
