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

    cashWithDraw(amountToWithDraw, atmBalance) {
        if (amountToWithDraw < this.balance && atmBalance >= amountToWithDraw) {
            this.balance = this.balance - amountToWithDraw;
            atmBalance -= amountToWithDraw;
            console.log(`Your new Balance is ${this.balance
                }`);
            return atmBalance;
        }
        console.log(`Insufficient Balance`);
        return ;
    }

    displayBalance() {
        console.log(`${this.firstName
            }'s balance: ${this.currencyType.icon
            }${this.balance
            }`);
    }

    cashDeposit(fund, atmBalance) {
        if (fund > 0) {
            this.balance += fund;
            atmBalance += fund;
            return atmBalance;
        } else {
            console.log("Please enter a positve number!")
        }
    }

    changePassword(currentPassword, newPassword) {
        const hashedNewPassword = generateHashPassword(newPassword);
        const hashedCurrentPassword = generateHashPassword(currentPassword);

        if (this.password !== hashedCurrentPassword) {
            console.log("Password you enter match the previous one.\nPlease enter another one!");

            return false;
        } else if (this.password === hashedCurrentPassword) {
            const updatePasswordStatus = this.checkNewPassword(newPassword, hashedNewPassword);

            return updatePasswordStatus;
        }

        return false;
    }

    checkNewPassword(password, hashedPassword) {
        const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).+$");

        if (pattern.test(password) && password.trim().length >= 6) {
            this.password = hashedPassword;
            console.log("Password updated successfully");

            return true;
        } else {
            console.log("Enter a valid password");

            return false
        }
    }

    checkUserBirthday() {
        const userBirthday = new Date(this.dob);
        const todaysDate = new Date();

        if (todaysDate.getDate() === userBirthday.getDate() && todaysDate.getMonth() === userBirthday.getMonth()) {
            console.log(`🎂 HAPPY BIRTHDAY ${this.firstName} 🎉`);
        }
    }


}
