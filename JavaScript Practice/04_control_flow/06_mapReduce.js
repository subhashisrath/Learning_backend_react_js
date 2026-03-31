//map ()

let arr = [1,2,3,4,5,6,7,8,9,10]

// const newNums = arr.map((num) => num+10)

//chaining 
const newNums = arr
                .map((num) => num*10)
                .map((num) =>num+1)
                .filter((num) => num>40)
console.log(newNums);

//+++++++++++++ reduce()++++++++++++++++++

/* // reduce() gives a single value.
// reduce takes a callback function and an initial value as parameter

// the call back function takes accumulator and current value as argument.

//If the intitial value is mentioned,for callback function starts execution with initial value as accumulator other wise aray[0] and first value in the array as current value otherwise its array[1].

//The functions return value becomes accumulator parameter on next invocation.At last the return value becomes return value of reduce() */


let myArr = [1,2,3,4]

// const myTotal = myArr.reduce(function(accumulator, currentValue){
//     return accumulator + currentValue
// },0)
// console.log(myTotal);//10

// With arrow function

const myTotal = myArr.reduce((accumulator, currentValue) => accumulator + currentValue
,0)
console.log(myTotal);//10

//  Example Of Shoping cart

const shopingCart = [
    {
        itemName :"Javascript",
        price: 2999
    },
    {
        itemName :"Frontend Development",
        price: 4999
    },
    {
        itemName :"Fullstack Development",
        price: 9999
    },
    {
        itemName :"Datascience",
        price: 11999
    }
]

let cartTotal = shopingCart.reduce((acc,item) => acc + item.price, 0)
console.log(cartTotal);//29996
