import {generateUniqueId, generateHashPassword} from "./helpers/helper.js";

export class Account {
    constructor(account) {
        this.id = generateUniqueId();
        this.userName = account.userName;
        this.password = generateHashPassword(account.password);
        this.gender = account.gender;
        this.email = account.email;
        this.firstName = account.firstName;
        this.lastName = account.lastName;
        this.balance = account.balance;
        this.lastInteract = account.lastInteract;
        this.currencyType = account.currencyType;
    }

    cashWithDraw(amountToWithDraw) {
        if (amountToWithDraw < this.balance) {
            this.balance = this.balance - amountToWithDraw;

            console.log(`Your new Balance is ${
                this.balance
            }`);
            return;
        }
        console.log(`Insufficient Balance`);
    }

    displayBalance() {
        console.log(`${
            this.firstName
        }'s balance: ${
            this.currencyType.icon
        }${
            this.balance
        }`);
    }

    cashDeposit() {}

    changePassword(currentPassword, newPassword) {
        const hashedNewPassword = generateHashPassword(newPassword);
        const hashedCurrentPassword = generateHashPassword(currentPassword);

        if (this.password === hashedNewPassword) {
            console.log("Password you enter match the previous one.\nPlease enter another one!");

            return true;
        } else if (this.password === hashedCurrentPassword) {
            this.checkNewPassword(newPassword, hashedNewPassword);
            
            return true;
        }

        return false;
    }

    checkNewPassword(password, hashedPassword) {
        const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).+$");
        if (pattern.test(password) && password.trim().length >= 6) {
            this.password = hashedPassword;
            console.log("Password updated successfully");
        } else {
            console.log("Enter a valid password");
        }

    }

}
