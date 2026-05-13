class Parent {
    name: string;
    age: number;
    address: string;

    constructor(name: string, age: number, address: string){
        this.name = name;
        this.age = age;
        this.address = address;
    }

    getSleep(numberOfHours: number): void {
        console.log(`${this.name} is sleeping for ${numberOfHours} hours`);
    }

}


class Student extends Parent {
    


}


const student1 = new Student("John", 20, "123 Main St");
student1.getSleep(8);


class Teacher extends Parent {

    designation: string;

    constructor(name: string, age: number, address: string, designation: string){
        super(name, age, address);
        this.designation = designation;
    }

    getSleep(numberOfHours: number): void {
        console.log(`${this.name} is sleeping for ${numberOfHours} hours`);
    }

    takeClass(){
        console.log(`${this.name} is taking a class`);
    }

}

const teacher1 = new Teacher("Jane", 35, "456 Main St", "Math Teacher");
teacher1.getSleep(6);
teacher1.takeClass();