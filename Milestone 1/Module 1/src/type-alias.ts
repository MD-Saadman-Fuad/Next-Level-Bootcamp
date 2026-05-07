type User = {
    id:number,
    name:{
        firstName: string,
        lastName: string
    },
    gender: "male" | "female",
    contactNo: string,
    address: {
        division: string,
        district: string,
        upazila: string,
    }
}
const user : User  = {
    id: 1,
    name: {
        firstName: "John",
        lastName: "Doe"
    },
    gender: "male",
    contactNo: "1234567890",
    address: {
        division: "Dhaka",
        district: "Dhaka",
        upazila: "Mirpur"
    }
}

// function

type AddFunction = (num1: number, num2: number) => number;

const add : AddFunction = (num1, num2) => num1+num2