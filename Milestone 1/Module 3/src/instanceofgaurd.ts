class Person {
    name: string;

    constructor (name: string) {
        this.name = name;
    }


    getSleep(numberOfHours: number): void {
        console.log(`${this.name} sleeps for ${numberOfHours} hours.`);
    }
}

class Student extends Person {

    constructor(name: string) {
        super(name);
    }

    study() {
        console.log(`${this.name} is studying.`);
    }

}


class Teacher extends Person {

    constructor(name: string) {
        super(name);
    }

    teach(Hours: number) {
        console.log(`${this.name} is teaching for ${Hours} hours.`);
    }
}


const isStudent = (user: Person)=> {
    return user instanceof Student;
}

const isTeacher = (user: Person) => {
    return user instanceof Teacher;
}

const getUserInfo = (user: Person) => {
    if ( isStudent(user)) {
        console.log(`Student Name: ${user.name}`);
        user.study();
    } else if (isTeacher(user)) {
        console.log(`Teacher Name: ${user.name}`);
        user.teach(3);
    } else {
        console.log(`Person Name: ${user.name}`);
    }
}
const student = new Student("Alice");
const teacher = new Teacher("Bob");
const person = new Person("Charlie");

getUserInfo(student);
getUserInfo(teacher);
getUserInfo(person);