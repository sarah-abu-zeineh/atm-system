import { generateUniqueId } from "./helpers/helper.js";

import { Account } from "./Account.js";
import { ATM } from "./ATM.js";

import { ATMs } from "./utils/ATMsArrya.js";
import { AccountsArray } from "./utils/AccountsArray.js";

export class Bank {
    constructor(bankName) {
        this.id = + generateUniqueId();
        this.accounts = AccountsArray.map(account => {
            return this.createAccount(account)
        });
        this.atms = ATMs.map(atm => {
            return this.addATM(atm);
        });
        this.bankName = bankName;
    }

    createAccount(account) {
        return new Account(account)
    }

    updateBalance(amount) {
        this.balance -= amount;
    }

    getAccountIndex(userName) {
        return this.accounts.findIndex(account => account.userName === userName);
    }

    getAccount(user_name, password) {
        return this.accounts.find(account => account.userName === user_name && account.password === password);
    }

    isAccountValid(userName) {
        const accountIndex = this.accounts.findIndex(user => user.userName === userName);

        return accountIndex > -1 ? accountIndex : console.log(`User with ${userName} not found. Please try again.`);

    }

    addATM(atm) {
        return new ATM(atm.balance, atm.location, atm.currencyType);
    }

    getAtm(atmIndex) {
        return this.atms[atmIndex - 1];
    }
    
    getAtmIndex(atm) {
        return this.atms.findIndex(element => element.id == atm.id);
    }

    findATMsWithFunds(amount, toCurrency) {
        return this.atms.filter(atm => this.currencyExchange(atm, amount, toCurrency, atm.currencyType.code));
    }

    currencyExchange(atm, amount, fromCurrency, toCurrency) {

        const conversionRates = {
            DinarToDollar: 1.41,
            DinarToILS: 5.68,
            ILSToDinar: 0.17605,
            ILSToDollar: 0.2481,
            DollarToILS: 4.03,
            DollarToDinar: 0.71605,
        };

        if (fromCurrency === toCurrency && atm.balance >= amount) {
            return atm;
        }

        const conversionKey = `${toCurrency}To${fromCurrency}`;

        if (conversionRates.hasOwnProperty(conversionKey)) {
            const exchangeRate = conversionRates[conversionKey];
            const newAtmBalance = exchangeRate * atm.balance;

            if (newAtmBalance >= amount) {
                return atm;
            }
        }

        return false;
    }

}
