const user = {
  id: 123,
  name: {
    firstName: "Saadman",
    lastName: "Fuad",
  },
  gender: "male",
  age: 25,
  isAdmin: true,
};

const lastName = user.name.lastName;
console.log(lastName);

const { firstName: FN } = user.name;
console.log(FN);

//array destructuring

const friends = ["Alice", "Bob", "Charlie"];

const [a, B, c] = friends;

console.log(a);
console.log(B);
console.log(c);
