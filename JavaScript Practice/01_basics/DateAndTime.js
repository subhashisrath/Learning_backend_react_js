//----------Dates----------//

// let myDate =new Date()

// console.log(myDate);//2025-12-08T05:23:30.712Z
// console.log(myDate.toString());//Mon Dec 08 2025 10:54:45 GMT+0530 (India Standard Time)
// console.log(myDate.toDateString());//Mon Dec 08 2025
// console.log(myDate.toLocaleString);//[Function: toLocaleString]
// console.log(typeof myDate);

// let myCreatedDate = new Date(2025,0,23)
// Months start with 0 in js. 0 -> jan
// console.log(myCreatedDate.toDateString());//Thu Jan 23 2025

// let myCreatedDate = new Date(2025,0,23, 5, 3)
// console.log(myCreatedDate.toLocaleString());//23/1/2025, 5:03:00 am

// let myCreatedDate = new Date("01-14-2025")//fromating date in mm-dd-yyyy format. 
// let myTimeStamp = Date.now()
// console.log(myTimeStamp);//1765172402253ms
// //This generates timestamp of our created date .
// console.log(myCreatedDate.getTime());//1736793000000ms

// let newDate=new Date()
// // console.log(newDate.getMonth());// cz its 8/dec/2025, months start from 0 in js 
// // console.log(newDate.getDay());
// newDate.toLocaleString('default',{
//     weekday:"long"
// })

