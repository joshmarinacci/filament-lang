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

let scope
let parser
export async function setup_parser(grammar_source) {
    scope = new Scope('main')
    scope.install(add,subtract,multiply,divide, power,mod, negate, factorial, is_prime)
    scope.install(abs,sin,cos,tan)
    scope.install(lessthan,lessthanorequal,equal,notequal,greaterthanorequal,greaterthan,and,or,not)
    scope.install(range,length,take,drop,join,reverse,map, get_field, select,sort,sum)
    scope.install(dataset)
    scope.install(convertunit)
    scope.install(chart, histogram, stockhistory, timeline, plot)
    scope.set_var('pi',scalar(Math.PI))
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

