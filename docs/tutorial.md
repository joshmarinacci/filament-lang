
# Filament Tutorial

Welcome to Filament, a humanist programming language. Computers are amazing. They can calculate incredible things 
super fast. They can answer questions and draw graphics. However, computers are actually very dumb. All they do is 
simple arithmetic. What makes them amazing is that they can do it *super duper fast*. To do smart things humans 
have to teach them.  This is called programming. Anyone can program, including you!


# Arithmetic

Filament understands arithmetic. Try typing in a math question like `2+2` then press the 'run' 
button (or type control-return on your keyboard). Filament will show you the answer: `4`.  
Now try dividing 4 by 2 or multiplying 3 by 5. Type in `4/2`. Run it. Then type `3 * 5`.  
Filament uses `/` to mean division and `*` for multiplication.

Filament understands longer math equations too. For example, imagine you have a 
refrigerator box that is 7 feet tall by 4 feet wide by 4 feet deep. You could find out the volume of 
the box by multiplying all of the sides.

```filament
7 * 4 * 4
```


## Units

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
Filament understands the full names and abbrevations for over a hundred kinds of units, 
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

```filament
today() - date(month:1, day:15, year:2003) as seconds
```

If you try to convert something that can't be converted, like area to volume, then Filament will let you know. Try this:

```filament
7ft * 4ft as gal
```

results in
```
Error. Cannot convert ft^2 to gallons.
```

