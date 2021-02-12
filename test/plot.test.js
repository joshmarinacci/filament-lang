import {promises as fs, createWriteStream, mkdir as real_mkdir} from 'fs'
import {setup} from './common.js'
import {eval_code} from '../src/index.js'
import {default as PImage} from 'pureimage'

await setup()

async function mkdir(dir) {
    return new Promise((res,rej)=>{
        real_mkdir(dir,(err)=>{
            console.log("done making")
            if(err) {
                // console.log(err)//return rej(err)
            }
            res()
        })
    })
}

async function code_to_png(code, fname) {
    console.log("parsing",code)
    await mkdir('output')
    console.log("rendering to ",fname)
    let ret = await eval_code(code)
    const img = PImage.make(500,500);
    await ret.cb(img)
    await PImage.encodePNGToStream(img,createWriteStream(fname))
    console.log("done rendering")

}

describe('plots',() => {
    it('y=x',async ()=> {
        await code_to_png(`{
        def fun(x:?) {
            x
        }
        plot(y:fun)
        }`,"output/yx.png")
    })
    it('x=y',async ()=> {
        await code_to_png(`{
        def fun(y:?) {
            y+5
        }
        plot(x:fun)
        }`,"output/xy.png")
    })
    it('y = |x|',async ()=> {
        await code_to_png(`{
        def fun(x:?) {
            abs(x)
        }
        plot(y:fun)
        }`,"output/abs.png")
    })

    it('sine wave',async ()=> {
        await code_to_png(`{
        def fun(theta:?) {
            sin(theta*2)
        }
        plot(y:fun)
        }`,"output/sinwav.png")
    })
    it('parametric circle',async ()=> {
        await code_to_png(`{
        def px(theta:?) {
            sin(theta)
        }
        def py(theta:?) {
            cos(theta)
        }
        plot(x:px,y:py)
        }`,"output/parametric_circle.png")
    })
    it('lissajou',async ()=> {
        await code_to_png(`{
        def px2(theta:?) {
            sin(2*theta)
        }
        def py2(theta:?) {
            sin(3*theta)
        }
        plot(x:px2,y:py2)
        }`,"output/lissajou.png")
    })

})
