

class Person {
    
    getSleep () {
        console.log("I  as a normal person sleeping 8 hours a day");
    }
}


class Student extends Person {
    getSleep () {
        console.log("I am a student sleeping 6 hours a day");
    }
}

class Developer extends Person {
    getSleep () {
        console.log("I am a developer sleeping 5 hours a day");
    }
}

const getSleepingHours = (person: Person) => {
    person.getSleep();
}

const person1 = new Person();
const student1 = new Student();
const developer1 = new Developer();

getSleepingHours(person1);
getSleepingHours(student1);
getSleepingHours(developer1);


class Shape {
    getArea (): number {
        return 0;
    }
}

class Circle extends Shape {

    radius: number;

     constructor(radius: number) {
        super();
        this.radius = radius;
    }
    
    getArea (): number {
        return Math.PI * this.radius * this.radius;
    }

}

class Square extends Shape {
    height: number;
    width: number;

    constructor(height: number, width: number) {
        super();
        this.height = height;
        this.width = width;
    }

    getArea (): number {
        return this.height * this.width;
    }
}

const shape = new Shape();
const circle1 = new Circle(5);
const square1 = new Square(4, 6);


const getArea = (shape: Shape) => {
    console.log(shape.getArea());
}

getArea(shape);
getArea(circle1);
getArea(square1);