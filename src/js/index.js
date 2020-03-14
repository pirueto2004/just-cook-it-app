// Global app controller
import Search from './models/Search';
import {elements} from './views/base';
import * as searchView from './views/searchView';
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

const controlSearch = async () => {
    //1. Get the query from View
    const query = searchView.getInput();
    console.log(query);
    if (query) {
        //2. New search object and add to state

        state.search = new Search(query);
        //3. Prepare UI for results

        //4. Search for recipes
        await state.search.getResults();

        //5. Render results on UI
        console.log(state.search.result);
    }
}

//Check for the event 'submit' of the search form
elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

// const search = new Search('pizza');
// console.log(search);

