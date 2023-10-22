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
        this.account = null;
        this.atm = null;
        this.currentAccount = -1;
        this.currentAccountIndex = -1;
        this.convertedAmount = null;

    }

    run() {
        console.log(`Welcome to ${this.myBank.bankName}`);

        this.chooseAtm();
    }

    chooseAtm() {
        this.displayATMsOptions();

        rl.question("Please choose an ATM by entering its number: ", (atmIndex) => {
            const selectedATM = this.myBank.getAtm(atmIndex);

            if (selectedATM === undefined) {
                console.log("Please select one of the available ATMs!!!");
                this.chooseAtm();
            } else {
                this.atm = selectedATM;
                this.currentATMIndex = this.myBank.getAtmIndex(this.atm);
                this.login();
            }
        });
    }

    displayATMsOptions() {
        console.log('Available ATMs:');

        this.myBank.atms.forEach((atm, index) => {
            console.log(`${index + 1}. ${atm.location}`);
        });

    }

    login() {
        console.log("Welcome to " + this.myBank.bankName);
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
        this.myBank.accounts[this.currentAccountIndex].checkUserBirthday();
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
                    console.log(this.myBank.atms[this.currentATMIndex].balance);
                    this.displayMenu();
                    break;
                case '2':
                    await this.askUserForCurrencyType();
                    this.cashWithDrawMenue();
                    break;
                case '3':
                    await this.askUserForCurrencyType();
                    const amount = await this.askUserForAmount('Enter the amount you want to deposite: ');
                    this.convertedAmount = this.myBank.atms[this.currentATMIndex].convertCurrency(amount, this.currentCurrencyType, this.myBank.accounts[this.currentAccountIndex].currencyType.code);
                    this.myBank.atms[this.currentATMIndex].balance = this.myBank.accounts[this.currentAccountIndex].cashDeposit(this.convertedAmount, this.myBank.atms[this.currentATMIndex].balance);
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
        console.log(`1. 100`);
        console.log(`2. 200`);
        console.log(`3. 500`);
        console.log(`4. 700`);
        console.log('5. other');
        console.log('6. back');
        this.handleWithdrawMenuSelection();
    }

    handleWithdrawMenuSelection() {
        rl.question('Enter your choice: ', async (choice) => {
            switch (choice) {
                case '1':
                    this.convertedAmount = this.myBank.atms[this.currentATMIndex].convertCurrency(100, this.currentCurrencyType, this.myBank.accounts[this.currentAccountIndex].currencyType.code);
                    break;
                case '2':
                    this.convertedAmount = this.myBank.atms[this.currentATMIndex].convertCurrency(200, this.currentCurrencyType, this.myBank.accounts[this.currentAccountIndex].currencyType.code);
                    break;
                case '3':
                    this.convertedAmount = this.myBank.atms[this.currentATMIndex].convertCurrency(500, this.currentCurrencyType, this.myBank.accounts[this.currentAccountIndex].currencyType.code);
                    break;
                case '4':
                    this.convertedAmount = this.myBank.atms[this.currentATMIndex].convertCurrency(700, this.currentCurrencyType, this.myBank.accounts[this.currentAccountIndex].currencyType.code);
                    break;
                case '5':
                    const amount = await this.askUserForAmount('Enter the amount you want to withdraw: ');
                    this.convertedAmount = this.myBank.atms[this.currentATMIndex].convertCurrency(amount, this.currentCurrencyType, this.myBank.accounts[this.currentAccountIndex].currencyType.code);
                    break;
                case '6':
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
            }
            this.myBank.atms[this.currentATMIndex].balance = this.myBank.accounts[this.currentAccountIndex].cashWithDraw(this.convertedAmount, this.myBank.atms[this.currentATMIndex].balance);
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

    findATMsWithFunds() {
        console.log("Sorry About that\nYou can choose on of these ATMs which your balance available based on yours.");

        const availableATMs = this.myBank.findATMsWithFunds("1000", "ILS");// send the values here
        availableATMs.forEach((atm, index) => {
            console.log(`${index + 1} ${atm.location}`);
        })

        rl.question('Enter your choice: ', (atmIndex) => {
            const selectedATM = this.myBank.atms[atmIndex - 1];

            if (selectedATM === undefined) {
                console.log("Please select one of the available ATMs!!!");
                this.availableATMs();
            } else {
                this.atm = selectedATM;
                this.displayMenu();
            }

        });
    }


}


