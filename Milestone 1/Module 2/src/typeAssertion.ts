let anything : any;

anything =  222;

(anything as number).toFixed(2);

anything = "Hello, TypeScript!";


const kgToGram = (input: number | string) : string|number|undefined => {
    if (typeof input === "number") {
        return input * 1000;
    } else if (typeof input === "string") {
        const [value] = input.split(" ");
        return `Converted Output is : ${Number(value) * 1000}`;
    }

    throw new Error("Invalid input type. Expected a number or a string.");
}

console.log(kgToGram(2) as number);
console.log(kgToGram("2 kg") as string);