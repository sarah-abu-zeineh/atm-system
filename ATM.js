import { UserInterface } from "./UserInterface.js";

export class ATM {
    constructor(location) {
        this.id = 9;
        this.balance = 0;
        this.location = location;
        this.currentAccount = null;
    }

    run() {
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
