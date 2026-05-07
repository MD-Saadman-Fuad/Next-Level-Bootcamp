// ? : ternary operator
// ?? : nullish coalescing operator //null or undefined wil set default value
// ?. : optional chaining operator

const userAge = 21;


const isAdult = (age: number) => {
    // if (age >= 18) {
    //     return "You are an adult.";
    // } else {
    //     return "You are a minor.";  
    // }   

    const result = age >= 21 ? "You are an adult." : "You are a minor.";
    return result;
}

console.log(isAdult(userAge));


const userTheme = "green"; //or null/undefined

const theme = userTheme ?? "light";

console.log(theme);


const isAuthenticated = false;

const resultIsAuthenticated = isAuthenticated ? "Welcome back!" : "Please log in.";

console.log(resultIsAuthenticated);

const resultIsAuthenticated2 = isAuthenticated ?? "Please log in.";

console.log(resultIsAuthenticated2);

//optional chaining

const user : {
    address: {
        city: string;
        district?: string;
        postalCode?: string;
    }
} = {
    address: {
        city: "Dhaka",
    },
}


const postlCode = user?.address?.postalCode ?? "Postal code not available";

console.log(postlCode);