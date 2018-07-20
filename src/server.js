const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});
const bodyParser = require('body-parser');

// models
const User = require('./models/User');
const Recipe = require('./models/Recipe');

// graphql express middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

// create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('successfully connected to database!');
  })
  .catch((error) => {
    console.error(error);
  });

const app = express();

// create graphiql application
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// connect schemas to graphql
app.use('/graphql', graphqlExpress({
  schema,
  context: {
    Recipe,
    User,
  },
}));

const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
