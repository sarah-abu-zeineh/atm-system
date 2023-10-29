export class CurrencyConverter {
    static conversionRates = {
        DinarToDollar: 1.41,
        DinarToILS: 5.68,
        ILSToDinar: 0.17605,
        ILSToDollar: 0.2481,
        DollarToILS: 4.03,
        DollarToDinar: 0.71605
    };

    static convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) {
            return amount;
        }

        const conversionKey = `${fromCurrency}To${toCurrency}`;

        if (CurrencyConverter.conversionRates.hasOwnProperty(conversionKey)) {
            return amount * CurrencyConverter.conversionRates[conversionKey];
        }
    }

    static currencyExchange(atm, amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency && atm.balance >= amount) {
            return atm;
        }

        const conversionKey = `${toCurrency}To${fromCurrency}`;

        if (CurrencyConverter.conversionRates.hasOwnProperty(conversionKey)) {
            const exchangeRate = CurrencyConverter.conversionRates[conversionKey];
            const newAtmBalance = exchangeRate * atm.balance;

            if (newAtmBalance >= amount) {
                return atm;
            }
        }

        return false;
    }
}
