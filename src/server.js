const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('successfully connected to database!');
  })
  .catch((error) => {
    console.error(error);
  });

const app = express();
const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
