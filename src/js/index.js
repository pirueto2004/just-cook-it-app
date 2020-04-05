// Global app controller
import Search from './models/Search';
import {elements, renderLoader, clearLoader, searchResPages} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';
import List from './models/List';
import * as listView from './views/listView';
import Likes from './models/Likes';
import * as likesView from './views/likesView';



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
//For testing purposes
// window.state = state;

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
    // console.log(id);
    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();

        //Delete shopping list from the UI
        listView.clearShoppingList();

        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) searchView.hightLightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);

        //FOR TESTING PURPOSE WE EXPOSE THE RECIPE ID TO THE GLOBAL OBJECT
        // window.r = state.recipe;

        try {
            //Get the recipe data and parse the ingredients
            await state.recipe.getRecipe();
            // console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //Calculate servings and cooking time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render the recipe
            // console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

            
       
        } catch(error) {
            console.log(error);
            alert('Error processing recipe :(');
        }

        
    }
    
};



// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

//The 2 lines of code above can be simplified in one single line as follows

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

/******************************/
/**LIST CONTROLLER          ***/
/******************************/

const controlList = () => {

    //Create a new list if there is none yet
    if (!state.list) {
        state.list = new List();

        //Add each ingredient to the list and UI
        state.recipe.ingredients.forEach((elem, index) => {
            const item = state.list.addItem(elem.count, elem.unit, elem.ingredient);
            listView.renderItem(item);
            // recipeView.updateIngredientIcon(index);
            const isChecked = false;

            //Update ingredient icon on the UI
            // recipeView.updateIngredientIcon(id);
            if (!isChecked) {
                recipeView.toggleIconBtn(index, true);
            }
            // recipeView.toggleIconBtn(index, true);
        });

        //Add a delete shopping list button to UI
        listView.deleteButton();
        
    }

    //Disable add to shopping list button after clicking on it
    // document.querySelector('.recipe__btn--add').classList.toggle('btn-disable');

};

//Add manually each ingredient to shopping list and UI
const controlListItem = (id, count, unit, ingredient) => {
    //Create a new list if there is none yet
    if (!state.list) {
        state.list = new List();
    }

    //Add ingredient to the list
    const item = state.list.addItem(count, unit, ingredient);
    
    //Add item to the UI
    listView.renderItem(item);

    // console.log(state.list.items.indexOf(item));

    // let itemID = state.list.items.indexOf(item);

    const isChecked = false;

    //Update ingredient icon on the UI
    // recipeView.updateIngredientIcon(id);
    if (!isChecked) {
        recipeView.toggleIconBtn(id, true);
    }
    
        
    if (state.list.items.length === 1) {
        //Add a delete shopping list button to UI
        listView.deleteButton();
    }
};

/******************************/
/**LIKE CONTROLLER          ***/
/******************************/

const controlLike = () => {
    //Create a new Like object if there is NONE yet
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to the UI list
        likesView.renderLike(newLike);
        // console.log(state.likes);

    //User HAS liked current recipe
    } else {
        //Remove like from the state
        state.likes.deleteLike(currentID);

        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like from the UI list
        likesView.deleteLike(currentID);
        // console.log(state.likes);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load
window.addEventListener('load', () => {

    state.likes = new Likes();

    //Restore likes from the localStorage
    state.likes.readStorage();

    //Toggle menu like button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

//Restore saved shopping list on page load
window.addEventListener('load', () => {

    //Delete shopping list from the UI
    listView.clearShoppingList();
   
    const storage = JSON.parse(localStorage.getItem('items'));
        
    if (storage) {
        
        state.list = new List();

        //Restore items from the localStorage
        state.list.readStorage();

        //Render the existing shopping items
        state.list.items.forEach(item => listView.renderItem(item));

        //Add a delete shopping list button to UI
        listView.deleteButton();

              
    }

       
});


//Handle delete and update list item events
elements.shopping.addEventListener('click', event => {
    let id = event.target.closest('.shopping__item').dataset.itemid;
    
    //Handle the delete button
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {

        state.list.deleteItem(id);

        listView.deleteItem(id);

        if (state.list.items.length === 0) {
            //Delete shopping list from the UI
            listView.clearShoppingList();
            //Delete shopping list items from the localStorage
            localStorage.clear();

             //Disable add to shopping list button after clicking on it
            //  document.querySelector('.recipe__btn--add').classList.remove('btn-disable');
             
            controlRecipe();

           
        }
      
        //Handle the count update
    } else if (event.target.matches('.shopping__count-value')) {
        const val = parseFloat(event.target.value, 10);
        state.list.updateCount(id, val);
    }
});

//Handle delete shopping list event
elements.deleteAll.addEventListener('click', event => {
    if (event.target.matches('.delete-btn, .delete-btn *')) {
        
        const storage = JSON.parse(localStorage.getItem('items'));
        
        if (storage) {

            //Delete shopping list items from the localStorage
            localStorage.clear();

        }

        //Delete shopping list from the UI
        listView.clearShoppingList();

        //Delete shopping list items from the state
        state.list.deleteAllItems();

        //Disable add to shopping list button after clicking on it
        // document.querySelector('.recipe__btn--add').classList.remove('btn-disable');
           
        //Update ingredient icons on the UI
        controlRecipe();
        
        // console.log(state.list.items);
    }
     
});

//Handling recipe buttons click
elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateRecipe(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateRecipe(state.recipe);

        //Add all of the ingredients to shopping list
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        
        //Disable add to shopping list button after clicking on it
        // document.querySelector('.recipe__btn--add').classList.add('btn-disable');

        controlList();

        //Add selected ingredient to shopping list
    }else if (event.target.matches('.btn-add-shopping, .btn-add-shopping *')){
        
        //Get the id of the <li> closest to the clicked element
        const id = event.target.closest('li').dataset.tag;

        //Get the ingredient with that id from the recipe ingredients 
        const item = state.recipe.ingredients[id];
        
        //Add ingredient to shopping list
        controlListItem(id, item.count, item.unit, item.ingredient);
        // }
      
        //Add or remove like to recipe
    }else if (event.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
    // console.log(state.recipe);
});



// window.l = new List();



