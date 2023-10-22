import {generateUniqueId} from "./helpers/helper.js";

export class ATM {
    constructor(balance, location, currencyType) {
        this.id = + generateUniqueId();
        this.balance = balance;
        this.location = location;
        this.currentAccount = null;
        this.currencyType = currencyType;
    }
}
