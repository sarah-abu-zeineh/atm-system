import { Bank } from "./Bank.js";

import { generateHashPassword } from "./helpers/helper.js"

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
                    return account.userName === username && account.password === generateHashPassword(password);
                });
                if (isValidCredentials) {
                    console.log('Login successful.');
                    const currentAccount = this.myBank.getAccount(username, generateHashPassword(password));
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
        rl.question('Enter your choice: ', async (choice) => {
            switch (choice) {
                case '1': this.myBank.atms[0].currentAccount.displayBalance();
                    break;
                case '2': this.cashWithDrawMenue();
                    break;
                case '3':
                    const amount = await this.askUserForAmount('Enter the amount you want to deposite: ');
                    this.myBank.atms[0].currentAccount.cashDeposit(amount);
                    break;
                case '4': const { username, transferdAmount } = await this.askForTransferDetails();
                    this.myBank.transferFund(username, transferdAmount);
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
            this.displayMenu();
        });
    }
    cashWithDrawMenue() {
        console.log(' Select Amount ');
        console.log(`1. ${this.myBank.atms[0].currentAccount.currencyType.icon}100`);
        console.log(`2. ${this.myBank.atms[0].currentAccount.currencyType.icon}200`);
        console.log(`3. ${this.myBank.atms[0].currentAccount.currencyType.icon}500`);
        console.log(`4. ${this.myBank.atms[0].currentAccount.currencyType.icon}700`);
        console.log('5. other');
        console.log('6. back');
        this.handleWithdrawMenuSelection();
    }

    handleWithdrawMenuSelection() {
        rl.question('Enter your choice: ', async (choice) => {
            switch (choice) {
                case '1': this.myBank.atms[0].currentAccount.cashWithDraw(100);
                    break;
                case '2': this.myBank.atms[0].currentAccount.cashWithDraw(200);
                    break;
                case '3': this.myBank.atms[0].currentAccount.cashWithDraw(500);
                    break;
                case '4': this.myBank.atms[0].currentAccount.cashWithDraw(700);
                    break;
                case '5':
                    const amount = await this.askUserForAmount('Enter the amount you want to withdraw: ');
                    this.myBank.atms[0].currentAccount.cashWithDraw(amount);
                    break;
                case '6':
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
            }
            this.displayMenu();
        });

    }

    askForTransferDetails() {
        return new Promise((resolve) => {
            rl.question('Enter the username of the recipient: ', (username) => {
                rl.question('Enter the amount to transfer: ', (transferdAmount) => {
                    resolve({ username, transferdAmount });
                });
            });
        });
    }


    askUserForAmount(message) {
        return new Promise((resolve) => {
            rl.question(message, (amount) => {
                resolve(Number(amount));
            });
        });
    }

}


