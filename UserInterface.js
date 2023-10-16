import { Bank } from "./Bank.js";
import * as readline from "readline";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export class UserInterface {
    constructor() {
        this.myBank = new Bank("Arab Bank");
    }
    login() {
        rl.question('Enter your username: ', (username) => {
            rl.question('Enter your password: ', (password) => {
                const isValidCredentials = this.myBank.accounts.some(account => {
                    return account.userName === username && account.password === password;
                });
                if (isValidCredentials) {
                    console.log('Login successful.');
                    const currentAccount = this.myBank.getAccount(username, password);
                } else {
                    console.log('Login failed.');
                }
                rl.close();
            });
        });
    }
    display() { }
}
