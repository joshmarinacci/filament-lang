import assert from "assert"

import {setup_parser,eval_code } from "../src/index.js"
import {b, l, s} from '../tests/util.js'
import {list, string} from '../src/ast.js'
async function t(str, ans) {
    let ret = await eval_code(str)
    assert.equal(ret.value,ans.value)
}

async function tt(args) {
    return Promise.all(args.map(tx => {
        return Promise.resolve(t(tx[0],tx[1]))
    }))
}

describe('literals', function() {
    setup_parser()
    // console.log(tt[['4',s(4)]])
    it("integers",async () => {
        tt([
            ['4',s(4)],
            ['42',s(42)],
            ['4_2',s(42)],
        ])
    })
    it('floating point', async () => {
        tt([
            ['4.2',s(4.2)],
            ['04.2',s(4.2)],
            ['4.20',s(4.2)],
            ['4_._2',s(4.2)],
        ])
    })

    it('hex', async () => {
        tt([
            ['0x42',s(0x42)],
            ['0xFF',s(0xFF)],
        ])
    })

    it('lists',async  () => {
        tt([
            ['[4,2,42]',l(4,2,42)],
            ['[4, 2, 42]',l(4,2,42)],
            ['[4_, _2, 4_2]',l(4,2,42)],
            ['[4.2, 02.4, 4_2]',l(4.2,2.4,42)],
        ])
    })

    it('strings',async  () => {
        tt([
        [`"fortytwo"`,string('fortytwo')],
        [`"forty two"`,string('forty two')],
        [`'forty two'`,string('forty two')],
        [`"forty two",42]`,list([string('forty two'),s(42)])],
        ])
    })

    it('booleans',async () => {
        tt([
        ["true",b(true)],
        // "TRUE",b(true),
        ["false",b(false)],
        // "FaLsE",b(false),
        ])
    })

});
