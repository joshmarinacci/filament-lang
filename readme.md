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