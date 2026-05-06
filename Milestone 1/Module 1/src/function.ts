//arrow function and Normal Function

function add(num1: number, num2: number): number {
    return num1 + num2;
}

const addArrow = (num1: number, num2: number): number => {
    return num1 + num2;
}


console.log(add(5, 10));
console.log(addArrow(5, 10));


const poorUser = {
    name: "Saadman",
    balance: 0,
    addBalance(money: number) {
        const totalBalance = this.balance + money;
        // this.balance = totalBalance;
        return totalBalance;
    }
}

console.log(poorUser.addBalance(100));


const ar: number[] = [1, 2, 3, 4, 5];
const newAr = ar.map((num: number): number => num * 2);
console.log(newAr);