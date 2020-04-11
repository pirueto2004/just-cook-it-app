//Importing a Unique ID generator
import uniqid from 'uniqid';
import {elements} from '../views/base';
import * as listView from '../views/listView';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        //Add item to the list array
        this.items.push(item);
        //Save array to the localStorage
        this.persistListItem();
        //Return current item 
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(el => el.id === id);
        //[2, 4, 8] splice(1, 2) -> returns [4, 8] original array is [2, 8]
        //[2, 4, 8] slice(1, 2) -> returns 4, original array is [2, 4, 8]
        //delete the item at the index position
        this.items.splice(index, 1);

        //Persist data in the localStorage 
        this.persistListItem();
        if (this.items.length === 0) listView.clearShoppingList();
    }

    updateCount (id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }

    deleteAllItems () {
        //empty your array
        this.items.length = 0;
    }

    persistListItem () {
        //Saving items in localStorage
        localStorage.setItem('items', JSON.stringify(this.items));    
    }

    readStorage () {
        //Retrieving items from localStorage
        const items = localStorage.getItem('items');

        //Restoring items from the localStorage
        // this.items = items ? JSON.parse(items) : [];

        if (items) this.items = JSON.parse(items);
    }
    
};