import {promises as fs, createWriteStream, mkdir as real_mkdir} from 'fs'
import {default as path} from 'path'
import {setup} from './common.js'
import {eval_code} from '../src/index.js'
import {default as PImage} from 'pureimage'

await setup()

async function mkdir(dir) {
    return new Promise((res,rej)=>{
        real_mkdir(dir,(err)=>{
            if(err) {
                // console.log(err)//return rej(err)
            }
            res()
        })
    })
}

async function code_to_png(code, fname) {
    // console.log("parsing",code)
    await mkdir('output_turtle')
    // console.log("rendering to ",fname)
    let ret = await eval_code(code)
    const img = PImage.make(500,500);
    await ret.cb(img)
    await PImage.encodePNGToStream(img,createWriteStream(path.join('output_turtle',fname)))
    // console.log("done rendering")

}

describe('turtle basics',() => {
    it('make square',async ()=> {
        await code_to_png(`{
        turtle_start(0,0,0)
        turtle_pendown()
        turtle_forward(10)
        turtle_right(90)
        turtle_forward(10)
        turtle_right(90)
        turtle_forward(10)
        turtle_right(90)
        turtle_forward(10)
        turtle_right(90)
        turtle_penup()
        turtle_done()
        }`,"turtle_square.png")
    })

    it('makes spiral', async() => {
        await code_to_png(`{
        turtle_start(0,0,0)
        turtle_pendown()
        def part(i:?) {
            turtle_forward(i * 10)
            turtle_right(144)
        }
        map(range(20),with:part)
        // for(i in range(20)) {
        // do stuff here
        // })
        turtle_penup()
        turtle_done()
        }`,'turtle_spiral_star.png')
    })

    it('makes spiral', async() => {
        await code_to_png(`{
        turtle_start(0,0,0)
        turtle_pendown()
        def polygon(n:?) {
            angle = 360/n
            def side() {
                turtle_forward(20)
                turtle_left(angle)
            }
            map(range(n) with:side)        
        }
        turtle_penup()
        turtle_done()
        }`,'turtle_polygon.png')
    })

    /*

    https://www.calormen.com/jslogo/#

https://personal.utdallas.edu/~veerasam/logo/

http://logo.twentygototen.org/dZ1f62XY


    tree
    to tree :size
   if :size < 5 [forward :size back :size stop]
   forward :size/3
   left 30 tree :size*2/3 right 30
   forward :size/6
   right 25 tree :size/2 left 25
   forward :size/3
   right 25 tree :size/2 left 25
   forward :size/6
   back :size
end
clearscreen
tree 150




to fern :size :sign
  if :size < 1 [ stop ]
  fd :size
  rt 70 * :sign fern :size * 0.5 :sign * -1 lt 70 * :sign
  fd :size
  lt 70 * :sign fern :size * 0.5 :sign rt 70 * :sign
  rt 7 * :sign fern :size - 1 :sign lt 7 * :sign
  bk :size * 2
end
window clearscreen pu bk 150 pd
fern 25 1


random rects
to square :length
  repeat 4 [ fd :length rt 90 ]
end
to randomcolor
  setcolor pick [ red orange yellow green blue violet ]
end
clearscreen
repeat 36 [ randomcolor square random 200 rt 10 ]
     */
})