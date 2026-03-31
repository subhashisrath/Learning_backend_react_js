// singleton object can only be made with constructor.

// symbol declaration 
const mySym = Symbol()

// Declaring object witj object literals
const jsUser = {
    name : "subhashis",
    "full name" :"subhashis rath",
    [mySym] : "mykey1",
    age:25,
    location:"bbsr",
    email:"rath@google.com",
    isLoggedIn:false,
    lastLoginDays : ["monday","saturday"]
}

/* //Accssing objects

console.log(jsUser.name);//subhashis
console.log(jsUser['name']);//subhashis

console.log(jsUser["full name"]);

// this is the only way full name can be accessed cz the key is written in string format.
// bcz symbol is declare in an object like this - [mySym] : "", to access- jsUser[mySym]

console.log(jsUser[mySym]);
console.log(typeof mySym);//symbol */

jsUser.email="subhashis@goole.com"
console.log(jsUser.email);
// Object.freeze(jsUser)
// prevents changing of any existing properties and addition of new properties.
jsUser.email="bbbad@jjj"
console.log(jsUser.email);//still email=subhashis@goole.com

jsUser.greeting = function(){
    console.log("Hello, JS users.");
}

jsUser.greetingTwo = function(){
    console.log(`Hello, JS users, ${this.name}`);//this refers to the object itself. 
}

console.log(jsUser.greeting);// it gives [Function (anonymous)]-refernce of the function.

console.log(jsUser.greeting());//Hello, JS users.
console.log(jsUser.greetingTwo());//Hello, JS users, subhashis

