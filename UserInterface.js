import {Bank} from "./Bank.js";

import {Authenticator} from "./Authenticator.js";
import {PasswordValidator} from "./PasswordValidator.js";
import {TransactionManager} from "./TransactionManager.js";
import {CurrencyConverter} from "./CurrencyConverter.js";

import * as readline from "readline";

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

export class UserInterface {
    constructor() {
        this.myBank = new Bank("Arab Bank");
        this.authenticator = new Authenticator(this.myBank);
        this.transactionManager = new TransactionManager(this.myBank);
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
        rl.question('Enter your username: ', (userName) => {
            rl.question('Enter your password: ', (password) => {
                this.authenticator.authenticateUser(userName, password, this.handleLoginResult.bind(this));
            });
        });
    }

    handleLoginResult(userAccount, userAccountIndex) {
        if (userAccount) {
            console.log('Login successful.');
            this.currentAccount = userAccount;
            this.currentAccountIndex = userAccountIndex;
            this.displayMenu();
        } else {
            console.clear();
            console.log('Login failed.');
            this.login();
        }
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
                case MenuOptions.BALANCE_INQUIRY:
                    this.transactionManager.balanceInquiry(this.currentAccountIndex, this.displayMenu.bind(this));
                    break;
                case MenuOptions.CASH_WITHDRAWAL:
                    await this.askUserForCurrencyType();
                    this.cashWithDrawMenu();
                    break;
                case MenuOptions.CASH_DEPOSIT:
                    await this.askUserForCurrencyType();
                    const amount = await this.askUserForAmount('Enter the amount you want to deposit: ');
                    this.transactionManager.performDeposit(amount, this.atm, this.currentCurrencyType, this.currentAccount, this.currentATMIndex, this.displayMenu.bind(this))
                    break;
                case MenuOptions.CASH_WITHDRAWAL:
                    // this.handleTransfer();
                    break;
                case MenuOptions.TRANSFER_FUND:
                    this.changePasswordMenu();
                    break;
                case MenuOptions.EXIT:
                    console.log('Exiting the application...');
                    // this.login();
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
                    // this.displayMenu();
            }
        });
    }


    // async handleTransfer() {
    //     await this.askUserForCurrencyType();
    //     const {userName, transferAmount: transferAmount} = await this.askForTransferDetails();

    //     let transferredAccountInfo = this.getInfoAboutTransferredAccount(userName);

    //     while (transferredAccountInfo === false) {
    //         await this.askUserForCurrencyType();
    //         const {userName, transferAmount: transferAmount} = await this.askForTransferDetails();

    //         transferredAccountInfo = this.getInfoAboutTransferredAccount(userName);
    //     }

    //     const convertedTransferredAmount = this.atm.convertCurrency(transferAmount, this.currentCurrencyType, transferredAccountInfo[1]);
    //     const convertedAccountBalance = this.atm.convertCurrency(convertedTransferredAmount, this.currentAccount.currencyType.code, this.currentCurrencyType);
    //     const isBalanceUpdate = this.myBank.accounts[this.currentAccountIndex].subtractAmountFromBalance(convertedAccountBalance);

    //     if (isBalanceUpdate) {
    //         const transferredAccountIndex = transferredAccountInfo[0];

    //         this.myBank.accounts[transferredAccountIndex].balance += +convertedTransferredAmount;
    //         console.log('Transaction was successful.');
    //     } else {
    //         console.log('Something went wrong. Please try again later.');
    //     }

    //     this.displayMenu();
    // }

    // getInfoAboutTransferredAccount(userName) {
    //     const accountIndex = this.myBank.isAccountValid(userName);

    //     if (accountIndex > -1) {
    //         return [accountIndex, this.myBank.accounts[accountIndex].currencyType.code];
    //     } else {
    //         return false;
    //     }
    // }

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
                case currencyOptions.DOLLAR:
                    this.currentCurrencyType = "Dollar";
                    resolve();
                    break;
                case currencyOptions.DINAR:
                    this.currentCurrencyType = "Dinar";
                    resolve();
                    break;
                case currencyOptions.ILS:
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
            let amount = 0;
            switch (choice) {
                case WithdrawalOptions.OPTION_1: 
                    amount = 100;
                    break;
                case WithdrawalOptions.OPTION_2:    
                    amount = 200;
                    break;
                case WithdrawalOptions.OPTION_3: 
                    amount = 500;
                    break;
                case WithdrawalOptions.OPTION_4:    
                    amount = 700;
                    break;
                case WithdrawalOptions.CUSTOM: 
                    amount = await this.askUserForAmount('Enter the amount you want to withdraw: ');
                    break;
                case WithdrawalOptions.BACK:
                    this.displayMenu();
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
            }

            this.convertedAmount = CurrencyConverter.convertCurrency(amount, this.currentCurrencyType, this.currentAccount.currencyType.code);
            this.transactionManager.withdrawFromATM(this.atm, this.currentCurrencyType, amount, this.convertedAmount, this);
        });
    }

    handleATMSelection(availableATMs) {
        console.log("hi")
        rl.question('Enter your choice: ', (atmIndex) => {
            const selectedATM = availableATMs[atmIndex - 1];

            if (selectedATM === undefined) {
                console.log("Please select one of the available ATMs!!!");
                handleATMSelection(); 
            } else {
                this.atm = selectedATM;
                this.currentATMIndex = this.myBank.getAtmIndex(selectedATM);
                this.displayMenu();
            }
        });
    };

    // askForTransferDetails() {
    //     return new Promise((resolve) => {
    //         rl.question('Enter the username of the recipient: ', (userName) => {
    //             rl.question('Enter the amount to transfer: ', (transferAmount) => {
    //                 resolve({userName, transferAmount: transferAmount});
    //             });
    //         });
    //     });
    // }

    askUserForAmount(message) {
        return new Promise((resolve) => {
            rl.question(message, (amount) => {
                resolve(Number(amount));
            });
        });
    }

    changePasswordMenu() {
        console.log("Your new password should meet the following criteria:");
        PasswordValidator.displayPasswordCriteria();

        rl.question('current password: ', (currentPassword) => {
            rl.question('Enter your password: ', (newPassword) => {
                if (PasswordValidator.validatePassword(newPassword)) {
                    this.authenticator.changePassword(currentPassword, newPassword, this.handleChangePasswordResult.bind(this));
                } else {
                    this.changePasswordMenu();
                }
            });
        });
    }

    handleChangePasswordResult(changePasswordStatus) {
        changePasswordStatus ? this.displayMenu() : this.changePasswordMenu();
    }

}

const MenuOptions = {
    BALANCE_INQUIRY: '1',
    CASH_WITHDRAWAL: '2',
    CASH_DEPOSIT: '3',
    TRANSFER_FUND: '4',
    CHANGE_PASSWORD: '5',
    EXIT: '6'
};

const currencyOptions = {
    DOLLAR: '1',
    DINAR: '2',
    ILS: '3'
};

const WithdrawalOptions = {
    OPTION_1: '1',
    OPTION_2: '2',
    OPTION_3: '3',
    OPTION_4: '4',
    CUSTOM: '5',
    BACK: '6'
};
