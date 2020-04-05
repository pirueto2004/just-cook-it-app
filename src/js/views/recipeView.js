import {elements} from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

export const formatCount = count => {
    if (count) {
        //To work around the decimal part with 4 digits
        const newCount = Math.round(count * 10000)/10000;
        //Using distructuring we define 2 variables at the same time
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));
        //There is NO decimal return the count
        if (!dec) return newCount;

        if (int === 0) {
            const fr = new Fraction(newCount);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(newCount - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?';
};



export const createIngredient = (ingredient, index, isChecked) => `
    <li class="recipe__item" data-tag="${index}">
       <button type="button" class="btn-tiny tooltip btn-add-shopping" id="btn${index}">
            <span class="tooltiptext">Add to shopping list</span>
            <svg>
                <use href="img/icons.svg#${isChecked ? 'icon-check' : 'icon-circle-with-plus'}"></use>
            </svg>
        </button>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            <span>${ingredient.ingredient}</span>
        </div>
    </li>
`;

export const toggleIconBtn = (id, isChecked) => {
    const iconString = isChecked ? 'icon-check' : 'icon-circle-with-plus';
    document.querySelector(`[data-tag="${id}"] use`).setAttribute('href', `img/icons.svg#${iconString}`);
    toggleElem(`btn${id}`);
    
};

export const toggleElem = (elemId) => {
    const el = document.getElementById(elemId);
    if (!el.classList.contains('btn-disable')) {
        el.classList.add('btn-disable');
    } else {
        el.classList.remove('btn-disable');
    }
    
};

//Change ingredient icon-circle-with-plus to icon-check when clicked and added to shopping list
// export const updateIngredientIcon = (id) => {
//   const item =  document.querySelector(`[data-tag="${id}"] use`);
//   console.log(item);
//   if (item.getAttribute('href') === 'img/icons.svg#icon-circle-with-plus') {
//     item.setAttribute('href', 'img/icons.svg#icon-check');
   
//     //Disable icon button when clicked
//      toggleElem(`btn${id}`);
//   } else {
//     item.setAttribute('href', 'img/icons.svg#icon-circle-with-plus');
   
//     //Enable icon button when clicked
//      toggleElem(`btn${id}`);
//   }
  
  
// };

export const renderRecipe = (recipe, isLiked) => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map((elem, index) => createIngredient(elem, index, false)).join('')}
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);

};

export const updateRecipe = recipe => {
    //Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    //Update the ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    });

  
};