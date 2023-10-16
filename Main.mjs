import {Bank} from "./Bank.mjs";

const myBank = new Bank("Hebron Islamic Bank");

console.log(myBank.accounts[0].cashWithDraw(1000))
