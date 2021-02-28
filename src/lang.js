import {
    abs,
    add,
    and, ceiling,
    convertunit,
    cos, date_cons,
    divide,
    equal,
    factorial, floor,
    greaterthan,
    greaterthanorequal,
    is_prime,
    lessthan,
    lessthanorequal,
    mod,
    multiply,
    negate,
    not,
    notequal,
    or,
    power, random,
    sin, sqrt,
    subtract,
    tan, time_cons, today
} from './math.js'
import {drop, get_field, join, length, map, range, reverse, select, sort, sum, take} from './lists.js'
import {chart, histogram, timeline} from './chart.js'
import {dataset, stockhistory} from './dataset.js'

import {FilamentFunctionWithScope, Parser, REQUIRED} from './parser.js'
import {scalar, Scope} from './ast.js'
import {plot} from './plot.js'
import {load_image, make_image, map_image} from './image.js'
import {circle, draw, hsl_to_rgb, rect, row} from './shape.js'



export const print = new FilamentFunctionWithScope('print',
    {
        msg:REQUIRED
    },
    function (scope,msg) {
        this.log(msg.toString())
    }
)

export function make_standard_scope() {
    let scope = new Scope("lang")
    scope.install(print)
    scope.install(add, subtract, multiply, divide, power, sqrt, negate, mod, factorial, is_prime, random)
    scope.install(abs, sin, cos, tan)
    scope.install(lessthan, greaterthan, equal, notequal, lessthanorequal, greaterthanorequal, or, and, not)
    scope.install(range, length, take, drop, join, reverse, map, sort, sum, get_field, select)
    scope.install(convertunit)
    scope.install(floor, ceiling)
    scope.install(date_cons, time_cons, today)
    scope.install(dataset, chart, timeline, histogram, plot, stockhistory)
    scope.install(rect,draw, row, circle, hsl_to_rgb)
    scope.set_var('pi', scalar(Math.PI))

    scope.install(make_image, map_image, load_image)
    return scope
}

let scope = make_standard_scope()

export async function real_eval2(code, src) {
    let txt = await fetch(src).then(r => r.text())
    let parser = new Parser(scope, txt)
    let m = parser.parse('{' + code + '}')
    if (m.failed()) throw new Error("match failed on: " + code)
    let ast = parser.ast(m)
    return await ast.evalFilament(scope)
}