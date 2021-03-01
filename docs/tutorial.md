
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
However, making lists random numbers is so common you can just call `random` directly using `count`.

```filament
random(min:5, max:10, count:20)
```

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
use the `row` function to space them out, with an optional
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
circle(x:4cm,y:4cm, radius: 2cm, fill:'aqua') >> draw() 
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


## Random Colors

Now let's use it to make some random colors.  
First I want to give [Martin Ankerl](https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/) credit
for his original article on making pretty random colors. Thanks Martin.

In Filament, colors are made using a list of three numbers, each from 0 to 1. They represent the
red, green, and blue (RGB) parts of the color.  Thus `[0,1,0]` would be pure green and `[1,1,1]` is
pure white.

Let's make 20 randomly colored squares.

```filament
{
make_square << () -> {
    rect( width: 100, 
         height: 100, 
           fill: [random(),random(),random()]
    )
}
range(50) >> map(with:make_square) >> row(gap:0) >> draw()
}
```

Hmm. Those are pretty ugly. Some colors are too dark. Some are too similar. The problem is that we
are using the [RGB color space](https://en.wikipedia.org/wiki/RGB_color_space). We don't have a way
to make the colors more similar easily. However, there is another color space we can use called
[HSL](https://en.wikipedia.org/wiki/HSL_and_HSV) for Hue, Saturation, and Lightness. This way we can
have a single number for the hue (the 'color'), and keep the saturation and lightness fixed. Then we
can convert them back to RGB to draw them.

For the conversion we have a handy function called `HSL_TO_RGB` function. It takes the hue,
saturation, and lightness the 0-1 range, returns RGB in then 0-1 range.

```filament
{
make_square << () -> {
    color << [random(), 0.8, 0.9]
    rect(  width: 100, 
          height: 100, 
            fill: HSL_TO_RGB(color)
    )
}
range(50) >> map(with:make_square) >> row(gap:0) >> draw()
}
```

In the code above we choose a random hue but keep the saturation at 0.8 (sort of pastel like) and
the lightness almost at 100%.

Let's try that again with different S and L values. Lower the saturation to 0.5, meaning
it's partly gray, and move lightness to 50% (0.5)

```filament
{
make_square << () -> {
    color << [random(), 0.5, 0.5]
    rect( width: 100, 
         height: 100, 
           fill: HSL_TO_RGB(color)
    )
}
range(50) >> map(with:make_square) >> row(gap:0) >> draw()
}
```

These look better. Each color is the same distance from black and white, so we are getting some nice
hues.  However, it's still pretty random. You'll notice that sometimes the colors clump together.
Instead we'd like to have them distributed evenly across the hue.

There's a clever trick we can use with the golden ratio. Start with a random number then add the
golden ratio (1.618) to it. Each time we wrap it back around at 1. This works because the hue is
like a circle. When you go far enough to the right edge it wraps back around. Thanks to the golden
ratio it will keep looping around and always pick a new hue value distant from the previous ones.

Note that I'm using the Golden Ratio Conjugate, which is the reciprical of the Golden Ratio.
Also note that Filament doesn't have loops yet, so I'm using a recursive version.

```filament
{
GRC << 0.618033988749895        
make_square << (depth, h) -> {
    color << [h, 0.5, 0.5]
    if depth <= 0 then {
        rect( width: 100,  height: 100, fill: HSL_TO_RGB(color))
    } else {
        [rect( width: 100,  height: 100, fill: HSL_TO_RGB(color)),
        make_square(depth-1,h+GRC)]
    }
}
make_square(50, random()) >> row(gap:0) >> draw()
}
```


Show it a few times with different saturations and values.

There we go. That looks great!



# Images

## New Images from Scratch

Filament can create images with colors, just like shapes. The difference
is that an image is made of pixels and you must specify a width and height.

```filament
make_image(width:100,height:100) >> map_image(with:(x,y) -> {
    [1,0,0]
})
```

The code above creates an image filled with rect. The `map_image` calls
the function you pass to it for every pixel. This function should return a new
color for that pixel. Colors are represented as RGB, in the range 0 to 1, just
like with shapes.

This means `red << [1,0,0]`, `blue << [0,0,1]`, and `gray << [0.5,0.5,0.5]` or `[50%, 50%, 50%]`

Let's make another image where instead of using a single color, we calculate a new random grayscale
value for each pixel.

```filament
make_image(width:100, height: 100) >>
    map_image(with:(x,y,color) -> {
        n << random(min:0,max:1)
        [n,n,n]
    })
```

So far we have ignored the x and y values, but if we use them we can create
patterns that vary over space. Let's make stripes where teh color changes
based on if the x value is even or odd.

```filament
{
red << [1,0,0]
green << [0,1,0]
make_image(width:100,height:100) >> map_image(with:(x,y,color) -> {
   if x mod 2 = 0 then {red} else {green}
})
}
```

We can even draw shapes pixel by pixel using implict equations. For example if let's calculate
the distance of a pixel from the origin. If it's greater than some threshold then make it
be red, otherwise green. This is similar to how GPU pixel shaders work.

```filament
dist << (x,y) -> sqrt(x**2 + y**2)
make_image(width: 100, height:100) >>
    map_image(with:(x,y,c) -> {
    if dist(x,y)<100 then [0,1,0] else [1,0,0]
    })
```



## Loading Images from the Web

We can load an image from the web using the `load_image` function.
```filament
load_image(src:'https://vr.josh.earth/webxr-experiments/nonogram/thumb.png')
```

Once we have the image we can modify it. Let's drop the red channel by returning
a new color that only includes the green and blue values from the original pixels.

```filament
load_image(src:'https://vr.josh.earth/webxr-experiments/nonogram/thumb.png') >>
    mapimage(with:(x,y,c) -> {
        v1 << 0
        v2 << (c[1])
        v3 << (c[2])
        [v1,v2,v3]
    })
```

We can also make an image grayscale by averaging the colors.


```filament
load_image(src:'https://vr.josh.earth/webxr-experiments/nonogram/thumb.png') >>
    mapimage(with:(x,y,c) -> {
        n << sum(c)/3
        [n,n,n]
    })
```

Converting to grayscale by averaging the red green and blue does work, but it doesn't
loook very good. Taht's because it doesn't acocunt for the fact that the human
eye is more sensitive to blue than to green or red.  Let's create a few functions
to make it work better.

first we need brightness base on a more accurate grayscale conversion

```filament
brightness << (c) -> c[0]*0.299 + c[1]*0.587 + c[2]*0.114
```

Now let's create a function to mix two colors together using a t value
that goes from 0 to one. If t is 0 then you get only the first color. If it's 1 then you
get only the second color. Otherwise you get a mixture of hte two. Sometimes
this is called a lerp function, short for interpolate.

```filament
mix  << (t,a,b) -> a*t + b*(1-t)
```

Now that we can mix two colors, we can use black and white
for grayscale. But we could also use white and brown for a
sepia town, or even something crazier like red and blue.


```filament
{
brightness << (c) -> c[0]*0.299 + c[1]*0.587 + c[2]*0.114
mix  << (t,a,b) -> a*t + b*(1-t)
white << [1,1,1]
brown << [0.5,0.4,0.1]
sepia << (x,y,color) -> {
    brightness(color) >> mix(white,brown)
}

load_image(src:'https://vr.josh.earth/webxr-experiments/nonogram/thumb.png') 
    >> mapimage(with:sepia)
}
```


```filament
{
brightness << (c) -> c[0]*0.299 + c[1]*0.587 + c[2]*0.114
mix  << (t,a,b) -> a*t + b*(1-t)
red << [1,0,0]
blue << [0,0,1]
rb << (x,y,color) -> {
    brightness(color) >> mix(red,blue)
}

load_image(src:'https://vr.josh.earth/webxr-experiments/nonogram/thumb.png') 
    >> mapimage(with:rb)
}
```






# Turtle Graphics


Based on this tutorial. *link*

Turtle graphics is a different way of generating images than setting pixels or drawing shapes on the 
cartesian plane. Instead of saying "put a shape here", you have a turtle with a pen which draws the
shapes for you. I know that sounds confusing, so let's start with some examples.

## How Turtles Move

Image a turtle walking around in an infinite plane. Starts at the center and is pointed north. You can tell turtle to move forward or to turn. to start, let's tell it to move forward by 100 pixels.

```filament
turtle_start(0,0,0)
turtle_pendown()

turtle_forward(100)

turtle_done()
```

Now let's tell it to turn right and move forward another hundred.

```filament
turtle_start(0,0,0)
turtle_pendown()

turtle_forward(100)
turtle_right(90)
turtle_forward(100)

turtle_done()
```

Now we have an L shape. The turtle is carrying a pen, so every where it moves it draws a line.

Now let's make a square by doing it four times.

```filament
turtle_start(0,0,0)

turtle_forward(100)
turtle_right(90)
turtle_forward(100)
turtle_right(90)
turtle_forward(100)
turtle_right(90)
turtle_forward(100)
turtle_right(90)

turtle_done()
```

Now we have a square. Of course, writing 'right' 'forward' over and over is annoying. Instead let's use a loop to do it four times.

```filament
turtle_start(0,0,0)

range(4) >> map(with: () -> {
    turtle_forward(100)
    turtle_right(90)
})

turtle_done()
```

Much better.

## Shapes

Now that we know how to make a square, we can clearly see how to draw a hexagon. Loop 6 times
and turn right by 60 degrees 

```filament
turtle_start(0,0,0)

range(6) >> map(with: () -> {
    turtle_forward(100)
    turtle_right(60)
})

turtle_done()
```

We can start to see a pattern. For any regular polygon with N sides we loop N times and turn
by 360/N.  Let's make some code to draw any sort of polygon. We can change the value of N
to draw a different shape. Here it is for an octogon.

```filament
turtle_start(0,0,0)

ngon << (N,side) -> {
    range(N) >> map(with: () -> {
        turtle_forward(side)
        turtle_right(360/N)
    })
}
ngon(8,60)

turtle_done()
```

If we change N to 100 and size to 10 it looks like a circle.

```filament
turtle_start(0,0,0)

ngon << (N,side) -> {
    range(N) >> map(with: () -> {
        turtle_forward(side)
        turtle_right(360/N)
    })
}

ngon(100,10)
turtle_done()
```




## Colors

What's even cooler than drawing a shape from lines, is drawing a shape over and over. Let's
go back to drawing a square, but do it over and over with a slight rotation.

```filament
turtle_start(0,0,0)

ngon << (N,side) -> {
    range(N) >> map(with: () -> {
        turtle_forward(side)
        turtle_right(360/N)
    })
}

range(50) >> map(with:() -> {
    ngon(4,100)
    turtle_right(10)
})

turtle_done()
```

Woah!

Now let's switch colors each time with `turtle_pencolor()`

```filament
turtle_start(0,0,0)

ngon << (N,side) -> {
    range(N) >> map(with: () -> {
        turtle_forward(side)
        turtle_right(360/N)
    })
}

range(50) >> map(with:(i) -> {
    ngon(4,100)
    turtle_right(10)
    red << i/50
    turtle_pencolor([red,0,0])
})

turtle_done()
```

Turtle graphics is a really fun way to draw shapes incrementally. What
we've done is define a small thing, a side, then repeat it to make a shape,
then repeat *that* to make a more complex shape. 

For our final example let's draw a flower.  How could we do this? Why
dont' we start with a petal, figure that out, then draw it a bunch of times
to make the flower. But how do we draw a petal? By breaking it down
into even smaller pieces.

We learned to draw a curve by doing lots of short lines. Let's do just
a partial circle.

draw short line
rotate slightly

we have an arc


now flip around and do it again

we have a petal

now let's do that a bunch of times to get a flower

now we have a flower. Most programming is like this. We build big complex
things out of lots of smaller simpler pieces.









