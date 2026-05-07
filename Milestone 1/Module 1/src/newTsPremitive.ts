//nullable ,unknown ,never

const getrUser = (input:string | null | undefined) => {
    if ( input){
        console.log("User found: " + input);
    }
    else {
        console.log("User not found");
    }
}

getrUser("Saadman Fuad");
getrUser(null);
getrUser(undefined);

//unknown

const productDiscount = (input: unknown) => {
    if (typeof input === "number") {
        console.log("Discount is: " + input + "%");
    }
    else if (typeof input === "string") {
        console.log("Discount is: " + input);
    }
    else {        console.log("Invalid discount value");
    }
}

productDiscount(20);
productDiscount("20%");
productDiscount(true);
productDiscount(null);


//void and never

const errorMsg = (msg: string) : never => {
    throw new Error("Error: " + msg);
}

errorMsg("Something went wrong!");