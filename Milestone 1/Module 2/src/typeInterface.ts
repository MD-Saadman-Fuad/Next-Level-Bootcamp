//we can not use primitive types like string, number, boolean, etc. as interfaces, but we can use them as type aliases.
//interface only for object type but type can be used for both object and primitive types
type User = {
    name: string;
    age: number;
}


type Role = {
    role : 'admin' | 'editor' | 'viewer';
}

type UserWithRole = User & Role;

interface IUser {
    name: string;
    age: number;
}


interface IUserWithRole extends IUser {
    role : 'admin' | 'editor' | 'viewer';
}

const user1 : UserWithRole = {
    name: "Saadman Fuad",
    age: 25,
    role: "admin",
}

const user2 : IUser = {
    name: "Alice Smith",
    age: 30,
    // role: "editor",
}

const user3 : Role = {
    // name: "Bob Johnson",
    // age: 28,
    role: "viewer",
}

//function 

type Add = (num1: number, num2: number) => number;

interface IAdd {
    (num1: number, num2: number) : number;
}

const add : Add = (num1, num2) => {
    return num1 + num2;
}