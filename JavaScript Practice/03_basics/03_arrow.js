/* const user = {
    username:"subhashis",
    price : 999,
    // we use "this" keyword when we refer to the current context.
    welcomeMessage: function(){
        console.log(`${this.username} ,welcome to website`); 
    }
}

user.welcomeMessage()//subhashis ,welcome to website
user.username= "sam" // the current context got changed here. context means the values, properties etc.
user.welcomeMessage()//sam ,welcome to website

console.log(this); // In node env it doesn't got any context so its empty {}. In browser console it gives "window"

 */


// function tea(){
//     let username = "subhashis"
//     console.log(this.username); // it gives undefined. we can only use this in an object.
// }
//  tea()

// const chai = function(){
//     let username = "subhashis"
//     console.log(this.username);
// }
// chai()//undefined

//++++++++++ Arrow function ++++++++++++

// const chai = () => {
//     let username = "subhashis"
//     console.log(this.username);
// }
// chai() //undefined

//explicit return 
// const addTwo = (num1,num2) => {
//     return num1 + num2
// }
// console.log(addTwo(5,4))//9

// Implicit return
//when we use curly braces its mandetory to write return keyword otherwise don't.


// const addTwo = (num1,num2) => num1 + num2

// const addTwo = (num1,num2) => (num1 + num2)

// In order to return object we have to wrap it inside a parenthesis.
const addTwo = (num1,num2) => ({username: "subhashis"})
console.log(addTwo(5,4))

