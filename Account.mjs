import {generateUniqueId} from "./helpers/helper.mjs";

export class Account {
    constructor(account) {
        this.id = generateUniqueId();
        this.userName = account.userName;
        this.password = account.password;
        this.gender = account.gender;
        this.email = account.email;
        this.firstName = account.firstName;
        this.lastName = account.lastName;
        this.balance = 0;
        this.lastInteract = account.lastInteract;
        this.currencyType = account.currencyType;
    }

    cashWithDraw() {}

    cashDeposit() {}

    changePassword() {}

    transferFund() {}

}
