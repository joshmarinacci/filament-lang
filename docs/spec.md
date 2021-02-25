# Operators

## Boolean Operators

* `<` less than
* `>` greater than
* `<=` less than or equal
* `>=` greater than or equal
* `=`  equal 
* `<>` boolean NOT equal
* `!=` boolean NOT equal?  What about unicode: `≠`

* `and` boolean AND
* `or`  boolean OR
* `not` boolean NOT

## Math Operators

* `+` add(a,b), addition
  
* `-` sub(a,b) subtraction
* `*` mul(a,b) multiplication
* `/` div(a,b) division
* `**` pow(a,b)  exponentiation
* `-` neg(a)  negative sign (depending on context)
* `!` fact(a) factorial
* `mod` mod(a) modular (*remainder*) division. `%` is used for percentages

## All the rest

`()` parenthesis for grouping and function calls
`[]` square brackets for list literals, maps to `list(a,b,c,...)` function
`<<` assign
`>>` assign and pipeline operator (depending on the context)
`as` convert to a specified unit. ex: `10cm as inches`. works on lists.


## specifically not included

* bit shifting `<<` `>>`
* bitwise booleans `|` `&`
* increment and decrement shortcuts:  `--` `-=` `+=` `++`
* symbols for boolean AND, OR, NOT, XOR
* ranges: `1..10`, `1..<10` and other comprehensions (may revisit)
* % for modular division. use `mod` instead
* curly braces `{}` are currently not used and are often harder to type on non English (QWERTY) keyboards.


# alternatives

* pipeline: `|` `|>` `->`
* anonymous function calls: `(x)=>(x*2)` or `(x)={x*2}`
* apply operator over a list `@/` `//` or `over`.  ex:  `+ over [1,2,3]` to calculate the total.
* allowing `-` or whitespace inside identifiers. Would this cause more trouble than it's worth?


# Unicode operators and identifiers

While any unicode characters can be used in strings and identifiers, 
these will likely have special support in the interface to make them easier
to enter. They will also be shown in their unicode form in the "print ready" syntax.

* theta `ø` or **&#952;**
* pi **π** or **∏**
* alpha **&#945;**
* sigma **&#963;** and **&#931;**
* not equal **&#8800;**, greater than or equal, and less than or equal
* right arrow **&#8594;** replaces >> 
* left arrow **&#8592;** replaces <<
* curved arrow **&#11148;** or **&#11181;** replaces return ??


# identifiers

Identifiers can (currently) use

* alphanumeric `A-Za-z`
* digits `0-9`
* underscore `_`


Other special characters such as `~@#$^&;?` should not 
be used since they may be used in the future.

Whitespace is not significant, but is not allowed inside of indentifiers, since they
are used for tokenization.

# number syntax

Numbers are the same as in most programming languages
(integer, floating point, hex). Octal is not supported. 
Binary is not currently supported (may revisit).


* integer `-? [0-9]+`  ex: 42
* decimal `-? [0-9]+ . [0-9]*` ex: 42.42
* scientific notation `decimal e integer` ex: 42.42e42
* hex: `0x [0-9] [A-F] [a-f]` ex: 0xFFAAbb.  Maybe also use # to indicate hex?

Underscores may be placed
anywhere within numbers to help with readability. They will
be stripped before evaluation.

`42_000_000` is easier to read than `42000000`

Units are word suffixes. They may or may not be separated
from the number part by a single space. Separating by newlines
is not allowed.

# strings

Single, double, and back quotes are all allowed for creating text literals.
There is no distinct character type.  *smart quotes* or curly quotes
will be replaced with their standard equivalent.

# functions

Functions are named by standard identifiers. They are called
using parenthesis with one or more arguments. Arguments
may be referred to by position (indexed) or name (keyword). 


Consider the `chart` function.

```tilament
myfun << (data:?, type:'point', color:'red') -> {  
  
}
```

`myfun` is an identifier. A function which takes x and y is
declared and assigned to myfun. Essentially all functions are
anonymous functions.   Each argument includes a default value.
The default of '?' means it has no default and must be provided
by the caller.

The arguments may be called by order or name. ex:

call by order
```tilament
myfun( [1,2,3], 'point', 'red')
```
call by keyword
```tilament
chart( data=[1,2,3], color='red')
```
call by order and keyword
```tilament
chart( [1,2,3], color='red')
```

Parameter resolution is as follows.

* all parameters may be specified by name or position (index)
* the parameters are prepared by the runtime from the call site at runtime.
    * all named args are filled in first, from left to right in the parameters def.
    * any indexed arguments are filled into missing parameters, left to right.
    * if there are no required parameters left, run the function
    * if there are unfilled required parameters, throw an error
* no varargs. use lists instead.
* inside the function you just use the named parameters. don't care about positional args or indexed vs keywords.


# pipeline operators

The `<<` and `>>` operators are called pipelines. They take something and pass it into something else. 
They are used to assign values to variables, and to pass the output of one function into the
first parameter of the next. 

assign 42 to answer

```filament
answer << 42
```

is the same as

```filament
42 >> answer
```

pass the output of range into the print function

```filament
range(10) >> print()
```

is the same as

```filament
print(range(10))
```




# control flow

The if statement works as follows

* The `if` keyword followed by a boolean expression, followed by `then`, followed by a block.
* Optional `else` block.
* blocks may be replaced by single expressions.

ex:

```tilament
if (x = 5) then {
  5
} else {
  10
}
```

using single expressions

```tilament
if x = 5 then 5 else 10 
```

the if statement itself is an expression, so it's result can be assigned to a variable
or used inside another expression

```tilament
x << 56
is_even << if x mod 2 = 0 then true else false 
```

=================

notes

if(
  test: exp,
  then: exp exp exp,
  else: exp exp exp
)

is_even << if(
  test: x mod 2 = 0
  then: true
  else: false
)

is_even << def (x:?) -> start x mod 2 = 0 end







