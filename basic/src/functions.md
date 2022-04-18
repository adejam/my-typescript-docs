# FUNCTIONS
Both interfaces and type can be used to type functions

```ts
interface TwoNumberCalculation {
    (x: number, y: number): number // note that this uses a semicolon
}

type TwoNumberCalc = (x: number, y: number) => number // where as this uses an arrow

const addNum: TwoNumberCalculation = (a, b) => a + b
                                
const subtract: TwoNumberCalc = (x, y) => x - y
```
                                
> NB: Void should only appear as a return type and never assigned to a variable


## Construct signatures
Construct signatures are similar to call signatures, except they describe what should happen with the new keyword.
> NB: Constructs allow using the "new" keyword in interfaces

```ts
interface DateConstructor {
  new (value: number): Date
}
 
let MyDateConstructor: DateConstructor = Date
const d = new MyDateConstructor()
```


## Function overloads 
Imagine the following situation:

```html
  <iframe src="https://example.com" />
  <!-- // -->
  <form>
    <input type="text" name="name" />
    <input type="text" name="email" />
    <input type="password" name="password" />
    <input type="submit" value="Login" />
  </form>
```
What if we had to create a function that allowed us to register the “main event listener”?

If we are passed a form element, we should allow registration of a “submit callback”
If we are passed an iframe element, we should allow registration of a ”postMessage callback”
Let’s give it a shot:

```ts
type FormSubmitHandler = (data: FormData) => void
type MessageHandler = (evt: MessageEvent) => void
 
function handleMainEvent(
  elem: HTMLFormElement | HTMLIFrameElement,
  handler: FormSubmitHandler | MessageHandler
) {}
 
const myFrame = document.getElementsByTagName("iframe")[0]  // const myFrame: HTMLIFrameElement
handleMainEvent(myFrame, (val) => {})
```


This is not good — we are allowing too many possibilities here, including things we don’t aim to support (e.g., using a HTMLIFrameElement with FormSubmitHandler, which doesn’t make much sense).

We can solve this using function overloads, where we define multiple function heads that serve as entry points to a single implementation:

```ts
type FormSubmitHandler = (data: FormData) => void
type MessageHandler = (evt: MessageEvent) => void
 
function handleMainEvent(
  elem: HTMLFormElement,
  handler: FormSubmitHandler
)

function handleMainEvent(
  elem: HTMLIFrameElement,
  handler: MessageHandler
)

function handleMainEvent(
  elem: HTMLFormElement | HTMLIFrameElement,
  handler: FormSubmitHandler | MessageHandler
) {}
 
const myFrame = document.getElementsByTagName("iframe")[0]
        
const myForm = document.getElementsByTagName("form")[0]
        
handleMainEvent(myFrame, (val) => {})
handleMainEvent(myForm, (val) => {})
```

Look at that! We have effectively created a linkage between the first and second arguments, which allows our callback’s argument type to change, based on the type of handleMainEvent’s first argument.

> NB: with this we first linkes `HTMLFormElement` with its corresponding form function `FormSubmitHandler` and on line 47 we linked `HTMLIFrameElement` with `MessageHandler`. This way `handleMainEvent` will always know which `handler` belongs to which `elem` nd if we write a function thats mixes it, we get a error

Let’s take a closer look at the function declaration:

```ts
function handleMainEvent(
  elem: HTMLFormElement,
  handler: FormSubmitHandler
)
function handleMainEvent(
  elem: HTMLIFrameElement,
  handler: MessageHandler
)
function handleMainEvent(
  elem: HTMLFormElement | HTMLIFrameElement,
  handler: FormSubmitHandler | MessageHandler
) {}
 
handleMainEvent // function handleMainEvent(elem: HTMLFormElement, handler: FormSubmitHandler): any (+1 overload)
```


This looks like three function declarations, but it’s really two “heads” that define an argument list and a return type, followed by our original implementation.

If you take a close look at tooltips and autocomplete feedback you get from the TypeScript language server, it’s clear that you are only able to call into the two “heads”, leaving the underlying “third head + implementation” inaccessible from the outside world.

> NB: the two heads don't have curly braces as they are typed declared and not implementations

One last thing that’s important to note: “implementation” function signature must be general enough to include everything that’s possible through the exposed first and second function heads. For example, this wouldn’t work

```ts
function handleMainEvent(
  elem: HTMLFormElement,
  handler: FormSubmitHandler
)
function handleMainEvent(
// error thrown: This overload signature is not compatible with its implementation signature.
  elem: HTMLIFrameElement,
  handler: MessageHandler
)
function handleMainEvent(elem: HTMLFormElement) {} // this caused the error, it didn't specify the other possibiblities and not compatibility
 
handleMainEvent //function handleMainEvent(elem: HTMLFormElement, handler: FormSubmitHandler): any (+1 overload)
```

## `this` Types

For example, if we had a DOM event listener for a button:

```HTML
<button onClick="myClickHandler">Click Me!</button>
```

We could define myClickHandler as follows

```ts
function myClickHandler(event: Event) {
  this.disabled = true // Throws error --- 'this' implicitly has type 'any' because it does not have a type annotation.
}
 
myClickHandler(new Event("click"))
```

To address the problem, we need to give this function a `this` type

```ts
function myClickHandler(
  this: HTMLButtonElement,
  event: Event
) {
  this.disabled = true
          
(property) HTMLButtonElement.disabled: boolean
}
 
myClickHandler(new Event("click")) // seems no longer ok
```

Now when we try to directly invoke myClickHandler on the last line of the code snippet above we get a new compiler error. Effectively, we have failed to provide the this that this function states it wants.


```ts
function myClickHandler (
  this: HTMLButtonElement,
  event: Event
) {
  this.disabled = true // (property) HTMLButtonElement.disabled: boolean
}

myClickHandler //function myClickHandler(this: HTMLButtonElement, event: Event): void

const myButton = document.getElementsByTagName("button")[0]
const boundHandler =  myClickHandler.bind(myButton) //const boundHandler: (event: Event) => void
  
boundHandler(new Event("click")) // bound version: ok
myClickHandler.call(myButton, new Event("click")) // also ok
```

Note TypeScript understands that .bind, .call or .apply will result in the proper this being passed to the function as part of its invocation.