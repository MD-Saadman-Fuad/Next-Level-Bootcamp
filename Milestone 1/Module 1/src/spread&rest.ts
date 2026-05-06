//spread operator

const friends = ["Alice", "Bob", "Charlie"];

const schoolFriends = ["David", "Eve"];

const collegeFriends = ["Frank", "Grace"];

const allFriends = [...friends, ...schoolFriends, ...collegeFriends];

console.log(allFriends); // Output: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"]

const user = {
    name: "Saadman",
    phone: "1234567890",
}
const otherInfo = {

    hobby: "Coding",
    city: "Dhaka"
}

const userInfo = { ...user, ...otherInfo };

console.log(userInfo); // Output: { name: "Saadman", phone: "1234567890", hobby: "Coding", city: "Dhaka" }
//rest 

const sendInvite = (friend1: string, friend2: string, friend3: string) => {
    console.log(`Send Invitation to ${friend1}, ${friend2}, and ${friend3}`)

}


const sendInviteRest = (...friends: string[]) => {
    friends.forEach((friend: string) => {
        console.log(`Send Invitation to ${friend}`);
    }
    );

}

sendInvite("Alice", "Bob", "Charlie");

sendInviteRest("Alice", "Bob", "Charlie");
