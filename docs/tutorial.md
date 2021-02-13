
# Filament Tutorial

Welcome to Filament, a humanist programming language. Computers are amazing. They can calculate incredible things 
super fast. They can answer questions and draw graphics. However, computers are actually very dumb. All they do is 
simple arithmetic. What makes them amazing is that they can do it *super duper fast*.  To do smart things humans 
have to teach them.  This is called programming. Anyone can program, including you!


## Arithmetic

Filament understands arithmetic. Try typing in a math question like `2+2` then press the 'run' 
button (or type control-return on your keyboard). Filament will show you the answer: `4`.  
Now try dividing 4 by 2 or multiplying 3 by 5. Type in `4/2`. Run it. Then type `3 * 5`  
Filament uses `/` to mean division and `*` for multiplication.

Filament understands longer math equations too. For example, imagine you have a 
refridgerator box that is 7 feet tall by 4 feet wide by 4 feet deep. You could find out the volume of 
the box by multiplying all of the sides.

```filament
7 * 4 * 4
```


### Units

In the above problem only *we* know that the `7` meant `7 feet`. The computer doesn't 
know because we didn't tell it. Fortunately Filament lets us tell the computer exactly what 
units we mean. Let's try that again with units:

```filament
7feet * 4feet * 4feet
```

Now we get `112 cuft`.  Cool. Filament knows to convert the answer into cubic feet.  
But what if we didn't want cubic feet. We are talking about volume and there are 
several different units that could represent volume. Let's ask Filament to convert it into 
gallons instead.

```filament
7ft * 4ft * 4ft as gal
```

which gives us the answer `837.81 gallons`.

Notice that this time we abbreviated `feet` to `ft` and `gal` for `gallons`.   
HL understands the full names and abbrevations for over a hundred kinds of units, 
and it can convert between any of them.  Here's a few more examples to try.

Convert your height into centimeters. I'm 5 foot four inches so

```filament
5feet + 4inches as cm 
```

Some kitchen math:

```filament
2cups + 4tablespoons
```

Calculate your age in seconds.

```tfilament
now() - date("Jan 1st, 2003") as seconds
```

If you try to convert something that can't be converted, like area to volume, then Filament will let you know. Try this

```filament
7ft * 4ft as gal
```

results in
``
Error. Cannot convert ft^2 to gallons.
``

