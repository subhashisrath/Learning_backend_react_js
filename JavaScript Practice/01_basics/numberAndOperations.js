// //This is of number type
// const score=400;
// console.log(score);//400

// //this is of object type

// const balance = new Number(100)
// console.log(balance);//[Number:100]

// console.log(balance.toString());
// console.log(balance.toString().length);

// const otherNumber = 23.8966
// console.log(otherNumber.toPrecision(3))//23.8966-23.9,123.896-124 ,it gives priority from left to right.

// const hundreds=1000000
// console.log(hundreds.toLocaleString('en-IN'));//adds commas according to country's counting.

//+++++++++++++++++++++++ Maths ++++++++++++++++++++++++++
// console.log(Math.abs(-4));//4
// console.log(Math.round(4.6));//5
// console.log(Math.ceil(4.2));//ceil -> top value.=5
// console.log(Math.floor(4.9));//floor -> bottom value.=4
// console.log(Math.pow(4,2));// 16 , arg1-number,arg2-exponent
// console.log(Math.sqrt(25));//5
// console.log(Math.min(4,3,6,8));//3
// console.log(Math.max(3,4,5,6,7));//7

console.log(Math.random());// gives any random value between 0 and 1
console.log((Math.random()*10) + 1);//To ensure the minimum value is 1.


const min=10;
const max=20;
//It ensures the minimum value to get by random is between 10 and 20
console.log(Math.floor(Math.random() * (max - min + 1))+ min);

