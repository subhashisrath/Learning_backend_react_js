/*
function addTwoNumbers(num1,num2){
    console.log(num1 + num2);
}

// addTwoNumbers(20,30)//50
// // we are not checking the data type so this happened.
// addTwoNumbers(3,"4")//34
// addTwoNumbers(3,null)//3

// In the function we are just printing and we are not returning anything. So its gives undeined when we try to catch it in a variable.
const result = addTwoNumbers(20,30); // 50
console.log(result);//undefined

// returning value
function addTwoNumbers2(num1,num2){

    // let result = num1 + num2
    // return result 
    return num1 + num2; 
}

const result2 = addTwoNumbers2(20,30);
console.log(result2);//50

//NOTE: According to fun definition,after you have returned something fun won't do any other things . so it will show code unreachable.

function loginUserMessage(username){

    return `${username} just logged in`
}

// console.log(loginUserMessage("subhashis"))//subhashis just logged in
console.log(loginUserMessage())// it will print "undefined just logged in"
// To avoid this we can check in if else. 

*/

/* 
function loginUserMessage(username){
    // if (username === undefined){
    // we can write the same like this too .
    if (!username){
        console.log("Please enter a username");
        return// after this the other lines won't execute.
    }

    return `${username} just logged in`
}
console.log(loginUserMessage());//Please enter a username
 */

// Giving a default value in the parameter.
function loginUserMessage(username = "subhashis"){
    if (!username){
        console.log("Please enter a username");
        return
    }

    return `${username} just logged in`
}

// console.log(loginUserMessage());//subhashis just logged in
// If we pass a argument in the func call then the default value wil be overwritten.
// console.log(loginUserMessage("Jay"))//Jay just logged in

// "..." is called rest or spread operator. In case of funnctions it's called rest operator.
// Without the rest operator,it would have print only 200.
function calculateCartPrice(...num1){
    return num1
}

// console.log(calculateCartPrice(200,300,400));//[ 200, 300, 400]


const user = {
    name :"subhashis",
    price: 500
}

function objectHandler(anyobject){
    
    console.log(`Username is ${anyobject.name} and price is ${anyobject.price}`);
}

// objectHandler(user);//Username is subhashis and price is 500
//If the key exactly doesn't match it still executes the code but gives "undefined" etc as values.

objectHandler({
    name :"subhashis",
    price: 500
}) // we can call the objects like this too.

const myNewArray = [200,300,400,500]

function returnSecondValue(getArray) {

    return getArray[0]
}
console.log(returnSecondValue(myNewArray));//200
console.log(returnSecondValue([200,300,400,500]));