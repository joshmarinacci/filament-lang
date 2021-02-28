import {mkdir} from '../tools/util.js'
import {eval_code} from '../src/index.js'
import {default as PImage} from 'pureimage'
import {createWriteStream} from 'fs'
import {default as path} from 'path'
import {make_standard_scope} from '../src/lang.js'
import {setup} from './common.js'
import {circle, draw, rect, row} from '../src/shape.js'

await setup()

function setup_pureimage() {
    let fnt = PImage.registerFont('node_modules/pureimage/tests/unit/fixtures/fonts/SourceSansPro-Regular.ttf','Source Sans Pro')
    return fnt.load(()=>{
        console.log("done loading font")
    })
}

await setup_pureimage()


async function code_to_png(code, fname, scope) {
    try {
        // console.log("parsing",code)
        await mkdir('output')
        await mkdir('output/shape')
        // console.log("rendering to ",fname)
        let ret = await eval_code(code, scope)
        const img = PImage.make(1000, 1000);
        await ret.cb(img)
        let pth = path.join('output', 'shape', fname)
        await PImage.encodePNGToStream(img, createWriteStream(pth))
        console.log("wrote", pth)
    } catch (e) {
        console.error(e)
    }
}


describe("shapes", ()=> {
    let std_scope = make_standard_scope()
    std_scope.install(rect,draw, row, circle)
    it("one rect", async () => {
        await code_to_png(
            `
        rect(width:10, height:10) >> draw()
            `
            , "one_rect.png", std_scope)
    })
    it("positioned rect", async () => {
        await code_to_png(
            `
    rect(x:50,y:50,width:10,height:10) >> draw()
            `
            , "middle_rect.png", std_scope)
    })
    it("rects with units", async () => {
        await code_to_png(
            `
[
 rect(x:0, width:1cm, height: 5cm),
 rect(x:2cm, width:1in, height: 1in)
] >> draw()
            `
            , "unit_rects.png", std_scope)
    })


    it("named color", async () => {
        await code_to_png(
            `rect(width:10cm, height:10cm, fill:'green') >> draw()`,
            "named_green.png", std_scope)
    })

    it("RGB float color", async () => {
        await code_to_png(
            `
    rect(width:100,height:100,fill:[0,1,0]) >> draw()
            `
            , "RGB_green.png", std_scope)
    })


    it("row packing", async () => {
        await code_to_png(
            `
[
    rect(width:10cm, height:20cm, fill:'red'),
    rect(width:10cm, height:20cm, fill:'green'),
    rect(width:10cm, height:20cm, fill:'blue')
] >> row(gap:1cm) >> draw()
`
            , "rects_row.png", std_scope)
    })



    it("simple barchart",async () => {
        await code_to_png(`
range(min:2,max:10) >>
   map(with: n -> rect(width:1cm, height:n*2cm)) >>
   row(valign:"bottom", halign:"center") >>
    draw() 
        `,"barchart.png",std_scope)
    })

    it("aqua circle",async () => {
        await code_to_png(`
            circle(x:50,y:50, fill:'aqua') >> draw() 
        `,'aqua_circle.png',std_scope)
    })

    it('lots of shapes',async() => {
        await code_to_png(`{
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
}
        `,'lots_of_rects.png',std_scope)
    })
})

