//---- Arrays---//
// array copy opertions creates shallow copies.
//shallow copies share same reference point. means the main object will chage if we make any change in the copy. 

// An example of shallow copies
// let arr=[2,3,4,5]
// let arr2 = arr
// arr2.push(6)
// console.log(arr);// this gives [2,3,4,5,6] . the original array is changed. 


const myArr = [0,1,2,3,4,5]
const myNewArr = new Array(1,2,3,4,5)
// console.log(myArr[0]);//0
// console.log(myNewArr[2]);//3

// // ---Array Mthods---

// myNewArr.push(6)//pushed elemennt 6
// myNewArr.push(7)//pushed element 7
// // console.log(myNewArr);//[1,2,3,4,5,6,7]
// myNewArr.pop()//7 poppedd
// console.log(myNewArr);//[1,2,3,4,5,6]
// myNewArr.pop()//6 popped
// console.log(myNewArr); // [1,2,3,4,5]

// myNewArr.unshift(9)//it inserts the new element in first index of the array but shifts the entire array which changes length.
// console.log(myNewArr);//[9,1,2,3,4,5]

// myNewArr.shift() // it shifts the first element of the array and returns it 
// console.log(myNewArr);//[2,3,4,5]

// console.log(myNewArr.includes(9));// False
// console.log(myNewArr.indexOf(3));//2


// const otherArr = myNewArr.join('')// It adds all the element of an array into a string separated by specifief separator.
// console.log(otherArr);//12345
// console.log(typeof otherArr);//string

// ---- Slica and Splice -----

// console.log("A ",myNewArr);
// const myn1 = myNewArr.slice(1,3)
// //slice can take -ve numbers.
// //It returns a copy of a slice of an array. arg1-startindex, arg2-endindex. end index value is not included. 
// console.log(myn1);//[2,3]
// console.log("B ",myNewArr);

// splice can delete and instert element in the array. arg1 -start, arg2-delete count, arg3,arg4, .... - items.
// It alters the original array.

// const myn2 = myNewArr.splice(1,2)
// console.log(myn2);// [2,3]  
// console.log("C ",myNewArr);

// --- inserting using splice---

// const months = ['jan','feb','march','apr']
// months.splice(4,0,'may','june','july')//start-index 4,delete - 0 ,add - may,june,july
// console.log(months);
// months.splice(4,3,'nothing');// start from index 4 dlt 3 ele,add 'nothing'
// console.log(months);//[ 'jan', 'feb', 'march', 'apr', 'nothing' ]

