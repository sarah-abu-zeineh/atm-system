import { UserInterface } from "./UserInterface.js";

export class ATM {
    constructor(location) {
        this.id = 9;
        this.balance = 0;
        this.location = location;
    }

    run() {
        const userInerface = new UserInterface();
        userInerface.login();
    }
    
    displayMenu() { }

    logIn() { }

    logOut() { }

    convertCurrency() { }

    exit() { }
}
