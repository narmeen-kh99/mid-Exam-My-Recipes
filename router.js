const express = require("express");
const router = express();
const axios = require("axios");
const bodyParser = require("body-parser");
indexOfRecipe = 0;
ingredientR = "";

dairyIngredients = [
  "Cream",
  "Cheese",
  "Milk",
  "Butter",
  "Creme",
  "Ricotta",
  "Mozzarella",
  "Custard",
  "Cream Cheese",
];
glutenIngredients = ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"];
let dairyGlutenIngredients = [].concat(glutenIngredients, dairyIngredients);
checkCommonsItems = function (arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (
        arr1[i] == arr2[j] ||
        arr1[i] == arr2[j].toLowerCase() ||
        arr1[i].search(arr2[j]) != -1 ||
        arr1[i].search(arr2[j].toLowerCase()) != -1
      ) {
        return true;
      }
    }
  }
  return false;
};

router.get("/recipes/:ingredientName", (req, res) => {
  let Gluten = req.query.gluten;
  let Dairy = req.query.dairy;
  let next = req.query.next;
  ingredientR = req.params.ingredientName;

  axios
    .get(
      `https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient/${req.params.ingredientName}`
    )
    .then((recipe) => {
      let result = "";
      let Recipes = initDataRecipes(recipe);
      let RecipesWithoutGluten = [];
      let RecipesWithoutDairy = [];
      let bothGletenDairyR = [];
      for (let recipeData of Recipes) {
        if (!checkCommonsItems(recipeData.ingredients, glutenIngredients)) {
          RecipesWithoutGluten.push(recipeData);
        }
        if (!checkCommonsItems(recipeData.ingredients, dairyIngredients)) {
          RecipesWithoutDairy.push(recipeData);
        }
        if (
          !checkCommonsItems(recipeData.ingredients, dairyGlutenIngredients)
        ) {
          bothGletenDairyR.push(recipeData);
        }
      }
      if (Gluten == "true" && Dairy == "false") {
        result = buildRecipes(
          RecipesWithoutGluten,
          next,
          ingredientR,
          req.params.ingredientName,
          indexOfRecipe
        );
        if (result != "error") {
          res.send(result);
        } else {
          res.status(404).send({
            Error: `The end there is not more recipes with ingredient ${req.params.ingredientName}`,
          });
        }
      } else if (Dairy == "true" && Gluten == "false") {
        result = buildRecipes(
          RecipesWithoutDairy,
          next,
          ingredientR,
          req.params.ingredientName,
          indexOfRecipe
        );
        if (result != "error") {
          res.send(result);
        } else {
          res.status(404).send({
            Error: `The end there is not more recipes with ingredient ${req.params.ingredientName}`,
          });
        }
      } else if (Gluten == "true" && Dairy == "true") {
        result = buildRecipes(
          bothGletenDairyR,
          next,
          ingredientR,
          req.params.ingredientName,
          indexOfRecipe
        );
        if (result != "error") {
          res.send(result);
        } else {
          res.status(404).send({
            Error: `The end there is not more recipes with ingredient ${req.params.ingredientName}`,
          });
        }
      } else {
        result = buildRecipes(
          Recipes,
          next,
          ingredientR,
          req.params.ingredientName,
          indexOfRecipe
        );
        if (result != "error") {
          res.send(result);
        } else {
          res.status(404).send({
            Error: `The end there is not more recipes with ingredient ${req.params.ingredientName}`,
          });
        }
      }
    });
});
initDataRecipes = function (recipe) {
  let filterDataRecipes = [];
  let newRecipe = {};
  for (let i = 0; i < recipe.data.results.length; i++) {
    newRecipe = {};
    newRecipe["idMeal"] = recipe.data.results[i].idMeal;
    newRecipe["ingredients"] = recipe.data.results[i].ingredients;
    newRecipe["title"] = recipe.data.results[i].title;
    newRecipe["thumbnail"] = recipe.data.results[i].thumbnail;
    newRecipe["href"] = recipe.data.results[i].href;
    filterDataRecipes.push(newRecipe);
  }
  return filterDataRecipes;
};
buildRecipes = function (
  totalRecipes,
  next,
  ingredientR,
  newIngredient,
  indexOfRecipe
) {
  if (ingredientR != newIngredient) {
    this.indexOfRecipe = 0;
    ingredientR = newIngredient;
    ndexOfRecipe = indexOfRecipe + 4;
    return totalRecipes.splice(indexOfRecipe - 4, 4);
  } else if (
    totalRecipes.length > indexOfRecipe + 4 ||
    totalRecipes.length == indexOfRecipe + 4
  ) {
    this.indexOfRecipe = indexOfRecipe + 4;
    return totalRecipes.splice(indexOfRecipe - 4, 4);
  } else if (totalRecipes.length - indexOfRecipe >= 0) {
    this.indexOfRecipe = totalRecipes.length + 1;
    return totalRecipes.splice(
      this.indexOfRecipe - (totalRecipes.length + 1),
      totalRecipes.length - indexOfRecipe
    );
  } else {
    return "error";
  }
};

module.exports = router;
