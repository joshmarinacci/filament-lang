This is the parser and runtime library implementing the Filament language.


Install with 

```shell
npm install --save filament-lang
```

Evaluate code:

```javascript
await setup_parser()
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

load_image(src:'url') >> map(with:(c,x,y) -> {
    [ c[0]*0.25, c[1]*0.25, c[2]*0.5 ]
}) 
 make_color(c.r* 0.25, c.g * 0.25,c.b * 0.5)
 // cross fade
c1*0.5 + c2*0.5
reduce(img1,img2, with:(ca,cb,x,y) {
    
})
map(img1,with(color,x,y) -> {
    color2 = get_pixel(img2,x,y)
    return color*0.5 + color2*0.5
}

brightness << (c)     -> c[0]*0.24 + c[1]*0.24 + c[2]*0.5
lerp       << (t,a,b) -> a * (1-t) + b * (t)

white << [1,1,1]
brown << [0.5,0.4,0.1]

sepia << (c,x,y) -> {
  b << brightness(c)
  lerp(b,white,brown)
}
load_image(src:"url") >> map(with:sepia)  

//mandlebrot will require loops
//do we need a color datatype which is an array plus some accessors?
need array access syntax.  
    identifier [ index ]
//simple raytracer will need loops and records / objects    
```



## Contributing to Filament

### Building a browser-compatible UMD module

The Filament source code may be bundled into an application via tools such as Webpack, using an
`import` or `require` statement. This mechanism should work in both the browser and NodeJS
environments.

In addition, it is possible to create a UMD module suitable for use in a browser-side HTML page.
This module may be included via a `<script>` tag, or (untested at this time) may be used in a NodeJS
environment via `require` or `import`.

To create the UMD module, use the following:

```
npm run build-umd
```

This will create a `dist/` directory and generate the following files in that directory:

- `dist/filament.js`

### Testing the built UMD module

An HTTP server is necessary to serve the contents of this repository. There are many to choose 
from, but for the purposes of this document, we will use [http-server](https://github.com/http-party/http-server#readme), 
which is installed as a development dependency via `package.json`.

After building the UMD module via `npm run build-umd`, the following command will serve up the 
content of the `test-umd/` directory:

```
npm run test-umd
```

You can then point your web browser at `http://127.0.0.1:8080` to see `test/index.html`.


### Publishing a new version to NPMJS

The following instructions are primarily for reference and for use by the primary Filament package
author when preparing to publish a new version.

- Update version number in `package.json`
- Ensure that Mocha tests run successfully `npm run test`
- Build UMD module via `npm run build-umd`
- Ensure that browser-side UMD tests run successfully `npm run test-umd` and 
  connecting to `http://127.0.0.1:8080`.
- Generate documentation via `npm run docs`
- Use `npm pack --dry-run` to view what files would end up in the published package. 
  Adjust `.npmignore` if there are files listed that should not be published.


