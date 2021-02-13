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

Read the tutorial.

