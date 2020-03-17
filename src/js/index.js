// Global app controller
import Search from './models/Search';
import {elements, renderLoader, clearLoader, searchResPages} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';

/*
import string from './models/Search';
// import { add, multiply, ID } from './views/searchView'; ---First way of doing it
// import { add as a, multiply as m, ID } from './views/searchView'; ---Second way of doing it
import * as searchView from './views/searchView'; //---Third way of doing it

// console.log(`Using imported functions! ${add(ID, 2)} and ${multiply(3, 5)}. ${string}`);
// console.log(`Using imported functions! ${a(ID, 2)} and ${m(3, 5)}. ${string}`);
console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${string}`);
*/

/*Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/

//Initial state is empty
const state = {};

/***********************/
/**SEARCH CONTROLLER ***/
/***********************/

const controlSearch = async () => {
    //1. Get the query from View
    const query = searchView.getInput();
    // const query = 'pizza';
    // console.log(query);
    if (query) {
        //2. New search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            //4. Search for recipes
            await state.search.getResults();

            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
            // console.log(state.search.result);
        } catch (error) {
            alert('Error with your search request');
            clearLoader();
        }
        
    }
}

//Check for the event 'submit' of the search form
elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

//FOR TESTING PURPOSE
// window.addEventListener('load', event => {
//     event.preventDefault();
//     controlSearch();
// });

// const search = new Search('pizza');
// console.log(search);

elements.searchResPages.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        // console.log(goToPage);
    }
    
});

/***********************/
/**RECIPE CONTROLLER ***/
/***********************/

//Just for testing
// const rec = new Recipe(35477);
// rec.getRecipe();
// console.log(rec);

const controlRecipe = async () => {
    //Get the id from the url and remove the hash simbol from it
    const id = window.location.hash.replace('#', '');
    console.log(id);
    if (id) {
        //Prepare UI for changes
        renderLoader(elements.recipe);

        //Create new recipe object
        state.recipe = new Recipe(id);

        //FOR TESTING PURPOSE WE EXPOSE THE RECIPE ID TO THE GLOBAL OBJECT
        // window.r = state.recipe;

        try {
            //Get the recipe data and parse the ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //Calculate servings and cooking time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render the recipe
            // console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch(error) {
            alert('Error processing recipe :(');
        }

        
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

//The 2 lines of code above can be simplified in one single line as follows

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));