// Fundamentos de TypeScript

// Basic Types

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
 * [string, number]
 * string | null | undefined  == union type
 * never
 * unknown
 */

enum Color {
  Red,
  Green,
  Blue = 4,
}

let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let c: Color = Color.Green;
let big: bigint = 100n;
let unique: symbol = Symbol("id");
let list: string[] = ["a", "b"];
let tuple: [string, number] = ["age", 26];
let maybe: string | null | undefined = null;

function add(a: number, b: number): number {
  return a + b;
}

function unreachable(): never {
  throw new Error("nunca retorna");
}

// ASSERTIONS
let input: unknown = "Hello World";
let len: number = (input as string).length;
let len2: number = (<string>input).length; // No se puede usar en archivos JSX (.tsx)

function setValues(this: { a: number; b: number }, a: number, b: number) {
  this.a = a;
  this.b = b;
  return this;
}

// this se usa solo para declaración de tipos
let obj = setValues.call({ a: 0, b: 0 }, 1, 2);
// obj tiene tipo { a: number; b: number }

// INTERFACES
function printLabel(options: { label: string }) {
  console.log(options.label);
}

// Note the semicolon
function getUser(): { name: string; age?: number } {
  return { name: "Ana" };
}

interface User {
  name: string;
  age?: number;
}

// Declaration merging: la segunda declaración se fusiona con la anterior
interface User {
  email: string;
}

interface LabelOptions {
  label: string;
}

printLabel({ label: "Hola" });

// Index signature
interface Dictionary {
  [key: string]: Object[];
}

// Type Aliases
type Name = string | string[];

interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;

const circulo: ColorfulCircle = { color: "rojo", radius: 2 };

// FUNCTIONS TYPES
function onUser(user: User) {
  console.log(user.name);
}

function getUserWithCallback(callback: (user: User) => void) {
  callback({ name: "Luis", email: "luis@ejemplo.com" });
}

getUserWithCallback(function (user: User) {
  console.log(user.email);
});

// CLASSES
class Point {
  x: number;
  y: number;
  static instances = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    Point.instances++;
  }
}

class Point3D extends Point {
  z: number;
  constructor(x: number, y: number, z: number) {
    super(x, y);
    this.z = z;
  }
}

interface Colored {
  paint(): void;
}

class Pixel extends Point implements Colored {
  paint() {
    console.log(`Pintando en (${this.x}, ${this.y})`);
  }
}

// Parameter properties
class PointParams {
  constructor(
    public x: number,
    public y: number,
  ) {}
}

// Definite assignment
class PointDefinite {
  public someUselessValue!: number;
}

// Generics
class Greeter<T> {
  greeting: T;
  constructor(message: T) {
    this.greeting = message;
  }
}

let greeter = new Greeter<string>("Hello, world");

// MODULOS
export interface ApiResponse<T> {
  data: T;
}

// type extractions
interface Building {
  room: {
    door: string;
    walls: string[];
  };
}

type Walls = Building["room"]["walls"]; // string[]

// keyof
type PointCoords = { x: number; y: number };

type P = keyof PointCoords; // x | y

// Conditional Types

// SomeType extends OtherType ? TrueType : FalseType;

type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]

// Inferring
type GetReturnType<T> = T extends (...args: unknown[]) => infer R
  ? R
  : never;

type Num = GetReturnType<() => number>; // number
type First<T extends Array<any>> = T extends [infer F, ...infer Rest] ? F : never;

type FirstStr = First<["hello", 1, false]>; // 'hello'

// Literal Types

const point = { x: 4, y: 2 }; // { x: number, y: number }

const literalPoint = { x: 4, y: 2 } as const; // { readonly x: 4, readonly y: 2 };

// Template Literal Types

type SpaceChar = " " | "\n" | "\t";

type TrimLeft<S extends string> = S extends `${SpaceChar}${infer Rest}` ? TrimLeft<Rest> : S;

type Trimmed = TrimLeft<"    hello">; // 'hello'
