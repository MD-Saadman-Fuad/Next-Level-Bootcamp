//oop - class >>> object

// class Animal {
//     name: string;
//     species: string;
//     sound: string;

//     constructor(name: string, species: string, sound: string){
//         this.name = name;
//         this.species = species;
//         this.sound = sound;
//     }

//     makeSound(){
//         return `${this.name} says ${this.sound}`;
//     }
// }

//parameter properties

class Animal {
    constructor(
        public name: string,
        public species: string,
        public sound: string
    ) {}


    makeSound(){
        return `${this.name} says ${this.sound}`;
    }
}


const dog = new Animal("Buddy", "Dog", "Woof");
const cat = new Animal("Whiskers", "Cat", "Meow");

console.log(dog); // "Buddy"
console.log(cat); // "Meow"

console.log(dog.makeSound()); // "Buddy says Woof"
console.log(cat.makeSound()); // "Whiskers says Meow"