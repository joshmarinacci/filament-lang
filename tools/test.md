* __sin__, __cos__, __tan__: the usual trig functions, in radians or degrees.

* bullet1
  bullet2
  bullet3

and more

list item 1
and then some more

plain *italics* plain
plain **bold** plain
plain `code` plain

```langname
some code inside
and some more
```

```filament
range(10000)
```

# header 1

## header 2


* list item 2

* foo 3


```filament
5feet + 4inches as cm 
```


```filament
list << range ( 10 ) take ( list, -3 ) 
```


```filament
def div5(x:?) {
  x mod 5 = 0
}
select( range(100), where: div5 )
```

```filament
spiral << theta -> 0.25*theta
plot(polar:spiral, min:0, max:pi*32)
```


```tilament
planets << dataset('planets')
chart(planets, type: 'scatter', 
  x: 'orbital_radius', 
      y: 'mean_radius', 
        size:'mean_radius', 
        name:'name')
```



```filament
range(5) >>
    map(with: n -> rect(width:1cm, height:n*5cm)) >>
    row(valign:"bottom", halign:"center") >>
    draw()
```


```filament
turtle_start(0,0,0)
turtle_pendown()
arc << () -> {
    map(range(120), with:(n)->{
      turtle_forward(2)
      turtle_right(1)
    })       
}
leaf << () -> {
    arc()
    turtle_right(60)
    arc()
    turtle_right(60)
}

range(36) >> map(with: () -> {
    leaf()
    turtle_right(10)
})

turtle_penup()
turtle_done()
```
