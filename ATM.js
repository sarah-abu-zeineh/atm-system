import { generateUniqueId } from "./helpers/helper.js";

export class ATM {
    constructor(balance, location) {
        this.id = + generateUniqueId();
        this.balance = balance;
        this.location = location;
    }


    setAccount(account) {
        this.currentAccount = account;
    }

    displayMenu() { }

    logIn() { }

    logOut() { }

    convertCurrency() { }

    exit() { }
}
