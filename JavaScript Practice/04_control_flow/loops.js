// for loop

// let myName = "subhashis"
// for (let index = 0; index < 5; index++) {
//     console.log(index);
// }

for (let i = 0; i <= 5; i++) {
    const element = i;
    if (element == 5) {
        // console.log("5 is the best number");
    }
    // console.log(element);
}

// for (let i = 0; i <= 10; i++) {
//     console.log(`outer loop: ${i}`);
    
//     for (let j = 0; j <= 10; j++) {
//         console.log(`Inner loop value ${j} and inner loop ${i}`);  
//     }
// }


// let arr = ["flash","batman","superman"]
// for (let index = 0; index < arr.length; index++) {
//     const element = arr[index];
//     console.log(element);
// }

// break and continue

// for (let index = 1; index < 20; index++) {
//     if(index == 5){
//         console.log("5 detected.");
//         break
//     }
//     console.log(`value of i is ${index}`);
// }

for (let index = 1; index < 20; index++) {
    if(index == 5){
        // console.log("5 detected.");
        continue
    }
    // console.log(`value of i is ${index}`);
}


//+++++++++++++ While loop and Do while loop++++++++++++++++

let index = 0
while (index<=10) {
    // console.log(`value of index is ${index}`);
    index+=2
}

let myArr = ["flash","batman","superman"]
let arr=0
while (arr < myArr.length) {
    // console.log(`value is ${myArr[arr]}`);
    arr += 1
}

// Do while

let score = 11
do {
    console.log(`Score is ${score}`);
    score ++
} while (score <=10);

