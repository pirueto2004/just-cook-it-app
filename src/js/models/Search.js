/*export default 'I am an exported string';*/
import axios from 'axios';
import {API_url} from '../config';

// const API_url = process.env.API_url;

export default class Search {
    //Constructor
    constructor(query) {
        this.query = query;
    }

    //Methods
    async getResults() {
        try {
            const result = await axios(`${API_url}search?q=${this.query}`);
            // const recipes = result.data.recipes;
            this.result = result.data.recipes;
            // console.log(this.result);
        } catch(error) {
            alert(error);
        }
        
        
    };
};


