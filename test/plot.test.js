import {promises as fs, createWriteStream, mkdir as real_mkdir} from 'fs'
import {setup} from './common.js'
import {eval_code} from '../build/index.js'
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
    await mkdir('output')
    // console.log("rendering to ",fname)
    let ret = await eval_code(code)
    const img = PImage.make(500,500);
    await ret.cb(img)
    await PImage.encodePNGToStream(img,createWriteStream(fname))
    // console.log("done rendering")

}

describe('min max ranges',() => {
    it('y=x',async ()=> {
        await code_to_png(`{
        def fun(x:?) {
            x
        }
        plot(y:fun, max:10)
        }`,"output/yx_max.png")
    })
    it('y=x',async ()=> {
        await code_to_png(`{
        def fun(y:?) {
            y+5
        }
        plot(x:fun, min:-50)
        }`,"output/xy_min.png")
    })
    it('polar spiral', async () => {
        await code_to_png(`{
        def fun(theta:?) {
            0.25*theta
        }
        plot(polar:fun, min:0, max:pi*32)
        }`,"output/polarspiral_minmax.png")
    })
})

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
    it('quadratic', async() => {
        await code_to_png(`{
        def fun(x:?) {
            x**2 - 3*x - 4
        }
        plot(y:fun, zoom:5)
        }`,"output/quadratic.png")
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

    it('polar circle', async () => {
        await code_to_png(`{
        def fun(theta:?) {
            2
        }
        plot(polar:fun)
        }`,"output/polarcirle.png")
    })

    it('polar spiral', async () => {
        await code_to_png(`{
        def fun(theta:?) {
            0.25*theta
        }
        plot(polar:fun)
        }`,"output/polarspiral.png")
    })

    it('heart', async() => {
        await code_to_png(`{
        def px3(t:?) { (16 * (sin(t)**3))/10 }
        def py3(t:?) { (13 * cos(t) - 5 * cos (2*t) - 2 * cos(3*t) - cos(4*t))/10 }
        plot(x:px3,y:py3, zoom:80)
        }`,"output/heart.png")
    })

})
