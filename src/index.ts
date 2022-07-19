import {Parser} from './parser'
import {make_standard_scope} from './lang'
import filament_grammar from "./filament.ohm.js"
export {FilamentFunction,FilamentFunctionWithScope} from "./base";

let scope
let parser

export async function setup_parser() {
    scope = make_standard_scope()
    parser = new Parser(scope, filament_grammar)
}

export async function eval_code(code, custom_scope) {
    if (!custom_scope) custom_scope = scope
    let match = parser.parse(code + "\n")
    // console.log("parsed",match)
    if (match.failed()) throw new Error("match failed")
    let ast = parser.ast(match)
    // console.log('ast',ast)
    // console.log("evaluating with scope",custom_scope)
    return await ast.evalFilament(custom_scope)
}

export {
    is_scalar,
    is_boolean,
    is_canvas_result,
    is_error_result,
    is_list,
    is_string,
    scalar,
    string,
    list,
    Scope,
} from "./ast"
export {
    make_standard_scope,
} from "./lang"

