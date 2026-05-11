//generic Function

const createArrayWithString = (value: string) => [value];

const createArrayWithNumber = (value: number) => [value];


const arrString = createArrayWithString("Hello");
const arrNumber = createArrayWithNumber(42);


const createArrayWithGeneric = <T>(value: T) => [value];

const arrGenericString = createArrayWithGeneric<string>("Hello");
const arrGenericNumber = createArrayWithGeneric<number>(42);


const createArrayWithTuple = <T, U>(value1: T, value2: U) : [T, U] => [value1, value2];

const tuple1 = createArrayWithTuple<string, number>("Hello", 42);
const tuple2 = createArrayWithTuple<boolean, string>(true, "World");


//

const student1 = {
    name: "Saadman Fuad",
    age: 25,
    course: "TypeScript",
    hasCar: true,
}
const student2 = {
    name: "Alice Smith",
    age: 30,
    course: "JavaScript",
    hasCar: false,
    isMarried: true,
}

const addStudentToCourse = <T>(studentInfo: T) => { 
    return {
        course: "TypeScript",
        ...studentInfo,
    }
}

const result = addStudentToCourse(student1);
console.log(result);
const result2 = addStudentToCourse(student2);
console.log(result2);