const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (root, args, { Recipe }) => {
      return allRecipes = await Recipe.find().sort({
        createdDate: 'desc',
      })
    },
    getRecipe: async (root, { _id }, { Recipe }) => {
      return recipe = await Recipe.findOne({ _id });
    },
    getUserRecipes: async (root, { username }, { Recipe }) => {
      const userRecipes = await Recipe.find({ username }).sort({
        createdDate: 'desc',
      });
      return userRecipes;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      return user = await User.findOne({ username: currentUser.username })
        .populate({
          path: 'favorites',
          model: 'Recipe'
        });
    },
    searchRecipes: async (root, { searchTerm }, { Recipe }) => {
      if (searchTerm) {
        const searchResults = await Recipe.find({
          $text: { $search: searchTerm }
        },
          {
          score: { $meta: 'textScore' }
        }).sort({
          score: { $meta: 'textScore' }
        });
        return searchResults;
      } else {
        const recipes = await Recipe.find().sort({ likes: 'desc', createdDate: 'desc' });
        return recipes;
      }
    }
  },
  Mutation: {
    addRecipe: async (root, args, context) => {
      const { name, imageUrl, description, category, instructions, username } = args;
      const { Recipe } = context;

      return newRecipe = await new Recipe({
        name,
        imageUrl,
        description,
        category,
        instructions,
        username,
      }).save();
    },
    deleteUserRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOneAndRemove({ _id });
      return recipe;
    },
    likeRecipe: async (root, { _id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate({ _id }, { $inc: { likes: 1 } });
      const user = await User.findOneAndUpdate({ username }, { $addToSet: {
          favorites: _id,
        }});
      return recipe;
    },
    unLikeRecipe: async (root, { _id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate({ _id }, { $inc: { likes: -1 } });
      const user = await User.findOneAndUpdate({ username }, { $pull: {
          favorites: _id,
        }});
      return recipe;
    },
    signInUser: async (root, args, context) => {
      const { username, password } = args;
      const { User } = context;
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Password is not valid');
      }
      return { token: createToken(user, process.env.SECRET, '1hr')};
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
      return { token: createToken(newUser, process.env.SECRET, '1hr')};
    }
  }
};
