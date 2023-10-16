import {Bank} from "./Bank.mjs";
import {AccountsArray} from './utils/AccountsArray.mjs';

const myBank = new Bank("Hebron Islamic Bank");

const account = {
    "userName": "cyurukhin0",
    "password": "eG0<()_E",
    "firstName": "Cherlyn",
    "lastName": "Yurukhin",
    "email": "cyurukhin0@walmart.com",
    "gender": "Female",
    "lastInteract": "3/20/2023",
    "currencyType": "$"
}

AccountsArray.forEach(account => {
    myBank.createAccount(account)
})
console.log(myBank.accounts)
