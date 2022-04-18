# CLASSES TYPE

TypeScript classes add some powerful and important features on top of traditional JavaScript classes. In this unit, we will take a closer look at class fields, access modifier keywords and more!

Consider the following Javascript code

```js
class Car {
  constructor(make, model, year) {
    this.make = make
    this.model = model //(property) Car.model: any
    this.year = year
  }
}
 
let sedan = new Car("Honda", "Accord", 2017)
sedan.activateTurnSignal("left") // not safe!
new Car(2017, "Honda", "Accord") // not safe!
```

If we stop and think for a moment, this makes sense in a world (the JS world) where every value, including the class fields and instances of the class itself, is effectively of type any.

In the TypeScript world, we want some assurance that we will be stopped at compile time from invoking the non-existent activateTurnSignal method on our car. In order to get this we have to provide a little more information up front:


```ts
class Car {
  make: string
  model: string
  year: number
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model //(property) Car.model: string
    this.year = year
  }
}
 
let sedan = new Car("Honda", "Accord", 2017)
sedan.activateTurnSignal("left") // not safe! --- Property 'activateTurnSignal' does not exist on type 'Car'.
new Car(2017, "Honda", "Accord") // not safe! --- Argument of type 'number' is not assignable to parameter of type 'string'.
```

## Access modifier keywords
public, private and protected
TypeScript provides three access modifier keywords, which can be used with class fields and methods, to describe who should be able to see and use them.

keyword	who can access
- public:	everyone (this is the default)
- protected	the instance itself, and subclasses
- private	only the instance itself

Let’s see how this works in the context of an example:

```ts
class Car {
  public make: string
  public model: string
  public year: number
  protected vinNumber = generateVinNumber()
  private doorLockCode = generateDoorLockCode()
 
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
 
  protected unlockAllDoors() {
    unlockCar(this, this.doorLockCode)
  }
}
 
class Sedan extends Car {
  constructor(make: string, model: string, year: number) {
    super(make, model, year)
    this.vinNumber //(property) Car.vinNumber: number
    this.doorLockCode // (property) Car.doorLockCode: number // Property 'doorLockCode' is private and only accessible within class 'Car'. 
  }
  public unlock() {
    console.log("Unlocking at " + new Date().toISOString())
    this.unlockAllDoors()
  }
}
 
let s = new Sedan("Honda", "Accord", 2017)
s.make //(property) Car.make: string
s.vinNumber //(property) Car.vinNumber: number   //Throws error ---  Property 'vinNumber' is protected and only accessible within class 'Car' and its subclasses.
     

s.doorLockCode // (property) Car.doorLockCode: number       // throws error --- Property 'doorLockCode' is private and only accessible within class 'Car'.
      
s.unlock()
```

A couple of things to note in the example above:

- The top-level scope doesn’t seem to have access to `vinNumber` or `doorLockCode`
- Sedan doesn’t have direct access to the `doorLockCode`, but it can access `vinNumber` and `unlockAllDoors()`
- We see two examples of “limited exposure”
  - `Car` can expose private functionality through defining its own protected functionality
  - `Sedan` can expose protected functionality through defining its own public functionality

## JS private #fields
As of TypeScript 3.8, TypeScript supports use of ECMAScript private class fields. If you have trouble getting this to work in your codebase, make sure to double-check your Babel settings

```ts
class Car {
  public make: string
  public model: string
  #year: number
 
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.#year = year
  }
}
const c = new Car("Honda", "Accord", 2017)
c.#year // Throws error --- Property '#year' is not accessible outside class 'Car' because it has a private identifier.
```

## readonly
While not strictly an access modifier keyword (because it has nothing to do with visibility), TypeScript provides a readonly keyword that can be used with class fields.

```ts
class Car {
  public make: string
  public model: string
  public readonly year: number
 
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
 
  updateYear() {
    this.year++ // Throws error --- Cannot assign to 'year' because it is a read-only property.
  }
}
```

## Param properties
Ok, let’s pop a stack frame. Now that we know about access modifier keywords, let’s return to an earlier code snippet from our discussion around class fields:

```ts
class Car {
  make: string
  model: string
  year: number
  constructor(make: string, model: string, year: number) {
    this.make = make
    this.model = model
    this.year = year
  }
}
```
TypeScript provides a more concise syntax for code like this, through the use of param properties:

```ts
class Car {
  constructor(
    public make: string,
    public model: string,
    public year: number
  ) {}
}
 
const myCar = new Car("Honda", "Accord", 2017)
myCar.make
```
     
This is the only time you will see an access modifier keyword next to something other than a class member. Here’s what this syntax means, conceptually:

```ts
class Car {
  constructor(public make: string) {}
}
```

> NB: The first argument passed to the constructor should be a `string`, and should be available within the scope of the constructor as `make`. This also creates a `public` class field on `Car` called `make` and pass it the value that was given to the constructor

It is important to understand the order in which “constructor-stuff” runs.

Here’s an example that will help us understand how this works:

```ts
class Base {}
 
class Car extends Base {
  foo = console.log("class field initializer")
  constructor(public make: string) {
    super()
    console.log("custom constructor stuff")
  }
}
 
const c = new Car("honda")
```

and the equivalent compiled output:

```ts
"use strict";
class Base {
}
class Car extends Base {
    constructor(make) {
        super();
        this.make = make;
        this.foo = console.log("class field initializer");
        console.log("custom constructor stuff");
    }
}
const c = new Car("honda");
```

Note the following order of what ends up in the class constructor:

1. `super()`
2. param property initialization
3. other class field initialization
4. anything else that was in your constructor after super()

Also note that, while it is possible in JS to put stuff before super(), the use of class field initializers or param properties disallows this:

```ts
class Base {}
 
class Car extends Base {
  foo = console.log("class field initializer")
  constructor(public make: string) {
    console.log("before super")
    super()
    console.log("custom constructor stuff")
  }
}
 
const c = new Car("honda")
```