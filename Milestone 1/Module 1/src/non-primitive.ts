let bazarList: string[] = ["apple", "banana", "orange"];
console.log(bazarList);
bazarList.push("grape");
// bazarList.push(12); // This would cause a type error
console.log(bazarList);

let mixedArray: (string | number)[] = ["hello", 42, "world", 3.14];
console.log(mixedArray);


let numbers: [number, number] = [20, 30];
console.log(numbers);

let user : {
    //organization: 'OpenAI', //literal type
    readonly organization: string, // Readonly property
    firstName: string,
    middleName?: string, // Optional property
    lastName: string,
    age: number,
    isAdmin: boolean
} = {
    organization: 'OpenAI',
    firstName: 'Saadman',
    lastName: 'Fuad',
    age: 25,
    isAdmin: true
}
console.log(user);

//user.organization='OpenAI2';