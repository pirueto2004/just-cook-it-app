import axios from 'axios';
import {API_url} from '../config';

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
}