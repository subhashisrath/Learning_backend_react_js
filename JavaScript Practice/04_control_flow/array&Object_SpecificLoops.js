//+++++++++++++ for of ++++++++++++++

// in for of loop we get values.
const arr = [1,2,3,4,5]

for (const num of arr) {
    // console.log(num);
}

const str = "subhashis"
for (const letter of str) {
    // console.log(letter);
}

//++++++++++++++ Map constructor ++++++++++++ 

/* // map stores unique valules and the order of values also stays same.

If an iterable object (such as an array) is passed, all of its elements will be added to the new Map. 
Each element must be an object with two properties: 0 and 1, which correspond to the key and value (for example, [[1, "one"],[2, "two"]]). 
If you don't specify this parameter, or its value is null or undefined, the new Map is empty. */

// const map = new Map()
// map.set('IN', "India")
// map.set('USA',"United States of America")
// map.set('Fr',"France")
// console.log(map);// Map(3) {
// //   'IN' => 'India',
// //   'USA' => 'United States of America',
// //   'Fr' => 'France'


// for (const key of map) {
//     console.log(key);// [ 'IN', 'India' ]
// //[ 'USA', 'United States of America' ]
// //[ 'Fr', 'France' ]
// }


//----------Destructuring Array--------------

// for (const [key , value] of map) {
//     console.log(key, ':-', value);//N :- India
// //USA :- United States of America
// //Fr :- France
// }

// Iterating over Object
const myObject = {
    'game1' : "GOD of WAR",
    'game2' : "PUBG",
    'game3' : 'Valorant'
}

// This way is not suitable for iterating over object.
// for (const [key , value] of myObject) {
//     console.log(key, ':-', value);
//     //myObject is not iterable
// }

// ++++++++++++++++ for in ++++++++++++++++

// in for in loop we get keys.
// We can't iterate over map like this bcz,map isn't iterable.

for (const key in myObject) {
//console.log(key);// this gives keys
    console.log(myObject[key]);//this gives values
}

const programming = ['js','java','py','cpp']
for (const key in programming) {
    // this will give keys of array . keys in array are index.
    // console.log(key);//0 1 2 3
    console.log(programming[key]);// this gives values. 
}



