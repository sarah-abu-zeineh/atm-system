export const generateUniqueId = (allData) => {
    const uniqueId = Math.floor((Math.random() * 99) + 1).toString() + new Date().getMilliseconds();
    const isUsedBefore = allData?.some(item => item.id === uniqueId);

    if (isUsedBefore) {
        return generateUniqueId();
    } else {
        return uniqueId;
    }
}