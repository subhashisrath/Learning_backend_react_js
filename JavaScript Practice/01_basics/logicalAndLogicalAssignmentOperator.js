// /*--logical AND --*/

// if x is falsy returns  the falsy value
// if x is truthy returns y
// falsy values-"",null,undefined,false,0,NaN. Everything else are truthy.


// let x="come"
// let y ="here"
// console.log(x&&y)//= "here" because x is truthy so it returns y

// let x=0
// let y ="here"
// console.log(x&&y)// ="0" because x is falsy so it returns the falsy value.

// /*---LOGICAL OR--*/

// If x is truthy → returns x
// If x is falsy → returns y

// let x=""
// let y="subha"
// console.log(x||y);//returns subha cz x is falsy

// let x="subha"
// let y="rath"
// console.log(x||y);//returns subha cz x is truthy

// /*-----LOGICAL ASSIGNMENT OPERATOR---*/

// &&=

// X&&=Y means x=x&&y
// it assigns the result of x&&y to x

// let x="";
// let y="nice";
// x&&=y;
// console.log(x);//x=""

// let x="good"
// let y="luck"
// x&&=y
// console.log(x&&y);

// ||=

// x||=y means x=x||y
// it assigns the value of x||y to x

// let x="";
// let y="nice";
// x||=y;
// console.log(x);

/*----Nullish Coalescing Operator----*/

// if name is "null" or "undefined" the output will be guest.
//If its anything else,it wont'switch to right side,it will give that value.
let name=null;
let username=name??"guest";
console.log(username);//=guest

/*---Nullish Assignment Operator---*/
//it means x=x??10
// null??10 gives 10 .which then assigned to x .

// let x = null;
// x ??= 10;
// console.log(x); // 10
