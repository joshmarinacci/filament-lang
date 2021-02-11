import {setup_parser } from "../src/index.js"
import {all, b, l, s} from "./common.js"
import {list, string} from '../src/ast.js'

describe('literals', function() {
    setup_parser()
    it("integers",async () => {
        await all([
            ['4', s(4)],
            ['42', s(42)],
            ['4_2', s(42)],
        ])
    })
    it('floating point', async () => {
        await all([
            ['4.2', s(4.2)],
            ['04.2', s(4.2)],
            ['4.20', s(4.2)],
            ['4_._2', s(4.2)],
        ])
    })
    it('hex', async () => {
        await all([
            ['0x42',s(0x42)],
            ['0xFF',s(0xFF)],
        ])
    })
    it('lists',async  () => {
        await all([
            ['[4,2,42]',l(4,2,42)],
            ['[4, 2, 42]',l(4,2,42)],
            ['[4_, _2, 4_2]',l(4,2,42)],
            ['[4.2, 02.4, 4_2]',l(4.2,2.4,42)],
        ])
    })
    it('strings',async  () => {
        await all([
        [`"fortytwo"`,string('fortytwo')],
        [`"forty two"`,string('forty two')],
        [`'forty two'`,string('forty two')],
        [`["forty two",42]`,list([string('forty two'),s(42)])],
        ])
    })
    it('booleans',async () => {
        await all([
        ["true",b(true)],
        // ["TRUE",b(true)],
        ["false",b(false)],
        // "FaLsE",b(false),
        ])
    })
});
