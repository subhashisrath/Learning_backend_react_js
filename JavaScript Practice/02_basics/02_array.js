const MarvelHeroes = ["thor","ironman","spiderman"]
const dcHeroes = ["batman","superman","aquaman"]

// MarvelHeroes.push(dcHeroes)

// console.log(MarvelHeroes);//[ 'thor', 'ironman', 'spiderman', [ 'batman', 'superman', 'aquaman' ] ]

// // It pushed the entire aray as an element to the array.
// console.log(MarvelHeroes[3][1]);//superman


/* allHeroes = MarvelHeroes.concat(dcHeroes)// This concats all the arrays without altering the original array.
console.log(allHeroes);//['thor','ironman','spiderman', 'batman','superman','aquaman' ]

//--spread operator--

newHeroes = [...MarvelHeroes,...dcHeroes]// we can use this to concatenate as many arrays like this.
console.log(newHeroes);//['thor','ironman','spiderman', 'batman','superman','aquaman' ]
 */

// const another_array = [1,2,3, [4,5,6],7,[6,7,[4,5]]]
// const flated_array = another_array.flat(Infinity) // it concatenates all the subarrays into one array.
// console.log(flated_array);//[1,2,3,4,5,6,7,6,7,4,5]


// console.log(Array.isArray("Subhashis"));//false
// console.log(Array.from('subhashis'));//it converts it into an array

// let score1 = 100
// let score2 = 200
// let score3 = 300

//A set of elements to include in the new array object.Returns a new array from a set of elements.
// console.log(Array.of(score1,score2,score3));// [100,200,300]

// ---map()---
// It creates a new array applying with the provided fun on every element.
 
// const array = [1,2,3,4]
// const mapped = array.map((x) => x*2)

// console.log(mapped);//[2,4,6,8]


//----filter() ---
//it filters the array based on a given function if the condition results true.It doesn't alters the original value.

const num = [1,2,3,4,5,6,7,8]
const even_num = num.filter((num) => num%2 === 0)
console.log(even_num);//[2,4,6,8]

//split()
//["html", "css", "javascript"]
console.log("html css javascript".split(" "));


