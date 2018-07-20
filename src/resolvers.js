exports.resolvers = {
  Query: {
    getAllRecipes: () => {

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
    }
  }
};
