import {generateUniqueId} from "./helpers/helper.mjs";
import {Account} from "./Account.mjs";

export class Bank {
    constructor(bankName) {
        this.id = + generateUniqueId();
        this.accounts = [];
        this.atms = [];
        this.bankName = bankName;
    }

    createAccount(account) {
        this.accounts.push(new Account(account));
    }

    getAccounts() {}

    deleteAccount() {}
}
