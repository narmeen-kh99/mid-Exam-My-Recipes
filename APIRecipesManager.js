class APIManager {
  constructor() {
    this.data = [];
  }

  getRecipesWithoutGluten() {
    let next = $("#next").on("clik", () => {
      return true;
    });
    const ingredient = $("#ingredient-input").val();
    return $.get(
      `http://localhost:3000/recipes/${ingredient}?gluten=${true}&dairy=${false}&next=&${next}`
    ).then((result) => {
      render.RenderRecipesOfIngredent(result);
    });
  }

  getRecipesWithoutDairy() {
    const ingredient = $("#ingredient-input").val();
    return $.get(
      `http://localhost:3000/recipes/${ingredient}?gluten=${false}&dairy=${true}`
    ).then((result) => {
      render.RenderRecipesOfIngredent(result);
    });
  }
  getRecipesWithoutDG() {
    const ingredient = $("#ingredient-input").val();
    return $.get(
      `http://localhost:3000/recipes/${ingredient}?gluten=${true}&dairy=${true}`
    ).then((result) => {
      render.RenderRecipesOfIngredent(result);
    });
  }
  getRecipes() {
    const ingredient = $("#ingredient-input").val();
    return $.get(`http://localhost:3000/recipes/${ingredient}`).then(
      (result) => {
        render.RenderRecipesOfIngredent(result);
      }
    );
  }
}
