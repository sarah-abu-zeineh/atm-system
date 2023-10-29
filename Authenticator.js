import {generateHashPassword} from "./helpers/helper.js"

export class Authenticator {
    constructor(bank) {
        this.myBank = bank;
        this.userAccount = null;
        this.userAccountIndex = -1;
    }

    authenticateUser(username, password, callback) {
        const isValidCredentials = this.myBank.accounts.some(account => {
            return account.userName === username && account.password === generateHashPassword(password);
        });

        if (isValidCredentials) {
            this.userAccount = this.myBank.getAccount(username, generateHashPassword(password));
            this.currentAccountIndex = this.myBank.getAccountIndex(username);

            callback(this.userAccount, this.currentAccountIndex);

        } else {
            console.clear();
            
            callback(this.userAccount, this.currentAccountIndex);
        }
    }

}
