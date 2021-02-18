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
})