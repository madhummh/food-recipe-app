// import icons from '../img/icons.svg'; parcel1
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


// import icons from 'url:../img/icons.svg';//parcel2
// console.log(icons);
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// const recipeContainer = document.querySelector('.recipe');
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // console.log(model.state.bookmarks);
    bookmarksView.update(model.state.bookmarks)

    // // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};




const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  // console.log(model.state.bookmarks);
  bookmarksView.render(model.state.bookmarks)
}

const newFeature = function () {
  console.log("welcome to the application");
}


const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();


    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);
    //Sucess message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URl
    window.history.pushState(null, '', `#$${model.state.recipe.id}`);


    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message)
  }
}


const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();

  // controlServings();
}
init();


// controlRecipes();
// simply loop over the loop and do addEventListner here intead doing it separetly like below


// function attachEventListeners(event) {
//   window.addEventListener(event, controlRecipes);
// }

// events.forEach(attachEventListeners);

// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes))
//if incase we have ten times addEventListner below is not good way to do
// window.addEventListener('hashchange', controlRecipes)
// window.addEventListener('load', controlRecipes)

// import * as model from './model.js';
// import { MODAL_CLOSE_SEC } from './config.js';
// import recipeView from './views/recipeView.js';
// import searchView from './views/searchView.js';
// import resultsView from './views/resultsView.js';
// import paginationView from './views/paginationView.js';
// import bookmarksView from './views/bookmarksView.js';
// import addRecipeView from './views/addRecipeView.js';

// // import 'core-js/stable';
// // import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';

// const controlRecipes = async function () {
//   try {
//     const id = window.location.hash.slice(1);

//     if (!id) return;
//     recipeView.renderSpinner();

//     // 0) Update results view to mark selected search result
//     resultsView.update(model.getSearchResultsPage());

//     // 1) Updating bookmarks view
//     bookmarksView.update(model.state.bookmarks);

//     // 2) Loading recipe
//     await model.loadRecipe(id);

//     // 3) Rendering recipe
//     recipeView.render(model.state.recipe);
//   } catch (err) {
//     recipeView.renderError();
//     console.error(err);
//   }
// };

// const controlSearchResults = async function () {
//   try {
//     resultsView.renderSpinner();

//     // 1) Get search query
//     const query = searchView.getQuery();
//     if (!query) return;

//     // 2) Load search results
//     await model.loadSearchResults(query);

//     // 3) Render results
//     resultsView.render(model.getSearchResultsPage());

//     // 4) Render initial pagination buttons
//     paginationView.render(model.state.search);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const controlPagination = function (goToPage) {
//   // 1) Render NEW results
//   resultsView.render(model.getSearchResultsPage(goToPage));

//   // 2) Render NEW pagination buttons
//   paginationView.render(model.state.search);
// };

// const controlServings = function (newServings) {
//   // Update the recipe servings (in state)
//   model.updateServings(newServings);

//   // Update the recipe view
//   recipeView.update(model.state.recipe);
// };

// const controlAddBookmark = function () {
//   // 1) Add/remove bookmark
//   if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
//   else model.deleteBookmark(model.state.recipe.id);

//   // 2) Update recipe view
//   recipeView.update(model.state.recipe);

//   // 3) Render bookmarks
//   bookmarksView.render(model.state.bookmarks);
// };

// const controlBookmarks = function () {
//   bookmarksView.render(model.state.bookmarks);
// };

// const controlAddRecipe = async function (newRecipe) {
//   try {
//     // Show loading spinner
//     addRecipeView.renderSpinner();

//     // Upload the new recipe data
//     await model.uploadRecipe(newRecipe);
//     console.log(model.state.recipe);

//     // Render recipe
//     recipeView.render(model.state.recipe);

//     // Success message
//     addRecipeView.renderMessage();

//     // Render bookmark view
//     bookmarksView.render(model.state.bookmarks);

//     // Change ID in URL
//     window.history.pushState(null, '', `#${model.state.recipe.id}`);

//     // Close form window
//     setTimeout(function () {
//       addRecipeView.toggleWindow();
//     }, MODAL_CLOSE_SEC * 1000);
//   } catch (err) {
//     console.error('💥', err);
//     addRecipeView.renderError(err.message);
//   }
// };

// const init = function () {
//   bookmarksView.addHandlerRender(controlBookmarks);
//   recipeView.addHandlerRender(controlRecipes);
//   recipeView.addHandlerUpdateServings(controlServings);
//   recipeView.addHandlerAddBookmark(controlAddBookmark);
//   searchView.addHandlerSearch(controlSearchResults);
//   paginationView.addHandlerClick(controlPagination);
//   addRecipeView.addHandlerUpload(controlAddRecipe);
// };
// init();
