import {generateUniqueId} from "./helpers/helper.mjs";

import {Account} from "./Account.mjs";
import {ATM} from "./ATM.mjs"

import {AccountsArray} from "./utils/AccountsArray.mjs";
import { ATMs } from "./utils/ATMsArrya.mjs";

export class Bank {
    constructor(bankName) {
        this.id = + generateUniqueId();
        this.accounts = AccountsArray.map(account => {
            return this.createAccount(account)
        });
        this.atms = ATMs.map(atm => {
            return this.addATM(atm);
        });
        this.bankName = bankName;
    }

    createAccount(account) {
        return new Account(account)
    }

    getAccount() {}

    addATM(atm){
        return new ATM(atm.balance, atm.location)
    }

    deleteAccount() {}
}
