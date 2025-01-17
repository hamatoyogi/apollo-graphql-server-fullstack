const { ApolloServer } = require('apollo-server');
const { MemcachedCache } = require('apollo-server-cache-memcached');
const isEmail = require('isemail');
const typeDefs = require('./schema')
const { createStore } = require('./utils')
const resolvers = require('./resolvers')

const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')
const LocationAPI = require('./datasources/ct-location')

const store = createStore()

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = req.headers && req.headers.authorization || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] || null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
    locationAPI: new LocationAPI()
  }),
  persistedQueries: {
    cache: new MemcachedCache(
      ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
      { retries: 10, retry: 10000 }, // Options
    ),
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
