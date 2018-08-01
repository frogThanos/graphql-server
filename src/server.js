const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});
const bodyParser = require('body-parser');
const cors = require('cors');

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

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

// JWT authentication middleware

app.use(async (req, res, next) => {
  const token = await req.headers['authorization'];
  console.log(token);
  if (token !== 'null') {
    try {
      req.currentUser = await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      console.error(e);
    }
  }
  next();
});

// create graphiql application
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));


// connect schemas to graphql
app.use('/graphql', bodyParser.json(), graphqlExpress(({ currentUser }) => ({
  schema,
  context: {
    Recipe,
    User,
    currentUser,
  },
})));

const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
