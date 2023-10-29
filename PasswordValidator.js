export class PasswordValidator {
    static displayPasswordCriteria() {
        console.log("- Be at least 8 characters long");
        console.log("- Include at least one lowercase letter");
        console.log("- Include at least one uppercase letter");
        console.log("- Include at least one special character");
    }

    static validatePassword(newPassword) {
        const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).+$");
       
        if (pattern.test(newPassword) && newPassword.trim().length >= 6) {
            return true;
        } else {
            console.log("Enter a valid password");

            return false
        }
    }
}