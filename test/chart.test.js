import {mkdir} from '../tools/util.js'
import {eval_code} from '../src/index.js'
import {default as PImage} from 'pureimage'
import {createWriteStream} from 'fs'
import {default as path} from 'path'
import {make_standard_scope} from '../src/lang.js'
import {setup} from './common.js'

await setup()

function setup_pureimage() {
    let fnt = PImage.registerFont('node_modules/pureimage/tests/unit/fixtures/fonts/SourceSansPro-Regular.ttf','Source Sans Pro')
    return fnt.load(()=>{
        console.log("done loading font")
    })
}

await setup_pureimage()

async function code_to_png(code, fname, scope) {
    // console.log("parsing",code)
    await mkdir('output')
    await mkdir('output/chart')
    // console.log("rendering to ",fname)
    let ret = await eval_code(code, scope)
    const img = PImage.make(1000,1000);
    await ret.cb(img)
    let pth = path.join('output','chart',fname)
    await PImage.encodePNGToStream(img,createWriteStream(pth))
    console.log("wrote",pth)
}

describe("charts", ()=>{
    let std_scope = make_standard_scope()
    it("simple_chart", async() => {
        await code_to_png(`chart([1,2,3,1])`,"simple.png", std_scope)
    })
    it("alphabet", async() => {
        await code_to_png(`chart(dataset('alphabet'), name:'letter', y:'syllables')`,"alphabet.png", std_scope)
    })
    it("scatter", async() => {
        await code_to_png(`{
        planets << dataset('planets')
        chart(planets, type:'scatter', 
                          x:'orbital_radius',
                          y:'mean_radius',
                       size:'mean_radius',
                       name:'name'
                  )
                  }`,"planets.png", std_scope)
    })
    it('states names',async() => {
        await code_to_png(`{
        states << dataset('states')
        first_letter << (state:?) -> take(get_field(state,'name'), 1)
        states << map(states, first_letter)
        histogram(states)
    }
        `,'statenames.png',std_scope)
    })

    it('states years',async ()=>{
        await code_to_png([
            `{
            states << dataset('states')
years << map(states, state ->  get_field(date(get_field(state,'statehood_date'),format:"MMMM dd, yyyy"),'year'))
histogram(years, bucket:10)            
            }`
        ],'statedates_decade.png',std_scope)
    })
        it("tallest buildings",async () => {
            await code_to_png(`{
buildings << dataset('tallest_buildings')
b2 << take(buildings,5) 
chart(b2, y:'height', x:'name')
            }`,'buildings.png',std_scope)
        })
})
