import {promises as fs} from "fs"
import assert from "assert"
import {eval_code, setup_parser} from '../src/index.js'
import {boolean, list, scalar} from '../src/ast.js'


export async function setup() {
    await setup_parser()
}
export async function test_same(str, ans, scope) {
    let ret = await eval_code(str,scope)
    // console.log(str,'became',ret)
    // console.log('answer is',ans)
    assert.deepStrictEqual(ret,ans)
    // assert.equal(ret.value,ans.value)
}

export async function all(args,scope) {
    return Promise.all(args.map(tx => {
        return Promise.resolve(test_same(tx[0],tx[1],scope))
    }))
}

// export const all_close_scalar = async (tests) => await tests.map(tt => ta(tt[0],tt[1]))
export async function all_close_scalar(args) {
    return Promise.all(args.map(tx => {
        return Promise.resolve(test_approx(tx[0],tx[1]))
    }))
}

export const test_approx = async (s, a) => {
    return Promise.resolve(eval_code(s)).then(v=>{
        // console.log("testing",s ,'equals',a,'really is',v)
        assert(Math.abs(v.value - a.value) < 0.01);
        assert.equal(v.unit,a.unit)
        assert.equal(v.dim,a.dim)
    })
}


export const s = (v,u,d) => scalar(v,u,d)
export const b = (v) => boolean(v)
export const l = (...vals) => list(vals.map(v => scalar(v)))
