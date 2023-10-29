import {CurrencyConverter} from "./CurrencyConverter.js";

export class TransactionManager {
    constructor(bank) {
        this.myBank = bank;
    }

    balanceInquiry(currentAccountIndex, callback) {
        console.clear();
        this.myBank.accounts[currentAccountIndex].displayBalance();

        callback();
    }

    withdrawFromATM(atm, currentCurrencyType, amount, convertedAmount, callback) {
        const atmBalanceConversion = CurrencyConverter.convertCurrency(atm.balance, atm.currencyType.code, currentCurrencyType);
        const newBalanceInfo = this.myBank.accounts[callback.currentAccountIndex].cashWithDraw(convertedAmount, atmBalanceConversion, amount);

        if (newBalanceInfo[2]) {
            this.updateATMBalance(atm, currentCurrencyType, newBalanceInfo[0]);
            
            callback.displayMenu();
        } 
        else if (newBalanceInfo[2] === false) {
            this.findATMsWithFunds(callback, newBalanceInfo[1], currentCurrencyType);
        } else {
            callback.displayMenu();
        }
    }

    updateATMBalance(atm, currentCurrencyType, updatedBalance) {
        const updatedAtmBalance = CurrencyConverter.convertCurrency(updatedBalance, currentCurrencyType, atm.currencyType.code);
        const currentATMIndex = this.myBank.getAtmIndex(atm);
        
        this.myBank.atms[currentATMIndex].balance = updatedAtmBalance;
    }

    findATMsWithFunds(callback, amount, currencyTypeCode) {
        console.log("Sorry about that. You can choose one of these ATMs with your balance available based on yours.");
        const availableATMs = this.myBank.findATMsWithFunds(amount, currencyTypeCode);

        availableATMs.forEach((atm, index) => {
            console.log(`${index + 1}. ${atm.location }`);
        });
    
        callback.handleATMSelection(availableATMs);
    }

    performDeposit(amount, atm, currentCurrencyType, currentAccount, currentATMIndex, callback){
        const amountForAtm = CurrencyConverter.convertCurrency(amount, currentCurrencyType, atm.currencyType.code);
        const convertedAmount = CurrencyConverter.convertCurrency(amount, currentCurrencyType, currentAccount.currencyType.code,)
        
        this.myBank.atms[currentATMIndex].balance = currentAccount.cashDeposit(convertedAmount, amountForAtm, atm.balance);
        
        callback();           
    }

    performTransferFund(transferAmount, currentCurrencyType, currentAccountIndex, currentAccount, transferredAccountInfo,callback) {
        const convertedTransferredAmount = CurrencyConverter.convertCurrency(transferAmount, currentCurrencyType, transferredAccountInfo[1]);
        const convertedAccountBalance = CurrencyConverter.convertCurrency(convertedTransferredAmount, currentAccount.currencyType.code, currentCurrencyType);
        const isBalanceUpdate = this.myBank.accounts[currentAccountIndex].subtractAmountFromBalance(convertedAccountBalance);

        if (isBalanceUpdate) {
            const transferredAccountIndex = transferredAccountInfo[0];

            this.myBank.accounts[transferredAccountIndex].balance += + convertedTransferredAmount;
            console.log('Transaction was successful.');
        } else {
            console.log('Something went wrong. Please try again later.');
        }

        callback();
    }
}
