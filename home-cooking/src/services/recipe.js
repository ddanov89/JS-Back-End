const { Recipe } = require('../models/Recipe');

async function getAllRecipes() {
    return Recipe.find().lean();
}

async function getRecipeById(id) {
    return Recipe.findById(id).lean();
}

async function createRecipe(data, authorId) {

    const record = new Recipe({
        title: data.title,
        ingredients: data.ingredients,
        instructions: data.instructions,
        description: data.description,
        image: data.image,
        author: authorId
    });

    await record.save();

    return record;
}

async function updateRecipe(id, data, userId) {

    const record = await Recipe.findById(id);

    if (!record) {
        throw new Error('Record not found' + id);
    }

    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }

    record.title = data.title;
    record.ingredients = data.ingredients;
    record.instructions = data.instructions;
    record.description = data.description;
    record.image = data.image;

    await record.save();
    return record;

}

async function deleteRecipeById(id, userId) {

    const record = await Recipe.findById(id);

    if (!record) {
        throw new Error('Record not found' + id);
    }
    
    if (record.author.toString() != userId) {
        throw new Error('Access denied!');
    }
    await Recipe.findByIdAndDelete(id);
}

async function searchRecipes(title) {
    const query = {};

    if (title) {
        query.title = new RegExp(title, 'i');
    }
    return Recipe.find(query).lean();
}

async function addRecommendation(recipeId, userId) {
    const record = await Recipe.findById(recipeId);

    if (!record) {
        throw new ReferenceError('Record not found' + recipeId);
    }

    if (record.author.toString() == userId) {
        throw new Error('Cannot recommend your own publication!');
    }

    if (record.recommendList.find(v => v.toString() == userId)) {
        throw new Error('One recommendation per user is allowed!');
    }
    record.recommendList.push(userId);
    await record.save();
    return record;
}

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipeById,
    searchRecipes,
    addRecommendation
};