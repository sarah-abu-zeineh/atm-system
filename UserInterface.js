import { accounts } from "./utils/AccountsArray.js";
import * as readline from "readline";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export class UserInterface {
    constructor() {
    }
    login() {
        rl.question('Enter your username: ', (username) => {
            rl.question('Enter your password: ', (password) => {
                const isValidCredentials = accounts.some(account => {
                    return account.user_name === username && account.password === password;
                });

                if (isValidCredentials) {
                    console.log('Login successful.');
                } else {
                    console.log('Login failed.');
                }
                rl.close();
            });
        });
    }
    display() { }
}

