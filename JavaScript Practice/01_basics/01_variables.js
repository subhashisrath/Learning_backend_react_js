
// {
//     let x =30;
// }
// console.log(x)
// let x=20;
// let y=10;

// console.log(x+y)

const accountId=123456
let accountEmail="www.google.com"
var accountPassword="223344"

accountCity="bbsr"

console.log(accountId);

accountEmail="xxx@bb"
accountPassword="65565"
accountCity="bengaluru"

console.table([accountId,accountEmail,accountPassword,accountCity])

/* You can't reassign an complete array to a constant array , but you can
change change a perticular element in an array or add an elemnt . Same in case of objects.
you can change properties of an object but can't assign a complte new object,
*/

const cars = ["volvo","bmw", "audi"]
cars[0]="Tata"
cars.push("toyota")
console.log(cars);

const cars=["volvo","bmw", "audi","mercedes"] // this will give error
