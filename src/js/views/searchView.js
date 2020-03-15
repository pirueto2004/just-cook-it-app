/*
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const ID = 23;
*/

import {elements} from './base';

export const getInput = () => elements.searchInput.value; //Implicit return of result

export const clearInput = () => {
    elements.searchInput.value = ''; //Not Implicit return of result
};

export const clearResults = () => {
    elements.searchResList.innerHTML = ''; //Not Implicit return of result
    elements.searchResPages.innerHTML = '';
};

const limitRecipeTitle = (title, charLimit = 17) => {
    const newTitle = [];
    if (title.length > charLimit) {
        //Split the title by space and accumulates current word into an array acc
        title.split(' ').reduce((acc, current) => {
            if (acc + current.length <= charLimit) {
                newTitle.push(current);
            }
            return acc + current.length;
        }, 0); //Initial value of the accumulator is set to 0
        //Return the result
        return `${newTitle.join(' ')} ...`; //The opposite of split method, it will join the elements of an array separated by spaces
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type ==='prev' ? page - 1 : page +1}>
        <span>Page ${type ==='prev' ? page - 1 : page +1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type ==='prev' ? 'left' : 'right'}"></use>
        </svg>
        
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        //only show button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        //Show both buttons to go back to previous page and to go to next page
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        //only show button to go back to previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //Render results of current page
    const start = (page - 1) * resPerPage; //start is a zero based index for slice method
    const end = page * resPerPage; //end is a zero based index for slice method

    //slice extracts elements of an array beginning at start up to but not including end
    recipes.slice(start, end).forEach(renderRecipe);

    //Render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};