import { generateUniqueId, generateHashPassword } from "./helpers/helper.js";

export class Account {
    constructor(account) {
        this.id = + generateUniqueId();
        this.userName = account.userName;
        this.password = generateHashPassword(account.password);
        this.gender = account.gender;
        this.email = account.email;
        this.firstName = account.firstName;
        this.lastName = account.lastName;
        this.balance = account.balance;
        this.lastInteract = account.lastInteract;
        this.currencyType = account.currencyType;
        this.dob = account.birthday;
    }

    cashWithDraw(amountToWithDraw, atmBalance, ATMWithdrawalAmount) {
        if (amountToWithDraw <= this.balance && atmBalance >= amountToWithDraw) {
            this.balance -= amountToWithDraw;
            atmBalance -= +ATMWithdrawalAmount
            console.log(`Your new Balance is ${this.balance}${this.currencyType.icon}`);
            
            return [atmBalance, amountToWithDraw, true];
        } else if(amountToWithDraw > this.balance) {
            console.log(`Insufficient Balance, your balance is ${this.balance}${this.currencyType.icon}`);
            
            return [undefined];
        }
        
        return [atmBalance, amountToWithDraw, false];
    }

    displayBalance() {
        console.log('---------------------');
        console.log(`|Your balance: ${this.balance}${this.currencyType.icon}|`);
        console.log('---------------------');
    }

    cashDeposit(fund, depositAmountForAtm, atmBalance) {
        if (fund > 0) {
            this.balance += fund;
            atmBalance += depositAmountForAtm;
            this.displayBalance();

            return atmBalance;
        } else {
            console.log("Please enter a positive number!")
        }
    }

    changePassword(currentPassword, newPassword) {
        const hashedNewPassword = generateHashPassword(newPassword.trim());
        const hashedCurrentPassword = generateHashPassword(currentPassword.trim());

        if (hashedNewPassword === hashedCurrentPassword) {
            console.log("Password you enter match the previous one.\nPlease enter another one!");

            return false;
        } else {
            this.password = hashedNewPassword;
            console.log('Password updated Successfully')

            return true;
        }
    }

    checkUserBirthday() {
        const userBirthday = new Date(this.dob);
        const todaysDate = new Date();

        if (todaysDate.getDate() === userBirthday.getDate() && todaysDate.getMonth() === userBirthday.getMonth()) {
            console.log(`🎂 HAPPY BIRTHDAY ${this.firstName} 🎉`);
        }
    }

    subtractAmountFromBalance(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            console.log(`New balance: ${this.balance}${this.currencyType.icon}`);
            
            return true;
        } else {
            console.log('Insufficient balance for the transaction!');

            return false;
        }
    }
}
