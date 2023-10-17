export const generateUniqueId = (allData) => {
    const uniqueId = Math.floor((Math.random() * 99) + 1).toString() + new Date().getMilliseconds();
    const isUsedBefore = allData?.some(item => item.id === uniqueId);

    if (isUsedBefore) {
        return generateUniqueId();
    } else {
        return uniqueId;
    }
}

export const generateHashPassword = (password) =>{
    const primeNumber = 31;
    let counter = 0;
    const hashedPassword = password.split('').reduce((accumulator, currentValue) => {
        accumulator = (accumulator + currentValue.charCodeAt(0)) ^ (Math.pow(primeNumber, counter));
        counter++;

        return accumulator;
    }, 0);

    return hashedPassword;
}