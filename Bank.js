export class Bank {
    constructor(bankName) {
        this.id = 5;
        this.accounts = [];
        this.atms = [];
        this.bankName = bankName;
    }

    createAccount() { }

    getAccount(user_name, password) {
        return this.accounts.find(account => account.user_name === user_name && account.password === password)
    }


    deleteAccount() { }
}
