// keyof : A TypeScript operator that retrieves the keys of a type as a union of string literal types.

type RichPeopleCar = {
    car: string;
    bike: string;
    cng: string;
}


type MyVehicle = "car" | "bike" | "cng";

type myVehicle2 = keyof RichPeopleCar; // "car" | "bike" | "cng"

// The keyof operator is used to create a new type (myVehicle2) that represents the keys of the RichPeopleCar type. 
// In this case, myVehicle2 will be a union of string literal types "car", "bike", and "cng".

const myVehicles: MyVehicle = "car"; // Valid
const myVehicles2: myVehicle2 = "bike"; // Valid
// const myVehicles3: MyVehicle = "bus"; // Error: Type '"bus"' is not assignable to type 'MyVehicle'.
// const myVehicles4: myVehicle2 = "bus"; // Error: Type '"bus"' is not assignable to type 'myVehicle2'.

type User = {
    id: number;
    name: string;
    address: {
        street: string;
        city: string;
        country: string;
    }
}

type Prduct = {
    id: number;
    name: string;
    price: number;
}



const user: User = {
    id: 1,
    name: "John Doe",
    address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA"
    }
}

const product: Prduct = {
    id: 1,
    name: "Laptop",
    price: 999.99
}

// const myName = user.name; // "John Doe"
// const myStreet = user.address.street; // "123 Main St"


const getProperty = <X>(obj: X, key: keyof X) => {

    return obj[key]
}

const result = getProperty(product, "name"); // TypeScript will throw an error because the type of obj is object and it does not have an index signature.
// To fix this, we can use a generic type to specify the type of the object and the key:

console.log(result); // "John Doe"
