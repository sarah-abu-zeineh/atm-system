import {Bank} from "./Bank.js";

import {generateHashPassword} from "./helpers/helper.js"

import * as readline from "readline";

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

export class UserInterface {
    constructor() {
        this.myBank = new Bank("Arab Bank");
        this.atm = null;
        this.currentAccount = -1;
        this.currentAccountIndex = -1;
        this.convertedAmount = null;
        this.currentATMIndex = -1;
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

        console.log('-- Select Transaction--');
        console.log('1. Balance Inquiry');
        console.log('2. Cash Withdrawal');
        console.log('3. Deposit');
        console.log('4. Transfer Fund');
        console.log('5. Change Password');
        console.log('6. Exit');

        this.handleMenuSelection();
    }

    handleMenuSelection() {
        rl.question('Enter your choice: ', async (choice) => {
            switch (choice) {
                case '1':
                    this.myBank.accounts[this.currentAccountIndex].displayBalance();
                    this.displayMenu();
                    break;
                case '2':
                    await this.askUserForCurrencyType();
                    this.cashWithDrawMenu();
                    break;
                case '3':
                    await this.askUserForCurrencyType();
                    const amount = await this.askUserForAmount('Enter the amount you want to deposit: ');
                    const amountForAtm = this.atm.convertCurrency(amount, this.currentCurrencyType, this.atm.currencyType.code);
                    
                    this.convertedAmount = this.atm.convertCurrency(amount, this.currentCurrencyType, this.currentAccount.currencyType.code,)
                    this.myBank.atms[this.currentATMIndex].balance = this.currentAccount.cashDeposit(this.convertedAmount, amountForAtm, this.atm.balance);
                    this.displayMenu();
                    break;
                case '4':
                    this.handleTransfer();
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

    async handleTransfer() {
        await this.askUserForCurrencyType();
        const {userName, transferAmount: transferAmount} = await this.askForTransferDetails();

        let transferredAccountInfo = this.getInfoAboutTransferredAccount(userName);

        while (transferredAccountInfo === false) {
            await this.askUserForCurrencyType();
            const {userName, transferAmount: transferAmount} = await this.askForTransferDetails();

            transferredAccountInfo = this.getInfoAboutTransferredAccount(userName);
        }

        const convertedTransferredAmount = this.atm.convertCurrency(transferAmount, this.currentCurrencyType, transferredAccountInfo[1]);
        const convertedAccountBalance = this.atm.convertCurrency(convertedTransferredAmount, this.currentAccount.currencyType.code, this.currentCurrencyType);
        const isBalanceUpdate = this.myBank.accounts[this.currentAccountIndex].subtractAmountFromBalance(convertedAccountBalance);

        if (isBalanceUpdate) {
            const transferredAccountIndex = transferredAccountInfo[0];
            
            this.myBank.accounts[transferredAccountIndex].balance += +convertedTransferredAmount;
            console.log('Transaction was successful.');
        } else {
            console.log('Something went wrong. Please try again later.');
        }

        this.displayMenu();
    }

    getInfoAboutTransferredAccount(userName) {
        const accountIndex = this.myBank.isAccountValid(userName);

        if (accountIndex > -1) {
            return [accountIndex, this.myBank.accounts[accountIndex].currencyType.code];
        } else {
            return false;
        }
    }

    askUserForCurrencyType() {
        return new Promise((resolve) => {
            rl.question("Please enter your preferred currency type\n1. Dollar $\n2. Dinar د.إ\n3. ILS ₪\n", (currency) => {
                this.handleCurrencyTypeSelection(currency).then(() => {
                    resolve(currency);
                });
            });
        });
    }

    handleCurrencyTypeSelection(choice) {
        return new Promise((resolve) => {
            switch (choice) {
                case '1':
                    this.currentCurrencyType = "Dollar";
                    resolve();
                    break;
                case '2':
                    this.currentCurrencyType = "Dinar";
                    resolve();
                    break;
                case '3':
                    this.currentCurrencyType = "ILS";
                    resolve();
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
                    this.askUserForCurrencyType().then(resolve);
            }
        });
    }

    cashWithDrawMenu() {
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
            let  amount = 0;
            switch (choice) {
                case '1':
                    amount = 100;
                    this.convertedAmount = this.atm.convertCurrency(100, this.currentCurrencyType, this.currentAccount.currencyType.code);
                    break;
                case '2':
                    amount = 200;
                    this.convertedAmount = this.atm.convertCurrency(200, this.currentCurrencyType, this.currentAccount.currencyType.code);
                    break;
                case '3':
                    amount = 500;
                    this.convertedAmount = this.atm.convertCurrency(500, this.currentCurrencyType, this.currentAccount.currencyType.code);
                    break;
                case '4':
                    amount = 700;
                    this.convertedAmount = this.atm.convertCurrency(700, this.currentCurrencyType, this.currentAccount.currencyType.code);
                    break;
                case '5':
                    amount = await this.askUserForAmount('Enter the amount you want to withdraw: ');

                    this.convertedAmount = this.atm.convertCurrency(amount, this.currentCurrencyType, this.currentAccount.currencyType.code);
                    break;
                case '6':
                    this.displayMenu();
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
            }

            this.withdrawFromATM(amount);
        });

    }

    withdrawFromATM(amount) {
        const atmBalanceConversion = this.atm.convertCurrency(this.atm.balance, this.atm.currencyType.code, this.currentCurrencyType);
        const newBalanceInfo = this.myBank.accounts[this.currentAccountIndex].cashWithDraw(this.convertedAmount, atmBalanceConversion, amount);
        
        if (newBalanceInfo[2]) {
            const updatedAtmBalance = this.atm.convertCurrency(newBalanceInfo[0], this.currentCurrencyType, this.atm.currencyType.code);

            this.currentATMIndex = this.myBank.getAtmIndex(this.atm);
            this.myBank.atms[this.currentATMIndex].balance = updatedAtmBalance;
            this.displayMenu();
        } else if (newBalanceInfo[2] === false) {
            this.findATMsWithFunds(newBalanceInfo[1], this.currentCurrencyType);
        } else {
            this.displayMenu();
        }
    }
    askForTransferDetails() {
        return new Promise((resolve) => {
            rl.question('Enter the username of the recipient: ', (userName) => {
                rl.question('Enter the amount to transfer: ', (transferAmount) => {
                    resolve({userName, transferAmount: transferAmount});
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

        rl.question('current password: ', (currentPassword) => {
            rl.question('Enter your password: ', (newPassword) => {
                const updatePasswordStatus = this.myBank.accounts[this.currentAccountIndex].changePassword(currentPassword, newPassword);

                updatePasswordStatus ? this.displayMenu() : this.changePasswordMenu();

            });
        });
    }

    findATMsWithFunds(amount, currencyTypeCode) {
        console.log("Sorry About that\nYou can choose on of these ATMs which your balance available based on yours.");

        const availableATMs = this.myBank.findATMsWithFunds(amount, currencyTypeCode);

        availableATMs.forEach((atm, index) => {
            console.log(`${index + 1}. ${atm.location}`);
        })

        rl.question('Enter your choice: ', (atmIndex) => {
            const selectedATM = availableATMs[atmIndex - 1];

            if (selectedATM === undefined) {
                console.log("Please select one of the available ATMs!!!");
                this.availableATMs();
            } else {
                this.atm = selectedATM;
                this.currentATMIndex = this.myBank.getAtmIndex(this.atm);
                this.displayMenu();
            }
        });
    }
}
