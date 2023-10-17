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
        console.log("Welecome to " + this.myBank.bankName);
        rl.question('Enter your username: ', (username) => {
            rl.question('Enter your password: ', (password) => {
                const isValidCredentials = this.myBank.accounts.some(account => {
                    return account.userName === username && account.password === password;
                });
                if (isValidCredentials) {
                    console.log('Login successful.');
                    const currentAccount = this.myBank.getAccount(username, password);
                    this.myBank.atms[0].setAccount(currentAccount);
                    this.displayMenu();
                } else {
                    console.clear();
                    console.log('Login failed.');
                    this.login()
                }
            });
        });
    }
    displayMenu() {
        console.log(' Select Transaction  ');
        console.log('1. Balance Inquiry');
        console.log('2. Cash Withdrawl');
        console.log('3. Deposite');
        console.log('4. Transfer Fund');
        console.log('5. Change Password');
        console.log('6. Exit');
        this.handleMenuSelection();
    }
    handleMenuSelection() {
        rl.question('Enter your choice: ', (choice) => {
            switch (choice) {
                case '1': this.myBank.atms[0].currentAccount.displayBalance();
                    break;
                case '2': 
                    break;
                case '3':
                    break;
                case '4':
                    break;
                case '5':
                    break;
                case '6':
                    console.log('Exiting the application...');
                    rl.close();
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
            }
            this.handleMenuSelection();
        });
    }




}


