import {all, b, l, s, setup} from "./common.js"
import {boolean, list, scalar, Scope, string} from '../src/ast.js'
import {make_standard_scope} from '../src/lang.js'
import {FilamentFunction} from '../src/parser.js'
import {
    turtle_done,
    turtle_forward,
    turtle_left,
    turtle_pendown, turtle_penup,
    turtle_right,
    turtle_start
} from '../src/turtle.js'

await setup()


describe('image',() => {
    let std_scope = make_standard_scope()
    const scope = new Scope('image', std_scope)
    // scope.install(turtle_start, turtle_pendown, turtle_forward, turtle_right, turtle_left, turtle_penup, turtle_done)
    // scope.install(print)
    it('make 100px square image', async () => {
        await code_to_png(`{
        make_image(width:100,height:100)
        }`, "image_100px_square.png", scope)
    })

    it('fill with red', async () => {
        await code_to_png(`{
        make_image(width:100,height:100) >> map_image(with:(x,y) -> {
            [1,0,0]
        })
        }`, "image_red.png", scope)
    })

    it('fill with stripes', async () => {
        await code_to_png(`{
red << [1,0,0]
green << [0,1,0]
make_image(width:100,height:100) 
    >> map_image(with:(x,y) -> {
           if x mod 2 == 0 then red else green
        })
        }`, "image_red.png", scope)
    })

    it('fill with chekerboard', async () => {
        await code_to_png(`{
red << [1,0,0]
green << [0,1,0]
make_image(width:100,height:100) 
    >> map_image(with:(x,y) -> {
   if x mod 2 == 0 or y mod 2 == 0 
     then [1,1,1]
     else [0,0,0]
        })
        }`, "checkerboard.png", scope)
    })

    if('white noise', async () => {
        await code_to_png(`
            make_image(width:100, height: 100, generate:(x,y) -> {
                n << random(min:0,max:1)
                [n,n,n]
            })
        `,'whitenoise.png',scope)
    });

    if('load image noise', async () => {
        await code_to_png(`
            load_image(src:'url') >> map(with:(c,x,y) -> {
                [ c[0]*0.25, c[1]*0.25, c[2]*0.5 ]
            }) 
        `,'load_image.png',scope)
    });
    if('grayscale', async () => {
        await code_to_png(`
            load_image(src:'url') >> map(with:(c,x,y) -> {
                [ c[0]*0.25, c[1]*0.25, c[2]*0.5 ]
            }) 
        `,'load_image.png',scope)
    });
    if('crossfade', async () => {
        await code_to_png(`
map(img1,with(color,x,y) -> {
    color2 = get_pixel(img2,x,y)
    return color*0.5 + color2*0.5
}
        `,'crossfade.png',scope)
    });

    if('sepia', async () => {
        await code_to_png(`
            brightness << (c)     -> c[0]*0.24 + c[1]*0.24 + c[2]*0.5
            lerp       << (t,a,b) -> a * (1-t) + b * (t)
            
            white << [1,1,1]
            brown << [0.5,0.4,0.1]
            
            sepia << (c,x,y) -> {
              b << brightness(c)
              lerp(b,white,brown)
            }
            load_image(src:"url") >> map(with:sepia)  
        `,'sepia.png',scope)
    });
})


