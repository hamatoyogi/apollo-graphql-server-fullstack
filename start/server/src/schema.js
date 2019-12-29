const { gql } = require('apollo-server')

const typeDefs = gql`
  #custom CT API location

  type Location {
    parentName: String
    parentKgID: String
    kgID: String
    synonym: String
    articleCounter: Int
    displayName: String
    locationID: String
    parentID: String
    locationType: String
    isParent: Boolean
    lat: Int
    lng: Int
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Mutation {
    # if false, booking trips failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    # if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String # login token
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """
  type LaunchConnection { 
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    # missionPatch(size: PatchSize): String
    missionPatch(mission: String, size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }

  type Query {
    launches(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    # Queries for the current user
    me: User
    

    # CT Query
    location(path: String!): Location
  }
`

module.exports = typeDefs
