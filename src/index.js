import fs from 'fs'
import {scalar, Scope} from './ast.js'
import {
    add, and, convertunit,
    divide, equal,
    factorial, greaterthan, greaterthanorequal,
    is_prime,
    lessthan,
    lessthanorequal,
    mod,
    multiply,
    negate, not, notequal, or,
    power,
    subtract
} from './math.js'
import {drop, get_field, join, length, map, range, reverse, select, sort, sum, take} from './lists.js'
import {dataset} from './dataset.js'
import {Parser} from './parser.js'

let scope
let parser
export function setup_parser() {
    let g2_source = fs.readFileSync("src/filament.ohm").toString()
    scope = new Scope('eval_ast')
    scope.install(add,subtract,multiply,divide, power,mod, negate, factorial, is_prime)
    scope.install(lessthan,lessthanorequal,equal,notequal,greaterthanorequal,greaterthan,and,or,not)
    scope.install(range,length,take,drop,join,reverse,map, get_field, select,sort,sum)
    scope.install(dataset)
    scope.install(convertunit)
    scope.set_var('pi',scalar(Math.PI))
    parser = new Parser(scope,g2_source)

}

export async function eval_code(code) {
    let match = parser.parse(code)
    // console.log("parsed",match)
    if(match.failed()) throw new Error("match failed")
    let ast = parser.ast(match)
    // console.log('ast',ast)
    return Promise.resolve(ast.evalFilament(scope)).catch(e => {
        console.error(e)
        return false
    })
}

export {is_scalar,
    is_boolean,
    is_canvas_result,
    is_error_result,
    is_list,
    is_string
} from "./ast.js"