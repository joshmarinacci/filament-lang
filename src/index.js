import fetch from 'node-fetch'
import {scalar, Scope} from './ast.js'
import {
    abs,
    add, and, convertunit, cos,
    divide, equal,
    factorial, greaterthan, greaterthanorequal,
    is_prime,
    lessthan,
    lessthanorequal,
    mod,
    multiply,
    negate, not, notequal, or,
    power, sin,
    subtract, tan
} from './math.js'
import {drop, get_field, join, length, map, range, reverse, select, sort, sum, take} from './lists.js'
import {dataset, stockhistory} from './dataset.js'
import {Parser} from './parser.js'
import {chart, histogram, timeline} from './chart.js'
import {plot} from './plot.js'
import {make_standard_scope} from './lang.js'

let scope
let parser
export async function setup_parser(grammar_source) {
    scope = make_standard_scope()
    parser = new Parser(scope,grammar_source)
}

export async function eval_code(code, custom_scope) {
    if(!custom_scope) custom_scope = scope
    let match = parser.parse(code+"\n")
    // console.log("parsed",match)
    if(match.failed()) throw new Error("match failed")
    let ast = parser.ast(match)
    // console.log('ast',ast)
    return Promise.resolve(ast.evalFilament(custom_scope)).catch(e => {
        console.error(e)
        return false
    })
}

export {is_scalar,
    is_boolean,
    is_canvas_result,
    is_error_result,
    is_list,
    is_string,
} from "./ast.js"

