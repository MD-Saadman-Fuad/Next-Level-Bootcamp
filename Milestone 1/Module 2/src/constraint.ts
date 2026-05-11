const student3 = {
    id:3,
    name: "Saadman Fuad",
    age: 25,
    course: "TypeScript",
    hasCar: true,
}
const student4 = {
    id: 4,
    name: "Bob Johnson",
    age: 28,
    course: "JavaScript",
    hasCar: false,
    isMarried: true,
}

type Student = {
    id: number;
    name: string;
}

const addStudentToCourse1 = <T extends { id: number, name: string }>(studentInfo: T) => { 
    return {
        course: "TypeScript",
        ...studentInfo,
    }
}

const student5 = {
    hasWatch: true,
    isEmployed: false,
}

const result1 = addStudentToCourse1(student3);
console.log(result1);
const result4 = addStudentToCourse1(student4);
console.log(result4);
const result5 = addStudentToCourse1(student5);
console.log(result5);
