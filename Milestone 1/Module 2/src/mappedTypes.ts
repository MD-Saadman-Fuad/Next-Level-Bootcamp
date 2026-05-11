

const arrayOfNum : number[] = [1,2,3,4,5];

const arrayOfString : string[] = ["a", "b", "c", "d"];

const arrayofStringUsingMap : string[] = arrayOfNum.map(num => num.toString());

console.log(arrayofStringUsingMap);

type AreaOfNum = {
    height: number;
    width: number;
}

// type AreaOfString = {
//     height: string;
//     width: string;
// }

type Area<T>= {
    [key in keyof T]: T[key] ;
}

const area1 : Area<{
    height: string,
    width: number
}>= {
    height: "10",
    width: 20
}