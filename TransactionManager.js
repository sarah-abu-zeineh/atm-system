export class TransactionManager {
    constructor(bank) {
        this.myBank = bank;
    }

    balanceInquiry(currentAccountIndex, callback) {
        console.clear();
        this.myBank.accounts[currentAccountIndex].displayBalance();
        
        callback();
    }

}
