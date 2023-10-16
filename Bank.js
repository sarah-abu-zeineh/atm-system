import { generateUniqueId } from "./helpers/helper.js";

import { Account } from "./Account.js";
import { ATM } from "./ATM.js"

import { AccountsArray } from "./utils/AccountsArray.js";
import { ATMs } from "./utils/ATMsArrya.js";

export class Bank {
    constructor(bankName) {
        this.id = + generateUniqueId();
        this.accounts = AccountsArray.map(account => {
            return this.createAccount(account);
        });
        this.atms = ATMs.map(atm => {
            return this.addATM(atm);
        });
        this.bankName = bankName;
    }

    createAccount(account) {
        return new Account(account);
    }

    getAccount(user_name, password) {
        return this.accounts.find(account => account.userName === user_name && account.password === password);
    }
    
    addATM(atm) {
        return new ATM(atm.balance, atm.location);
    }

    deleteAccount() {}
}
