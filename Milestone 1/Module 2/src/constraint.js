"use strict";
const student1 = {
    id: 1,
    name: "Saadman Fuad",
    age: 25,
    course: "TypeScript",
    hasCar: true,
};
const student2 = {
    id: 2,
    name: "Alice Smith",
    age: 30,
    course: "JavaScript",
    hasCar: false,
    isMarried: true,
};
const addStudentToCourse = (studentInfo) => {
    return {
        course: "TypeScript",
        ...studentInfo,
    };
};
const student3 = {
    hasWatch: true,
    isEmployed: false,
};
const result = addStudentToCourse(student1);
console.log(result);
const result2 = addStudentToCourse(student2);
console.log(result2);
const result3 = addStudentToCourse(student3);
console.log(result3);
