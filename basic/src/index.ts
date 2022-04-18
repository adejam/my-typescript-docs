// in typescript age has a type of number and can be changed to another number but not to another type
let age = 6;

// age1 has a type of 6(number) and not number cos it can't be changed and would always be 6. This is called literal type
const age1 = 6

const birthday: Date = new Date() //birthday has a type of Date. To be used sparingly


// the function below has been set to recieve parameters which are only number and must only ever return a number
const add = (num1: number, num2: number): number => {
    return num1 + num2;
}

// NB: any type is very dangerous to use and should be avoided as much as possible



// =================== OBJECT TYPES ===============================
// when we talk of objects types, we mean what type is the name of object and what type is each of its properties

// for a car object below

// the type can be as below. since we use a let then we can then specify the properties as below 

let car: {
    make: string
    model: string
    year: number
    engineNumber?: number // this means enginNumber can either be a number or undefined
}

car = {
    make: "Toyota",
    model: "Camry",
    year: 2002
}





// =========================== Index signatures ================================
// Sometimes we need to represent a type for Dictionaries, where values of a consistent type are retrievable by keys.

// Let’s consider the following collection of phone numbers:


// const phones =  {
//   home: { country: "+1", area: "211", number: "652-4515" },
//   work: { country: "+1", area: "670", number: "752-5856" },
//   fax: { country: "+1", area: "322", number: "525-4357" },
// }

// Clearly it seems that we can store phone numbers under a “key” — in this case home, office, fax, 
// and possibly other words of our choosing — and each phone number is comprised of three strings.

// We could describe this value using what’s called an index signature:
let phones: {
    [k: string]: {
        country: string
        area: string
        number: string
    }
} = {}
// NB: "k" is arbitrary, means u can name it anything

phones = {
    home: { country: "+1", area: "211", number: "652-4515" },
    work: { country: "+1", area: "670", number: "752-5856" },
    fax: { country: "+1", area: "322", number: "525-4357" },
}



phones.fax

// Now, no matter what key we lookup, we get an object that represents a phone number.






// ======================== Arrray ============================

const names: string[] = ["jamo", "adeleye", "seyi"]; // this is an array of strings






// ======================== Tuple ============================
// in case of some arrays with diff types like string and numbers, To work on this, we use tuple.
// in the example below
const carArray = [2002, "toyota", "camry"];
// the first question is will the flow of the array be 
// 1)only always have a number at the beginning and two string afterwards, in this case we define the type as
let carArray1: [number, string, string] = [2002, "toyota", "camry"];
// if we change the values but maintain the structure we get no error but if we don't maintain we get an error
carArray1 = [2003, "mazda", "srom"]
// if we don't maintain the structure we get an error even we don;t change  the values
// carArray1 = ["toyota", 2002, "camry"]; // the first two indexes throws errors
// carArray1 = [2003, "mazda", "srom", "engine"] // throws error as the length is now 4 instead of 3

//2) if we don't want to have a structure and length of array can change at any time we use optional type
let carArray3: (string | number)[] = [2002, "toyota", "camry"]







// ======================  STRUCTURAL VS NOMINAL TYPES ====================

// --------------------------Static vs dynamic------------------------
// Sorting type systems as either static or dynamic has to do with whether type-checking is performed at compile time or runtime.

// TypeScript’s type system is static.

// Java, C#, C++ all fit into this category. Keep in mind that inferrence can still occur in static type systems — 
// TypeScript, Scala, and Haskell all have some form of static type checking.

// Dynamic type systems perform their “type equivalence” evaluation at runtime. 
// JavaScript, Python, Ruby, Perl and PHP fall into this category.







// ===================UNION TYPES OR INTERSECTION TYPES ======================
// Think of sets to get your head aroubd this

// Union and intersection types can conceptually be thought of as
// logical boolean operators (AND, OR) as they pertain to types. 

// A union type has a very specific technical definition that comes from set theory, but 
//it’s completely fine to think of it as OR, for types.

// Intersection types also have a name and definition that comes from set theory, but they can be thought of as AND, for types.

// -------------------------------------Union Types in TypeScript--------------------------
// Union types in TypeScript can be described using the | (pipe) operator.

// For example, if we had a type that could be one of two strings, "success" or "error", we could define it as

// "success" | "error"
// For example, the flipCoin() function will return "heads" if a number selected from (0, 1) is >= 0.5, or "tails" if <=0.5.

function flipCoin(): "heads" | "tails" {
    if (Math.random() > 0.5) return "heads"
    return "tails"
}

const outcome = flipCoin()





// ================================ Type Aliases =====================================
// Type aliases help tby allowing us to:

