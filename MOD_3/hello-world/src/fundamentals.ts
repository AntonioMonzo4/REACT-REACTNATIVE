//Fundamentos de typescript

//Basic Types

/**
 * any
 * void
 * boolean 
 * number
 * string
 * null
 * undefined
 * bigint
 * symbol
 * string[]
 * [string,number]
 * string | null | undefined  == union type 
 * never
 * unknown 
 */

/**
 * enum Color {
 * Red,
 * Green,
 * Blue=4
 * };
 */

/**
 * let isDone: boolean = false;
 * let decimal: number = 6;
 * let color: string = "blue";
 * let c: Color = Color.Green;
 */

/**
 * function add(a: number, b:number): number {
 * return a + b;
 * }
 */


//ASSERTIONS 
let input: unknown = "Hello World";
let len: number = (input as string).length;
let len2: number = (<string>input).length; //No se puede de JSX 


function object(this: {a: number, b: number}, a: number, b: number) {
  this.a = a;
  this.b = b;
  return this;
}

// this is used only for type declaration
let c = object.call({a: 0, b: 0}, 1, 2);
// c has type {a: number, b: number}


//INTERFACES 
function printLabel (options: { label: string }) {
  console.log(options.label)
}

// Note the semicolon
function getUser (): { name: string; age?: number } {
}

interface User {
  name: string;
  age?: number;
}

interface User {
  readonly name: string
}

interface LabelOptions {
  label: string
}

function printLabel(options: LabelOptions) { ... }

{
  [key: string]: Object[]
}

//Type Aliases
type Name = string | string[]
interface Colorful { ... }

interface Circle { ... }
 
type ColorfulCircle = Colorful & Circle;


//FUNCTIONS TYPES 
interface User { ... }

function getUser(callback: (user: User) => any) { callback({...}) }

getUser(function (user: User) { ... })

//CLASSES
class Point {
  x: number
  y: number
  static instances = 0
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class Point {...}

class Point3D extends Point {...}

interface Colored {...}

class Pixel extends Point implements Colored {...}

class Point {
  static instances = 0;
  constructor(
    public x: number,
    public y: number,
  ){}
}

class Point {
  public someUselessValue!: number;
  ...
}

//Generics 
class Greeter<T> {
  greeting: T
  constructor(message: T) {
    this.greeting = message
  }
}

let greeter = new Greeter<string>('Hello, world')

//MODULOS

export interface User { ... }

//type extractions

interface Building {
  room: {
    door: string;
    walls: string[];
  };
}

type Walls = Building['room']['walls']; // string[]

//keyof 
type Point = { x: number; y: number };

type P = keyof Point; // x | y

//Conditional Types

// SomeType extends OtherType ? TrueType : FalseType;

type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]

//Inferring 
pe GetReturnType<T> = T extends (...args: unknown[]) => infer R
  ? R
  : never;

type Num = GetReturnType<() => number>; // number
type First<T extends Array<any>> = T extends [infer F, ...infer Rest] ? F : never;

type Str = First<['hello', 1, false]>; // 'hello'

//Literal Types

const point = { x: 4, y: 2 }; // { x: number, y: number }

const literalPoint = { x: 4, y: 2 } as const; // { readonly x: 4, readonly y: 2 };

//Template Literal Types

type SpaceChar = ' ' | '\n' | '\t';

type TrimLeft<S extends string> = S extends `${SpaceChar}${infer Rest}` ? TrimLeft<Rest> : S;

type Str = TrimLeft<'    hello'>; // 'hello'