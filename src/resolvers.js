const jwt = require('jsonwebtoken');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (root, args, context) => {
      const { Recipe } = context;
      return allRecipes = await Recipe.find();
    }
  },
  Mutation: {
    addRecipe: async (root, args, context) => {
      const { name, description, category, instructions, username } = args;
      const { Recipe } = context;

      return newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username,
      }).save();
    },
    signUpUser: async (root, args, context) => {
      const { username, email, password } = args;
      const { User } = context;
      const user = await User.findOne({ username });

      if (user) {
        throw new Error('User already exists');
      }

      const newUser = await new User({
        username,
        email,
        password,
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr')}
    }
  }
};
