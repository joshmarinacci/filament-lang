import assert from "assert"
import {eval_code} from '../src/index.js'
import {boolean, list, scalar} from '../src/ast.js'

export async function t(str, ans) {
    let ret = await eval_code(str)
    // console.log(str,'became',ret)
    // console.log('answer is',ans)
    assert.deepStrictEqual(ret,ans)
    // assert.equal(ret.value,ans.value)
}

export async function all(args) {
    return Promise.all(args.map(tx => {
        return Promise.resolve(t(tx[0],tx[1]))
    }))
}

export const s = (v,u,d) => scalar(v,u,d)
export const b = (v) => boolean(v)
export const l = (...vals) => list(vals.map(v => scalar(v)))
