type A = null;

type B = undefined;

type C = A extends null ? true: B extends undefined ? true : false;

// In this code, we have three type aliases: A, B, and C.
// 

type RichPeopleVehicle = 
{
    car: string;
    bike: string;
    cng: string;
}


type CheckVehicle<T> =  T extends keyof RichPeopleVehicle ? true : false;
type hasBike = CheckVehicle<"bike">; // true