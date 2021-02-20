This is the parser and runtime library implementing the Filament language.


Install with 

```shell
npm install --save filament-lang
```

Evaluate code:

```javascript
//read the source grammar first
let grammar_source = (await fs.readFile('node_modules/filament-lang/src/filament.ohm')).toString();
await setup_parser(grammar_source)
let ret = await eval_code('42ft')
console.log("we should have a scalar with 42 and feet for the unit:",ret)
```

produces a scalar object with the value of 42 feet

```javascript
(ret.value === 42)
(ret.unit  === 'foot')
(ret.dim   === 1)

//as a string
console.log(ret.toString())
```

Filament has a bunch of built-in functions for math, lists, and data access. You can add your own functions
by customizing the scope and passing it into `eval_code`.

```javascript

let double = new FilamentFunction('double',
    {value:REQUIRED},
    (a) =>scalar(a.value*2,a.unit,a.dim)
)

let scope = make_standard_scope()
scope.install(double)

console.log("4 doubled is", await eval_code('double(42,ft)',scope))
```

Read the tutorial. *link*


# Roadmap

* next blog
  * if then else statement. thought a lot about the syntax. block or expression works.
  * lambdas. thought a ton about this. all functions are lambdas now with streamlined syntax. the way to make it easy is to introduce it slowly.
  * no return/break/continue/jump/gotos. no early return of any kind. everything flows through. scratch has no break statement (other than end). I think logo doesn't either. 
  * turtle graphics
  * gui: symbol explorer. start of syntax highlighting.
  * print function to go to JS console. just for my own debugging.

* match syntax?
* scene graph for rects and circles and polygons
  * row of rects w/ size defined in centimeters. Customize colors
* random number generator and a series of examples to show noise based code
* image generator function
    [-] do callback function for every pixel
    [-] mandlebrot
    [-] Make image from random noise
    [-] Color image based on row or column
    [-] Color image using equations like with shaders
  


```filament
//make vertical stripes with colors
red << [1,0,0]
green << [0,1,0]
make_image(width:100, height: 100, generate:(x,y) -> {
   if x mod 2 == 0 then red else green
})
//make checkerboard with direct color arrays
make_image(width:100, height: 100, generate:(x,y) -> {
   if x mod 2 == 0 or y mod 2 == 0 
     then [1,1,1]
     else [0,0,0]
})

//white noise
make_image(width:100, height: 100, generate:(x,y) -> {
    n << random(min:0,max:1)
    [n,n,n]
})
```



