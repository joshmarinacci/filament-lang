import {setup} from "./common.js"
import {Scope} from '../src/ast.js'
import {make_standard_scope} from '../src/lang.js'
import {load_image, make_image, map_image} from '../src/image.js'
import {mkdir} from '../tools/util.js'
import {eval_code} from '../src/index.js'
import {default as PImage} from 'pureimage'
import {createWriteStream} from 'fs'
import {default as path} from 'path'

await setup()

async function code_to_png(code, fname, scope) {
    // console.log("parsing",code)
    await mkdir('output')
    await mkdir('output/image')
    // console.log("rendering to ",fname)
    let ret = await eval_code(code, scope)
    // console.log("ret is",ret)
    await PImage.encodePNGToStream(ret,createWriteStream(path.join('output','image',fname)))
}

describe('image',() => {
    let std_scope = make_standard_scope()
    const scope = new Scope('image', std_scope)
    scope.install(make_image, map_image,load_image)
    it('make 100px square image', async () => {
        await code_to_png(`{
        make_image(width:10,height:10)
        }`, "100.png", scope)
    })

    it('fill with red', async () => {
        await code_to_png(`{
        make_image(width:100,height:100) >> map_image(with:(x,y) -> {
            [1,0,0]
        })
        }`, "red.png", scope)
    })

    it('fill with stripes', async () => {
        await code_to_png(`{
        red << [1,0,0]
        green << [0,1,0]
        make_image(width:100,height:100) >> map_image(with:(x,y,color) -> {
           if x mod 2 = 0 then {red} else {green}
        })
        }`, "stripes.png", scope)
    })

    it('fill with checkerboard', async () => {
        await code_to_png(`{
        //this would be shorter if we had xor
    make_image(width:100,height:100) 
        >> map_image(with:(x,y,color) -> {
       if ((x mod 10 < 5) and not(y mod 10 < 5)) or
          (not(x mod 10<5) and (y mod 10 < 5))  
         then {[1,1,1]}
         else {[0,0,0]}
        })
        }`, "checkerboard.png", scope)
    })


    it('load image', async () => {
        await code_to_png(`load_image(
        src:'https://vr.josh.earth/webxr-experiments/nonogram/thumb.png')`,
            'load_image.png',scope)
    });

    it('white noise', async () => {
        await code_to_png(`{
            rando << () -> { 5 }
            make_image(width:100, height: 100)
            >> mapimage(with:(x,y,color) -> {
                n << random(min:0,max:1)
                [n,n,n]
            })
        }`,'whitenoise.png',scope)
    });

})


/*
describe('array indexing',() => {
    let std_scope = make_standard_scope()
    const scope = new Scope('image', std_scope)
    scope.install(make_image, map_image, load_image)


    it('load image to grayscale', async () => {
        await code_to_png(`
            load_image(src:'url') >> mapimage(with:(x,y,color) -> {
                [ c[0]*0.25, c[1]*0.25, c[2]*0.5 ]
            })
        `,'load_image.png',scope)
    });

    it('crossfade', async () => {
        await code_to_png(`
mapimage(img1,with(color,x,y) -> {
    color2 = get_pixel(img2,x,y)
    return color*0.5 + color2*0.5
}
        `,'crossfade.png',scope)
    });

    it('grayscale', async () => {
        await code_to_png(`
            load_image(src:'url') >> mapimage(with:(color,x,y) -> {
                [ c[0]*0.25, c[1]*0.25, c[2]*0.5 ]
            })
        `,'load_image.png',scope)
    });
    it('sepia', async () => {
        await code_to_png(`
            brightness << (c) -> c[0]*0.24 + c[1]*0.24 + c[2]*0.5
            lerp  << (t,a,b) -> a * (1-t) + b * (t)
            white << [1,1,1]
            brown << [0.5,0.4,0.1]
            sepia << (x,y,color) -> {
              b << brightness(c)
              lerp(b,white,brown)
            }
            load_image(src:"url") >> mapimage(with:sepia)
        `,'sepia.png',scope)
    });
})

 */