// --- define a more meaningful name for this type
// --- declare the particulars of the type in a single place
// --- import and export this type from modules, the same as if it were an exported value

export type UserContactInfo = {
    name: string
    email: string
}

type UserInfoOutcomeError = ["error", Error]
type UserInfoOutcomeSuccess = [
    "success",
    { name: string; email: string }
]
type UserInfoOutcome =
    | UserInfoOutcomeError
    | UserInfoOutcomeSuccess

/**
 * CLEANED UP version
 */
export function maybeGetUserInfo(): UserInfoOutcome {
    // implementation is the same in both examples
    if (Math.random() > 0.5) {
        return [
            "success",
            { name: "Mike North", email: "mike@example.com" },
        ]
    } else {
        return [
            "error",
            new Error("The coin landed on TAILS :("),
        ]
    }
}

// --------------- INHERITANCE IN TYPES ALIASES ---------------------------
// You can create type aliases that combine existing types with new behavior by using Intersection (&) types.

type SpecialDate = Date & { getReason(): string } // uses intersection here

const newYearsEve: SpecialDate = {
    ...new Date(),
    getReason: () => "Last day of the year",
}
newYearsEve.getReason

// NB: type Alias is like const and can't be redeclared




// ====================================== INTERFACE =========================

// An interface is a way of defining an object type. An “object type” can be thought of as, 
// “an instance of a class could conceivably look like this”.

// For example, string | number is not an object type, because it makes use of the union type operator.

// NB: interface names are like let and can be redeclared. we use this to attach a variable to existing variable.
// can be useful when attaching a new variable to types of existing packages

interface UserInfo {
    name: string
    email: string
}

interface UserInfo {
    phone: string
}


function printUserInfo(info: UserInfo) {
    info.name
}

// Like type aliases, interfaces can be imported/exported between modules just like values, 
// and they serve to provide a “name” for a specific type.

// -----------------------------------   Inheritance in interfaces -----------------------------------
// ------------------EXTENDS-----------
// If you’ve ever seen a JavaScript class that “inherits” behavior from a base class, 
// you’ve seen an example of what TypeScript calls a heritage clause: extends

class Animal {
    eat(food) {
        // consumeFood(food)
    }
}
class Dog extends Animal {
    bark() {
        return "woof"
    }
}

const d = new Dog()
d.eat
d.bark

// Just as in in JavaScript, a subclass extends from a base class.
// Additionally a “sub-interface” extends from a base interface, as shown in the example below
interface Animal {
    isAlive(): boolean
}
interface Mammal extends Animal {
    getFurOrHairColor(): string
}
interface Dog extends Mammal {
    getBreed(): string
}
function careForDog(dog: Dog) {
    dog.getBreed
}


// ----------------------------Choosing which to use==INTERFACE VS TYPES ========--------
// In many situations, either a type alias or an interface would be perfectly fine, however…

// If you need to define something other than an object type (e.g., use of the | union type operator), you must use a type alias
// If you need to define a type to use with the implements heritage term, it’s best to use an interface
// If you need to allow consumers of your types to augment them, you must use an interface.





// ==================================== Recursion ==============================
// Recursive types, are self-referential, and are often used to describe infinitely nestable types. 
// For example, consider infinitely nestable arrays of numbers

[3, 4, [5, 6, [7], 59], 221]
// You may read or see things that indicate you must use a combination of interface and type for recursive types. 
// As of TypeScript 3.7 this is now much easier, and works with either type aliases or interfaces.

type NestedNumbers = number | NestedNumbers[]

const val: NestedNumbers = [3, 4, [5, 6, [7], 59], 221]

if (typeof val !== "number") {
    val.push(41)
    //   val.push("this will not work")
}



// ================= JSON TYPES ==================

type JSONPrimitive = string | number | boolean | null
type JSONObject = { [k: string]: JSONValue }
type JSONArray = JSONValue[]
type JSONValue = JSONArray | JSONObject | JSONPrimitive

////// DO NOT EDIT ANY CODE BELOW THIS LINE //////
function isJSON(arg: JSONValue) { }

// POSITIVE test cases (must pass)
isJSON("hello")
isJSON([4, 8, 15, 16, 23, 42])
isJSON({ greeting: "hello" })
isJSON(false)
isJSON(true)
isJSON(null)
isJSON({ a: { b: [2, 3, "foo"] } })

// NEGATIVE test cases (must fail)
// @ts-expect-error
isJSON(() => "")
// @ts-expect-error
isJSON(class { })
// @ts-expect-error
isJSON(undefined)
// @ts-expect-error
isJSON(new BigInt(143))
// @ts-expect-error
isJSON(isJSON)
