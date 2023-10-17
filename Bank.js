import { generateUniqueId } from "./helpers/helper.js";

import { Account } from "./Account.js";
import { ATM } from "./ATM.js";

import { ATMs } from "./utils/ATMsArrya.js";
import { AccountsArray } from "./utils/AccountsArray.js";

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

    getAccountIndex(userName) {
        return this.accounts.findIndex(account => account.userName === userName);
    }

    getAccount(user_name, password) {
        return this.accounts.find(account => account.userName === user_name && account.password === password);
    }

    isAccountValid(userName) {
        const accountIndex = this.accounts.findIndex(user => user.userName === userName);

        return accountIndex > -1 ? accountIndex : console.log(`${userName} didn't found`);

    }
    transferFund(userName, fund) {
        if (this.isAccountValid(userName)) {
            const account = this.accounts.find(user => user.userName === userName);
            account.balance += fund;
        }
        else {
            console.log("User with the provided username does not exist");
        }
    }

    addATM(atm) {
        return new ATM(atm.balance, atm.location);
    }

}
