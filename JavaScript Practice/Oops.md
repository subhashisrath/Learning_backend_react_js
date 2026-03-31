# Oops concept in Javascript 

There are mainly four oops concepts in javascript.
1. Classes and Object
2. Encapsulation
3. Abstraction
4. Polymorphism
5. Inheritance

## 1.Classes and Object
 Classes are basically like blueprint and objects are things that are created out of the blueprint.

### Example:
 ```js 
class Person {
    constructor (name,age){
        this.name = name
        this.age = age
    }
    hello(){
       return `${this.name} is ${this.age} years old.`
    }
 }
 
 const person1 = new Person("subhashis",20)
 const person2 = new Person("rahul",25)

 console.log(person1.hello())
 console.log(person2.hello())
 ``` 

 ## 2.Encapsulation
 Encapsulation basically means the way data and informtion are wrapped up inside the class structure.

### Example:
 ```js
 class Acccount{
    constructor(balance){
        this.balance = balance
    }

    deposite(amount){
        this.balance += amount
        return `Your current balance : ${this.balance}`
    }

    withdraw(amount){
        this.balance -= amount
        return `your current balance : ${this.balance}`
    }
 }

 const sbi = new Account(5000)
 console.log(sbi.deposite(500))
 console.log(sbi.withdraw(1000))
 ```

 ## 3.Abstraction

 Abstraction is one of the features of obect oriented programming in javascript,where where only the necessary information is shown by hiding all the unnecessary details.

### Example:
 ```Js
class TeaMaking {

  #type;
  constructor(type) {
    this.#type = type;
  }
  #boilWater() {
    return "Boiling  the water .";
  }

  #addTea() {
    return `Adding the ${this.#type} into the water.`;
  }
  #addSugar() {
    return `Adding the sugar into the tea.`
  }

  makeTea() {
    console.log(this.#boilWater());
    console.log(this.#addTea());
    console.log(this.#addSugar());
    console.log(`Your ${this.#type} is ready!`);
  }
}

const morningTea = new TeaMaking("Tata tea");
morningTea.makeTea(); 
 ```

 ## 4.Inheritance

 Inheritance means one class inherits the properties of another class.

 ### Example:
 ```js
class person{
    constructor(rollno,age){
        this.rollno = rollno
        this.age=age
    }
    Task(){
        return `Roll no:${this.rollno} will be the monitor tommorow.`
    }
}

class student extends person{
    constructor(rollno,age,name){
        super(rollno,age)
        this.name = name
    }
    work(){
        return `${this.name} is ${this.age} years old.`
    }
}

const student1 = new student(101,20,"subhashis")
console.log(student1.Task())
console.log(student1.work());

 ```
## 5.Polymorphism
In polymorphism same method names with reference to different objects hold different value.

```js
class Animal{
    constructor(name){
        this.name = name
    }
    speak(){
        return `${this.name} says hii!!`
    }
}

class Dog extends Animal{
    constructor(name){
        super(name)
    }
    speak(){
        return `Dog barks!! woof,woof`
    }
}

const animal1 = new Animal("Lion")
console.log(animal1.speak())
const dog1 = new Dog("Buddy")
console.log(dog1.speak())
```