Units are very important. They help make sure our calculations are correct. 
Even professionals get this wrong some times.
[NASA once lost a space probe worth over 100 million dollars](https://www.latimes.com/archives/la-xpm-1999-oct-01-mn-17288-story.html) because the software didn't 
convert correctly between imperial and metric units. 


## Superman

Now lets try a more complex problem. In one of the Superman movies he flies so fast that the world turns backwards and reverses time. That got me thinking. Is that realistic? The earth is pretty big. How long would it really take him to fly around the world?

We need some information first. How fast can Superman fly? Apparently the comics are pretty vague about his speed. Some say it's faster than light, some say it's infinite, some say it's just slighly slower than The Flash.  Since this is about the real world let's go with an older claim, that [Superman is faster than a speeding bullet](https://screenrant.com/superman-faster-speeding-bullet-confirmed/).  According to the internet, the fastest bullet ever made was was the [.220 Swift](https://en.wikipedia.org/wiki/.220_Swift) which can regularly exceed 4,000 feet per second. [The fastest recorded shot was at 4,665 ft/s](https://www.quora.com/Whats-the-fastest-bullet-in-the-world-What-makes-it-so-fast-How-are-they-made), so we'll go with that.

Now wee need to know how big the earth is. The earth isn't perfectly spherical and of 
course it would depend on exactly which part of the earth superman flew, but [according to Wikipedia](https://en.wikipedia.org/wiki/Earth) the
average (mean) radius of the Earth is *6,371.0* kilometers. We also know the circumference of a circle 
is `2 * pi * radius`. So the equation is

```tilament
(6371.0km * pi * 2) / 4000ft/s as hours  
```

Pretty fast. He could almost go three times around the earth in a single 24 hour day. But not 
as fast as the movie said.


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

## Making Lists

Sometimes you need to generate a list. Suppose you wanted to know the sum of every number from 0 to 100.
Of course you *could* write out the numbers directly, but Filament has a way to generate lists for you. It's called `range`.

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

```filament
//you can use underscores to separate digits. they will be stripped out before calculations
range(10_000)
```

Lists are very useful for lots of things, but sometimes you get more numbers than you need. Suppose you wanted all the numbers from from 0 to 20 minus the first three. Use take(list,3). Want just the last three use take(list,-3)

```filament
list << range(10)  // [0,1,2,3,4,5,6,7,8,9]
take(list, 3)         // [0,1,2]
```

```filament
list << range(10)  // [0,1,2,3,4,5,6,7,8,9]
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

## Math with Lists

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

Doing math with lists is also great for working with vectors. You can add them,
multiply as the dot product, and calculate the magnitude.

```filament
V1 << [0,0,5]
V2 << [1,0,1]

V1 + V2 // add vectors
V1 * V2 // dot product of vectors
sqrt(sum(power(V1,2))) // magnitude of vector
```

## Filtering and Mapping Lists

Lists let you search for data too. You can find items using select and a small function. Let's find
all of the prime numbers up to 10000

```filament
select(range(100), where:is_prime)
```

or all numbers evenly divisible by 5

```filament
def div5(x:?) {
  x mod 5 = 0
}
select( range(100), where: div5 )
```

And one of the best parts about lists is that they can
hold more than numbers. You can work with
lists of strings, numbers, booleans.  Consider this simple list of people.

```filament
friends << ["Bart", "homer","Ned"]
```

or a list of booleans

```filament
[true,false,true]
```


# Drawing Data

## Bar Charts
One of the coolest things about lists is that you can *draw* them.
Just send a list into the `chart` function to see it as a bar chart.
Suppose you had a list of heights of your friends.

```filament
chart([88,64,75,59])
```

or just want to draw the numbers from 0 to 9.

```filament
chart(range(10))
```

## Plotting equations

While you could use `range`, `map`, and `chart` to draw pictures of
`x`, `power(x,2)`, `sin()` or other math equations, there is a much
better way: using the `plot` function.

A quadratic equation

```filament
plot(y: (x) -> (x**2 - 3*x -4))
```

Sine wave

```filament
plot(y: theta -> sin(theta*2))
```

A polar Archimedes spiral

```filament
spiral << theta -> 0.25*theta
plot(polar:spiral, min:0, max:pi*32)
```



## Charts Datasets

Even better than pulling in your own data, is working with curated datasets
that have already been assembled.  Filament comes with datasets for

* Periodic table of elements
* Letters of the English Alphabet  
* Planets of the solar system
* Countries of the world

When you load a dataset it will be shown as a table.

```filament
elements << dataset('elements')
```

Each column in the table is a field of each record in the datasets.

Let's suppose you want to compare the sizes of the planets. First load the 
planets dataset.

```filament
planets << dataset('planets')
```

Now add a chart to draw the planets.

```filament
planets << dataset('planets')
chart(planets)
```

Hmm. That doesn't look right.  Chart doesn't
know what part of the planets dataset we want
to draw. We have to tell it. Let's use `mean_radius` for the height of the bar chart. For the label under each bar we can use the `name` property. We can tell the chart function what to do using the named arguments `x_label` and `y`.


Now let's compare the radius of the orbit to the radius of the planet. This will show us if the smaller planets are clustered together or spread out.

```filament
planets << dataset('planets')
chart(planets, type: 'scatter', x: 'orbital_radius', y: 'mean_radius')
```

Here's a fun one. Let's see which letters have one syllable vs two.

```ilament
//TODO: this is broken when doing builddocs
chart(dataset('letters'), y_value:'syllables')
```

Let's check out the relative heights of the tallest buildings in the world:


```filament
buildings << dataset('tallest_buildings')
b2 << take(buildings,5) 
chart(b2, y:'height', x_label:'name')
```




## Histograms


```filament
states << dataset('states')
first_letter << (state:?) -> take(get_field(state,'name'), 1)

states << map(states, first_letter)
histogram(states)
```



Statehood date by year by decade

```filament
states << dataset('states')
get_year << state -> {
    field << get_field(state, 'statehood_date')
    dt << date(field, format:"MMMM dd, yyyy")
    get_field(dt,'year')
}
years << map(states, with:get_year)
histogram(years, bucket:10)            
```

# Random Numbers

Filament can generate random numbers for you. Now you might wonder why this is useful. It turns out 
random numnbers are *incredibly* useful for all sorts of things, from drawing graphics to simulations,
and of course they are heavily used in video games.

To make a random number just call `random`

```filament
random()
```

Every time you run this function it will return a different number.

By default the number will always be between 0 and 1, but you can choose a different `max` and `min` if you want.
Suppose you want twenty random numbers between 5 and 10 you could do this:

```filament
range(20) >> map(with: n-> random(min:5,max:10))
```

Mapping a range is an easy way to create a list, then call random on each one to make the final numbers. 
However, making random numbers is so common you can just call `random` directly using `count`.

```filament
random(min:5, max:10, count:20)
```

## Random Colors

Now let's use it to make some random colors.  
First I want to give [Martin Ankerl](https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/) credit
for his original article on making pretty random colors. Thanks Martin.

In Filament, colors are made using a list of three numbers, each from 0 to 1. They represent the
red, green, and blue (RGB) parts of the color.  Thus `[0,1,0]` would be pure green and `[1,1,1]` is
pure white.

Let's make 20 randomly colored squares.

```tilament
make_square << () {
    rect( width: 20, 
        height: 20, 
        fill_color: [random(),random(),random()]
    )
}
range(20) >> map(with:make_square) >> row() >> draw()
```

Hmm. Those are pretty ugly. Some colors are too dark. Some are too similar. The problem
is that we are using the RGB color space. We don't have a way to make the colors more similar easily.
However, there is another color space we can use called HSV for Hue Saturation and Value.
This way we can have a single number for the hue (the 'color'), and keep the saturation and value
fixed. Then we can convert them back to RGB to draw them.

Have `HSV_TO_RGB` function. Takes h,  s, v in 0-1 range, returns RGB in 0-1 range.

```tilament
make_square << () {
    color << [random(), 80%, 90%]
    rect( width: 20, 
        height: 20, 
        fill_color: HSV_TO_RGB(color)
    )
}
range(20) >> map(with:make_square) >> row() >> draw()
```
In the code above we choose a random hue but keep the saturation at 0.8 (sort of pastel like)
and the brightness almost at 100%.

Let's try that again with different S and V values

Generate again but keep s=0.5 and v=0.95

```tilament
make_square << () {
    color << [random(), 80%, 90%]
    rect( width: 20, 
        height: 20, 
        fill_color: HSV_TO_RGB(color)
    )
}
range(20) >> map(with:make_square) >> row() >> draw()
```

better.

However, it's still pretty random. You'll notice that sometimes the colors clump together. Instead
we'd like to have them distributed evenly across the hue. There's a clever trick we can use with the
golden ratio.Start with a random number then add the GR to it. Each time we wrap it back around at 1.
This works because the hue is like a circle. When you go far enough to the right edge it wraps back around.
Thanks to the golden ratio it will keep looping around and always pick a new hue value distant from
the previous ones.

Instead let’s make it evenly distributed across the hue using golden ratio. Start with a random number then add golden_ratio_conjugate for each time through and wrap at 1. Requires a real loop, not a map or reduce. Or needs a global variable the lambda references.
Show another 20. Looks good.

```tilament
h << random()
make_square << () {
    h << ((h + GR) mod 1)
    color << [h, 80%, 90%]
    rect( width: 20, height: 20, fill_color: HSV_TO_RGB(color) )
}
range(20) >> map(with:make_square) >> row() >> draw()
```


Show it a few times with different saturations and values.

There we go. That looks great!


# Making Shapes

Filament makes it easy to draw shapes. Let's start with some simple squares.

## Drawing Squares


To create a square call the `rect` function with a width and height, then
send it into the `draw()` function to show up on the screen.

```filament
rect(width:100, height:100) >> draw()
```

By default the shape is the upper left, but you can change the x and y to put it wherever you want.

```filament
rect(x:200,y:100,width:100,height:100) >> draw()
```

If you want to draw more than one shape, just put them into a list.
You can even use units for the size of your shapes. Below are two
rectangles, one in centimeters and one in inches. If you don't include
any unit then Filament assumes it is in pixels.

```filament
[
 rect(x:0, width:1cm, height: 5cm),
 rect(x:50, width:1in, height: 1in)
] >> draw()
```

Along with size, you can also set the color of shapes using
the `fill` argument. You can set it to named colors as strings like
`"red"`, `"green"`, and `"green"` or use a list of three numbers
between 0 and 1.  These will be interpreted as RGB values.

so 

```filament
rect(width:10cm,height:10cm,fill:'blue') >> draw()
```

is the same as

```filament
rect(width:10cm,height:10cm,fill:[0,0,1]) >> draw()
```

You can draw multiple shapes by putting them
into a list, but then they might draw on top of each other
unless you manually set their x,y positions. Since it's 
common to want to put shapes next to each other, you can
use the row function to space them out, with an optional
`gap` parameter


```filament
[
    rect(width:10cm, height:20cm, fill:'red'),
    rect(width:10cm, height:20cm, fill:'green'),
    rect(width:10cm, height:20cm, fill:'blue')
] >> row(gap:1cm) >> draw()
```

Can you guess what column does? :)

This means you could make your own bar chart from scratch!

```filament
range(5) >>
    map(with: n -> rect(width:1cm, height:n*5cm)) >>
    row(valign:"bottom", halign:"center") >>
    draw()
```

## Other Shapes

circle

```filament
circle(x:50,y:50, fill:'aqua') >> draw() 
```

## making art

Make some cool artwork with random numbers

```filament
make << (n) -> {
    rect(
        x: random()*200,
        y: random()*200,
        width:100,
        height:100,
        fill: [n/100,random(),0]
    )
}
range(100) >> map(with:make) >> draw()
```

# Images

## new images with code

```filament
make_image(width:100,height:100) 
    >> map_image(with:(x,y,c) -> {
        [1,0,0]
        })
```

colors are represented as RGB, in the range 0 to 1.
red << [1,0,0]
blue << [0,0,1]
gray << [0.5,0.5,0.5] or [50%, 50%, 50%]


fill with random grayscale colors

fill with a checkerboard

draw a circle using the implicit equaiton, everything closer to the origin than 20 is red, else blue
siilar to how GSL shaders work


## modify existing images
load an image from the web

map it to remove the red channel

map_image gives you a color for each pixel in the image, then you can return a new color, or modify the existing color.
lets drop the red channel

[0, c[1], c[2]]

make an image grayscale with naive code

lets make this cleaner using some functions. to get brightness we multiply each part by a value, then add them
    lerp(sum(c * gs), red, blue)
make lerp to go between one color and another using the brigtness
use it to make a sepia. use white and brown, a second using red and blue
call it 'mix' instead of lerp.








# Turtle Graphics


Based on this tutorial. *link*

## how turtles move

Image a turtle walking around. Starts at the center.

Move forward 100. See what it looks like. Should show turtle on screen.

Now turn right and move again. See L shape.

Now make a square by doing it 4 times.

This is annoying, so let’s make a function called square which draws it for us in a loop (use range and map)

## Shapes

Now make a function to draw a hexagon.

Now make an N-gon, pass in sides and size

Do it with 100 and see it looks like a circle.

Draw n gon, rotate slightly, draw again.  Repeat 50  times.

## Colors

Now switch color on each time.

Draw a leaf shape, loop to make a flower.




