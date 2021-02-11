import {setup_parser} from "../src/index.js"
import {all, s, l, b, setup} from "./common.js"
import {list} from "../src/ast.js"

await setup()
console.log("done with setup")

describe('math',() => {
    it("binary math operators", async ()=>{
        await all([
            ['4+2',s(6)],
            ['4-2',s(2)],
            ['4*2',s(4*2)],
            ['4/2',s(4/2)],
            ['4**2',s(4*4)],
            ['4 mod 2',s(0)],
        ])
    })
    it('binary ops on arrays',async() =>{
        await all([
            ['[1,2]+[3,4]',l(4,6)],
            ['2*[1,2]',l(2,4)],
            ['[3,4]*2',l(6,8)],
            ['[4,5]<[8,9]',list([b(true),b(true)])],
        ])
    })
    it("boolean operators", async ()=>{
        await all([
            ['4 < 2',b(false)],
            ['4 > 2',b(true)],
            ['4 = 2',b(false)],
            ['4 <> 2',b(true)],
            ['4 <= 2',b(false)],
            ['4 >= 2',b(true)],
            // ['true and false',b(false)],
            // ['true or false',b(true)],
        ])
    })
    it("unary  operators", async ()=>{
        await all([
            ['-42',s(-42)],
            ['-4/2',s(-2)],
            ['!4',s(1*2*3*4)],
            ['not true',b(false)],
        ])
    })
    it('parens',async() => {
        await all([
            ['(4+2)',s(6)],
            ['((4*2)+42)',s((4*2)+42)],
            ['(4*(2+42))',s(4*(2+42))],
        ])
    })
    it('precedence',async() => {
        await all([
            ['4+2*4',s(4+2*4)],
            ['4*2+4',s(4*2+4)],
        ])
    })

    it('trig',async ()=>{
        await all([
        ])
    })
    it('constants', async ()=>{
        await all([
            ['pi',s(Math.PI)]
        ])
    })
})
