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
}
