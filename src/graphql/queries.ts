import { gql } from "@apollo/client";


// ------------------- Company Info ------------------

export const GET_COMPANY = gql`
  query GetCompany {
    company {
      name
      founder
      founded
      employees
      ceo
      cto
      coo
      summary
      launch_sites
      valuation
    }
  }
`;

// ------------------ Launches ------------------

export const GET_PAST_LAUNCHES = gql`
  query GetPastLaunches($limit: Int, $offset: Int) {
    launchesPast(limit: $limit, offset: $offset) {
      id
      mission_name
      launch_date_utc
      launch_success
      details
      rocket {
        rocket_name
        rocket_type
      }
      links {
        mission_patch_small
        video_link
        wikipedia
      }
      launch_site {
        site_name_long
      }
    }
  }
`;

// ------------------ Upcoming Launches ------------------

export const GET_UPCOMING_LAUNCHES = gql`
  query GetUpcomingLaunches {
    launchesUpcoming(limit: 5) {
      id
      mission_name
      launch_date_utc
      details
      rocket {
        rocket_name
      }
      launch_site {
        site_name_long
      }
    }
  }
`;

// ------------------ Single Launch ------------------

export const GET_LAUNCH = gql`
  query GetLaunch($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      launch_date_utc
      launch_success
      details
      rocket {
        rocket_name
        rocket_type
        second_stage {
          payloads {
            payload_id
            payload_type
            payload_mass_kg
            orbit
            nationality
            manufacturer
            customers
          }
        }
      }
      launch_site {
        site_name_long
      }
      links {
        mission_patch
        mission_patch_small
        video_link
        wikipedia
        reddit_campaign
        presskit
        flickr_images
      }
      ships {
        name
        type
        home_port
      }

    }
  }
`;


// ------------------ Rockets ------------------

export const GET_ROCKETS = gql`
  query GetRockets {
    rockets {
      id
      name
      description
      active
      first_flight
      country
      stages
      boosters
      cost_per_launch
      success_rate_pct
      mass {
        kg
      }
      height {
        meters
      }
      diameter {
        meters
      }
      engines {
        number
        type
        version
        propellant_1
        propellant_2
        thrust_to_weight
      }
      payload_weights {
        id
        name
        kg
      }
    }
  }
`;

// ------------------ Single Rocket ------------------

export const GET_ROCKET = gql`
  query GetRocket($id: ID!) {
    rocket(id: $id) {
      id
      name
      description
      active
      first_flight
      country
      stages
      boosters
      cost_per_launch
      success_rate_pct
      mass {
        kg
      }
      height {
        meters
      }
      diameter {
        meters
      }
      engines {
        number
        type
        version
        propellant_1
        propellant_2
        thrust_to_weight
      }
      payload_weights {
        id
        name
        kg
      }
      flickr_images
      wikipedia
      description
    }
  }
`;
