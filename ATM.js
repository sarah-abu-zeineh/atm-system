import { generateUniqueId } from "./helpers/helper.js";

export class ATM {
    constructor(balance, location, currencyType) {
        this.id = + generateUniqueId();
        this.balance = balance;
        this.location = location;
        this.currentAccount = null;
        this.currencyType = currencyType;
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
        const conversionRates = {
            DinarToDollar: 1.41,
            DinarToILS: 5.68,
            ILSToDinar: 0.18,
            ILSToDollar: 0.25,
            DollarToILS: 4.03,
            DollarToDinar: 0.71
        };

        if (fromCurrency === toCurrency) {
            return amount;
        }

        const conversionKey = `${fromCurrency}To${toCurrency}`;
        if (conversionRates.hasOwnProperty(conversionKey)) {
            return amount * conversionRates[conversionKey];
        }
    }
}