Units are very important. They help make sure our calculations are correct. 
Even professionals get this wrong some times.
[NASA once lost a space probe worth over 100 million dollars](https://www.latimes.com/archives/la-xpm-1999-oct-01-mn-17288-story.html) because the software didn't 
convert correctly between imperial and metric units. 


### Superman

Now lets try a more complex problem. In one of the Superman movies he flies so fast that the world turns backwards and reverses time. That got me thinking. Is that realistic? The earth is pretty big. How long would it really take him to fly around the world?

We need some information first. How fast can Superman fly? Apparently the comics are pretty vague about his speed. Some say it's faster than light, some say it's infinite, some say it's just slighly slower than The Flash.  Since this is about the real world let's go with an older claim, that [Superman is faster than a speeding bullet](https://screenrant.com/superman-faster-speeding-bullet-confirmed/).  According to the internet, the fastest bullet ever made was was the [.220 Swift](https://en.wikipedia.org/wiki/.220_Swift) which can regularly exceed 4,000 feet per second. [The fastest recorded shot was at 4,665 ft/s](https://www.quora.com/Whats-the-fastest-bullet-in-the-world-What-makes-it-so-fast-How-are-they-made), so we'll go with that.

Now wee need to know how big the earth is. The earth isn't perfectly spherical and of course it would depend on exactly which part of the earth superman flew, but [according to Wikipedia](https://en.wikipedia.org/wiki/Earth) the
average (mean) radius of the Earth is *6,371.0* kilometers.

Now we can divide these and convert to hours to see how long it would take.

```tilament
 6371.0km / 4000ft/s as hours
```

So pretty fast. In fact.

Oh, wait, That's not right. We are using the radius of the earth, not the circumference.  We know the circumferce of a circle is 2\*pi\*radius. Let's try that again.

```tilament
(6371.0 km * 3.14 * 2) / 4000ft/s as hours  
```

So still pretty fast. He could almost go three times around the earth in a single 24 hour day.


Programming is both fun and useful. We can instruct computers to help us answer all sorts of interesting questions.  In the next section we'll learn about groups of numbers called lists, and how to do interesting math with them.


# Lists


Now let's take a look at lists. Imagine you want to add up some numbers. You could do it by adding each number separately like this:

```filament
4 + 5 + 6 + 7 + 8
```
or you could make them a list and use the sum function.

```filament
sum([4,5,6,7,8])
```

Sum is a built in function that will add all of the items in a list. There are a lot
of other cool functions that work on lists.  You can sort a list

```filament
sort([8,4,7,1])
```

get the length

```filament
length([8,4,7,1])
```

or combine sum and length to find the average

```filament
nums << [8,4,7,1] 
sum(nums) / length(nums)
```

Sometimes you need to generate a list. Suppose you wanted to know the sum of every number from 0 to 100.
Of course you *could* write out the numbers directly, but HL has a way to generate lists for you. It's called `range`.

```filament
// make a list from 0 to 9
range(10)
// = [0,1,2,3,4,5,6,7,8,9]
// sum the numbers from 0 to 99
sum(range(100))
// 4950
```

Range is flexible. You can give it both a start and end number, or even jump by steps.

```filament
range(min:20,max:30)
```

```filament
range(100,step:10)
```

Remember that range will start at the minmum and go to one less than the max. So 0 to 10 will go up to 9.

Filament can handle big lists. If you ask for range(0,10_000_000) it will show the the first few and then ... before the last few.

```tilament
//you can use underscores to separate digits. they will be stripped out before calculations
range(10_000)
// [0, 1, 2, 3 .... 99_999_998, 99_999_999]
```

Lists are very useful for lots of things, but sometimes you get more numbers than you need. Suppose you wanted all the numbers from from 0 to 20 minus then just the first three. Use take(list,3). Want just the last three use take(list,-3)

```filament
list << range(10)  // [0,1,2,3,4,5,6,7,8,9]
take(list, 3)         // [0,1,2]
take(list, -3)        // [7,8,9]
```
You can also remove items from a list with drop

```filament
drop(range(10), 8)  //remove the first 8
// = [8,9]
```

And finally you can join two lists together

```filament
join([4,2], [8,6])
```

In addition to holding data, lists let you do things that you could do on a single number, 
but in bulk. You can add a single number to a list

```filament
1 + [1,2,3]
```

or add two lists together

```filament
[1,2,3] + [4,5,6]
```

It might seem strange to do math on lists but it's actually quite useful. 
Image you had a list of prices and you would like to offer a 20% discount.
You can do that with a single multiplication.

```filament
prices << [4.86, 5.23, 10.99, 8.43]
sale_prices << 0.8 * prices
```

Suppose you sold lemonade on four weekends in april, and another four in july. It would be nice
to compare the sales for the different weekends to see if july did better thanks to warmer weather.
You can do this by just subtracting two lists.

```filament
april << [34, 44, 56, 42]
july  << [67, 45, 77, 98]
july - april
```

doing math with lists is also great for working with vectors.

```javascript
V1 = [0,0,5]
V2 = [1,0,1]

V1 + V2 // add vectors
V1 * V2 // dot product of vectors
sqrt(sum(power(V1,2))) // magnitude of vector
```


Lists let you find data too. you can search for items using select and a small function. lets find
all of the primes up to 10000

```filament
select(range(100), where:is_prime)
```

or all numbers evenly divisible by 5

```filament
def good(x:?) {
  x mod 5 = 0
}
select( range(100), where: good )
```

## charts

One of the coolest things about lists is that you can *draw* them.
Just send a list into the `chart` function to see it as a bar chart.
Suppose you had a list of heights of your friends.

```filament
chart([88,64,75,59])
```

or just draw the numbers from 0 to 9

```filament
chart(range(10))
```

## plotting equations

While you could use `range`, `map`, and `chart` to draw pictures of
`x`, `power(x,2)`, `sin()` or other math equations. However, the
`plot` function is a better choice.

A quadratic equation

```filament

def quad(x:?) {
    x**2 - 3*x - 4
}

plot(y:quad)
```

Sine wave

```filament
def fun(theta:?) {
    sin(theta*2)
}
plot(y:fun)
```

A polar Archimedes spiral

```filament
def fun(theta:?) {
    0.25*theta
}
plot(polar:fun)
```




And one of the best parts about lists is that they can hold more than numbers. You can work with
lists of strings, numbers, booleans.  Consider this simple list of people.

```javascript
friends << ["Bart", "homer","Ned"]
```

the editor will show a list of strings

*screenshot*


# charts from lists and datasets

Even better than pulling in your own data, is working with curated datasets
that have already been assembled.  Filament comes with datsets for

* Periodic table of elements
* Letters of the English Alphabet
* Planets of the solar system
* Countries of the world.

When you load a dataset with

```filament
elements << dataset('elements')
```
it looks like this:

![elements table](docs/images/elements_table.png)

Each column in the table is a field of each record in the datasets.

Let's suppose you want to compare the sizes of the planets. First load the planets dataset. It looks like this:

![planets table](docs/images/planets_table.png)


Now add a chart to draw the planets.

Hmm. That doesn't look right.  Chart doesn't
know what part of the planets dataset we want
to draw. We have to tell it. Let's use `mean_radius` for the height of the bar chart. For the label under each bar we can use the `name` property. We can tell the chart function what to do using the named arguments `x_label` and `y`.


Now let's compare the radius of the orbit to the radius of the planet. This will show us if the smaller planets are clustered together or spread out.

```filament
planets << dataset('planets')
chart(planets, type: 'scatter', x: 'orbital_radius', y: 'mean_radius')
```

Here's a fun one. Let's see which letters have one syllable vs two.

```tilament
chart(dataset('letters'), y_value:'syllables')
```

Let's check out the relative heights of the tallest buildings in the world:


```filament
buildings << dataset('tallest_buildings')
b2 << take(buildings,5) 
chart(b2, y:'height', x_label:'name')
```



