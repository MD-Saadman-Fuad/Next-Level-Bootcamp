//dynamically generalized

type GenericArray<T> = Array<T>;


const friends : GenericArray<string> = ["Alice", "Bob", "Charlie"];
const roleNumbers : GenericArray<number> = [1, 2, 3, 4, 5];
const isEligible : GenericArray<boolean> = [true, false, true, true];

type Coordinate<X, Y> = [X, Y]

const coordinate1 : Coordinate<number, number> = [10, 20];
const coordinate2 : Coordinate<string, string> = ["10", "20"];
const coordinate3 : Coordinate<number, string> = [10, "20"];

type UserG = {name:string, age:number, role:string};

const userList : GenericArray<UserG>= [
    {
        name: "Saadman Fuad",
        age: 25,
        role: "admin",
    },
    {
        name: "Alice Smith",
        age: 30,
        role: "editor",
    },
    
]