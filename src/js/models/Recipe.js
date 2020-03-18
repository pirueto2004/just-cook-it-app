import axios from 'axios';
import {API_url} from '../config';
import { formatCount} from '../views/recipeView';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        
        try {
            const res = await axios(`${API_url}get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res);
        } catch(error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        //Assuming that we need 15 min for every 3 ingredients 
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.cookingTime = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'Tbsp', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(current => {
            //1. Uniform units
            let ingredient = current.toLowerCase();
            
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2. Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. Parse ingredients into count, unit and ingredient
            //Split ingredient string by using space separator and putting each element in an array
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(element => units.includes(element));
            

            let objIng;

            if (unitIndex > -1) {
                //There is a unit
                //Ex. 4 1/2 cups, arrCount is [4, 1/2]---> eval("4+1/2") --> 4.5
                //Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;

                if(arrCount.length === 1) {
                    if (arrCount[0] == "") {
                        count = 1;
                    } else {
                        count = eval(arrIng[0].replace('-','+'));
                    }
                    
                } else if (arrCount.length > 1) {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join(' '));
                }
                
                objIng = {
                    count,
                    unit : arrIng[unitIndex],
                    ingredient : arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                //There is NO unit, but first element is a number
                objIng = {
                    count : parseInt(arrIng[0], 10),
                    unit : '',
                    ingredient : arrIng.slice(1).join(' ')
                };

            } else if (unitIndex === -1 ) {
                
                //There is NO unit and NO number in first position
                objIng = {
                    count : 1,
                    unit : '',
                    ingredient : arrIng.slice(0).join(' ')
                };
            } 

            return objIng;

        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(currIng => {
            // currIng.count = currIng.count * (newServings / this.servings);
            currIng.count *= (newServings / this.servings);
                        
        });

        this.servings = newServings;
    }
};

