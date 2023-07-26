import { async } from "regenerator-runtime";
import { API_URL, KEY, RES_PER_PAGE } from "./config.js";
// import { getJson, sendJson } from "./helper.js";
import { AJAX } from "./helper.js";
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {

  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //its same as like key:recipe.key its just check for key exist for recipe or not,its an handy trick some time
    ...(recipe.key && { key: recipe.key })
  }

}

// console.log(state.bookmarks);
export const loadRecipe = async function (id) {

  try {


    console.log(id);
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    console.log(data);


    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  }
  catch (err) {
    console.error(`${err}🔥🔥🔥🔥🔥🔥🔥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}?key=${KEY}`)
    console.log(data);
    console.log(data.data.recipes);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key })

      };
    });
    state.search.page = 1;
    // console.log(state.search.results);

  } catch (err) {
    console.error(`${err}🔥🔥🔥🔥🔥🔥🔥`);
    throw err;
  }

}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  // const start = (page - 1) * 10;//0
  // const end = page * 10// here we want 9
  const start = (page - 1) * state.search.resultsPerPage;// here we want  0
  const end = page * state.search.resultsPerPage// here we want 9
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  console.log(newServings);
  console.log(state.recipe.ingredients);
  state.recipe.ingredients.forEach(ing => {
    //newQt=oldQt*newServings/oldServings
    //2*8/4=4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  })

  state.recipe.servings = newServings;
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

//recipe is nothing but model.state.recipe in controller.js
export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);
  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage)
}
init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();


// const clearBookmarks = function () {
//   localStorage.clear('bookmarks')
// }
//clearBookmarks
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};



