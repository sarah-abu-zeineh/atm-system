import {generateUniqueId} from "./helpers/helper.js";

export class ATM {
    constructor(balance, location) {
        this.id = + generateUniqueId();
        this.balance = balance;
        this.location = location;
        this.currentAccount = null;
    }

    displayMenu() {}

    logIn() {}

    logOut() {}

    convertCurrency() {}

    exit() {}

    setAccount(account) {
        this.currentAccount = account;
    } 
}
