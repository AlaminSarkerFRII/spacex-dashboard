export const typeDefs = /* GraphQL */ `
  type Query {
    company: Company
    rockets: [Rocket!]!
    rocket(id: ID!): Rocket
    launchesPast(limit: Int, offset: Int): [Launch!]!
    launchesUpcoming(limit: Int): [Launch!]!
    launch(id: ID!): Launch
    launchPads: [LaunchPad!]!
    launchPad(id: ID!): LaunchPad
  }

  type Company {
    name: String!
    founder: String!
    founded: Int!
    employees: Int!
    ceo: String!
    cto: String!
    coo: String!
    summary: String!
    launch_sites: Int!
    valuation: Float!
  }

  type Rocket {
    id: ID!
    name: String!
    description: String!
    active: Boolean!
    first_flight: String!
    country: String!
    stages: Int!
    boosters: Int!
    cost_per_launch: Int!
    success_rate_pct: Int!
    mass: Mass
    height: Measurement
    diameter: Measurement
    engines: Engines
    payload_weights: [PayloadWeight!]!
    flickr_images: [String!]!
    wikipedia: String
  }

  type Mass {
    kg: Float!
  }

  type Measurement {
    meters: Float!
  }

  type Engines {
    number: Int!
    type: String!
    version: String!
    propellant_1: String!
    propellant_2: String!
    thrust_to_weight: Float!
  }

  type PayloadWeight {
    id: ID!
    name: String!
    kg: Float!
  }

  type Launch {
    id: ID!
    mission_name: String!
    launch_date_utc: String!
    launch_success: Boolean
    details: String
    rocket: LaunchRocket
    launch_site: LaunchSite
    links: LaunchLinks
    ships: [Ship!]!
  }

  type LaunchRocket {
    rocket_name: String!
    rocket_type: String!
    second_stage: SecondStage
  }

  type SecondStage {
    payloads: [Payload!]!
  }

  type Payload {
    payload_id: String!
    payload_type: String!
    payload_mass_kg: Float
    orbit: String
    nationality: String
    manufacturer: String
    customers: [String!]!
  }

  type LaunchSite {
    site_name_long: String!
  }

  type LaunchLinks {
    mission_patch: String
    mission_patch_small: String
    video_link: String
    wikipedia: String
    reddit_campaign: String
    presskit: String
    flickr_images: [String!]!
  }

  type Ship {
    name: String!
    type: String!
    home_port: String!
  }


type LaunchPad {
  id: ID!
  name: String!
  full_name: String!
  locality: String!
  region: String!
  details: String!
  status: String!
  launch_attempts: Int!
  launch_successes: Int!
  wikipedia: String!
  images: [String!]!
}


`;


