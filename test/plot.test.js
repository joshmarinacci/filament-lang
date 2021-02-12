import {promises as fs, createWriteStream, mkdir as real_mkdir} from 'fs'
import {setup} from './common.js'
import {eval_code} from '../src/index.js'
import {default as PImage} from 'pureimage'

await setup()
console.log("done with setup")

async function code_to_png(code, fname) {
    console.log("parsing",code)

    console.log("rendering to ",fname)
    let ret = await eval_code(code)
    console.log("return is",ret)

    const img = PImage.make(500,500);
    let res = await ret.cb(img)
    console.log("res is",res)
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
})
