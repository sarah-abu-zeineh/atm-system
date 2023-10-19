import {generateUniqueId} from "./helpers/helper.js";

import {Account} from "./Account.js";
import {ATM} from "./ATM.js";

import {ATMs} from "./utils/ATMsArrya.js";
import {AccountsArray} from "./utils/AccountsArray.js";

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

    getAccountIndex(userName) {
        return this.accounts.findIndex(account => account.userName === userName);
    }

    getAccount(user_name, password) {
        return this.accounts.find(account => account.userName === user_name && account.password === password);
    }

    isAccountValid(userName) {
        const accountIndex = this.accounts.findIndex(user => user.userName === userName);

        return accountIndex > -1 ? accountIndex : console.log(`${userName} didn't found`);

    }

    transferFund(userName, fund, currentAccountIndex) {
        if (this.isAccountValid(userName)) {
            const account = this.accounts.find(user => user.userName === userName);

            account.balance += + fund;
            this.accounts[currentAccountIndex].balance -= + fund;
        } else {
            console.log("User with the provided username does not exist");
        }
    }

    addATM(atm) {
        return new ATM(atm.balance, atm.location, atm.currencyType);
    }

    getAtm(atmIndex) {
        return this.atms[atmIndex - 1];
    }

    findATMsWithFunds(amount, toCurrency) {
        return this.atms.filter(atm => this.currencyExchange(atm.balance, amount, atm.currencyType.code, toCurrency));
    }

    currencyExchange(atmBalance, amount, fromCurrency, toCurrency) {
        const conversionRates = {
            DinarToDollar: 1.41,
            DinarToILS: 5.68,
            ILSToDinar: 0.18,
            ILSToDollar: 0.25,
            DollarToILS: 4.03,
            DollarToDinar: 0.71
        };
    
        if (fromCurrency === toCurrency && atmBalance >= amount) {
            return true;
        }
    
        const conversionKey = `${fromCurrency}To${toCurrency}`;
        if (conversionRates.hasOwnProperty(conversionKey)) {
            const exchangeRate = conversionRates[conversionKey];
            const newAtmBalance = exchangeRate * atmBalance;
            
            if (newAtmBalance >= amount) {
                return true;
            }
        }
    
        return false;
    }
    

}
