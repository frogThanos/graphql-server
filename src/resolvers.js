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
    }
  }
};
