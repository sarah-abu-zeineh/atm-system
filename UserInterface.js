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
        this.currentAccount = null;
        this.currentAccountIndex = -1;
        this.currentCurrencyType = null;
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
                    this.currentAccount = this.myBank.getAccount(username, generateHashPassword(password));
                    this.currentAccountIndex = this.myBank.getAccountIndex(username);
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
                case '1': this.myBank.accounts[this.currentAccountIndex].displayBalance();
                    this.displayMenu();
                    break;
                case '2':
                    await this.askUserForCurrencyType();
                    this.cashWithDrawMenue();
                    break;
                case '3':
                    await this.askUserForCurrencyType();
                    const amount = await this.askUserForAmount('Enter the amount you want to deposite: ');
                    this.myBank.accounts[this.currentAccountIndex].cashDeposit(amount);
                    this.displayMenu();
                    break;
                case '4':
                    await this.askUserForCurrencyType();
                    const { username, transferdAmount } = await this.askForTransferDetails();
                    this.myBank.transferFund(username, transferdAmount, this.currentAccountIndex);
                    this.displayMenu();
                    break;
                case '5':
                    this.changePasswordMenu();
                    break;
                case '6':
                    console.log('Exiting the application...');
                    this.login();
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
                    this.displayMenu();
            }
        });
    }

    askUserForCurrencyType() {
        return new Promise((resolve) => {
            rl.question("Please enter your preferred currency type\n1. Dollar $\n2. Dinar د.إ\n3. ILS ₪\n", (currency) => {
                this.handleCurrencyTypeSelection(currency)
                resolve(currency);
            });
        });
    }

    handleCurrencyTypeSelection(choice) {
        switch (choice) {
            case '1': this.currentCurrencyType = "Dollar";
                break;
            case '2': this.currentCurrencyType = "Dinar";
                break;
            case '3': this.currentCurrencyType = "ILS";
                break;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }


    cashWithDrawMenue() {
        console.log(' Select Amount ');
        console.log(`1. ${this.myBank.accounts[this.currentAccountIndex].currencyType.icon}100`);
        console.log(`2. ${this.myBank.accounts[this.currentAccountIndex].currencyType.icon}200`);
        console.log(`3. ${this.myBank.accounts[this.currentAccountIndex].currencyType.icon}500`);
        console.log(`4. ${this.myBank.accounts[this.currentAccountIndex].currencyType.icon}700`);
        console.log('5. other');
        console.log('6. back');
        this.handleWithdrawMenuSelection();
    }

    handleWithdrawMenuSelection() {
        rl.question('Enter your choice: ', async (choice) => {
            switch (choice) {
                case '1': this.myBank.accounts[this.currentAccountIndex].cashWithDraw(100);
                    break;
                case '2': this.myBank.accounts[this.currentAccountIndex].cashWithDraw(200);
                    break;
                case '3': this.myBank.accounts[this.currentAccountIndex].cashWithDraw(500);
                    break;
                case '4': this.myBank.accounts[this.currentAccountIndex].cashWithDraw(700);
                    break;
                case '5':
                    const amount = await this.askUserForAmount('Enter the amount you want to withdraw: ');
                    this.myBank.accounts[this.currentAccountIndex].cashWithDraw(amount);
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

    changePasswordMenu() {
        console.log("Your new password should meet the following criteria:");
        console.log("- Be at least 8 characters long");
        console.log("- Include at least one lowercase letter");
        console.log("- Include at least one uppercase letter");
        console.log("- Include at least one special character");

        rl.question('current password : ', (currentPassword) => {
            rl.question('Enter your password: ', (newPassword) => {
                const updatePasswordStatus = this.myBank.accounts[this.currentAccountIndex].changePassword(currentPassword, newPassword);

                updatePasswordStatus ? this.displayMenu() : this.changePasswordMenu();

            });
        });
    }


}


