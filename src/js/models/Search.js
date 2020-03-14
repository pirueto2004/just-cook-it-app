/*export default 'I am an exported string';*/
import axios from 'axios';

export default class Search {
    //Constructor
    constructor(query) {
        this.query = query;
    }

    //Methods
    async getResults() {
        const API_url = `https://forkify-api.herokuapp.com/api/search`;
        // const q = `?q=${this.query}`;
        try {
            const result = await axios(API_url + `?q=${this.query}`);
            // const recipes = result.data.recipes;
            this.result = result.data.recipes;
            // console.log(this.result);
        } catch(error) {
            alert(error);
        }
        
        
    };
};


