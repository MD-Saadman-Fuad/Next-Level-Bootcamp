// type gaurd or type narrowing
type Alphanumeric = string | number;
const add = (num1: number, num2: number): number => {
    return num1 + num2;
}

const addOrConcatenate = (input1: Alphanumeric, input2: Alphanumeric): Alphanumeric => {
    if (typeof input1 === "number" && typeof input2 === "number") {
        return input1 + input2;
    } else {
        return input1.toString() + input2.toString();
    }
}

console.log(addOrConcatenate(5, 10));




// in gaurd 


type NormalUser = {
    name: string;
}

type AdminUser = {
    name: string;
    role: "Admin";
}


const getUserInfo = (user: NormalUser | AdminUser): void => {
    if ("role" in user) {

        console.log(`Admin User: ${user.name}, Role: ${user.role}`);
    }
        else {
        console.log(`Normal User: ${user.name}`);
    }

}

getUserInfo({ name: "John" });
getUserInfo({ name: "Jane", role: "Admin" });