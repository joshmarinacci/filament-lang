import {promises as fs} from 'fs'
import {Parser} from '../src/parser.ts'
import {make_standard_scope} from '../src/lang.ts'
import filament_grammar from '../src/filament.ohm.js'
import {strip_under} from '../src/util.ts'

export async function highlight_code() {

}

export async function eval_filament(doc) {

    // l("evaluating all filament objects in",doc)
    let codeblocks = doc.filter(block => block.type === 'CODE' && block.language === 'filament')
    // l("codeblocks",codeblocks)
    let parser = new Parser(null,filament_grammar)

    let level = 0
    const indent = () => {
        level++
        console.log("L "+level)
    }
    const outdent = () => {
        level--
        console.log("L "+level)
    }
    const tab = () => {
        let str = ""
        for(let i=0; i<level; i++) {
            str += "  "
        }
        return str
    }

    const num = v => `<span class="num">${v}</span>`
    const str = v => `<span class="str">"${v}"</span>`
    const id = v => `<span class="id">${v}</span>`
    const op = v => `<span class="op"> ${v} </span>`
    const s = (cls,v) => `<span class="${cls}">${v}</span>`
    const argname = v => `<span class="argname">${v}</span>`
    const p = v => `<span class="punc">${v}</span>`
    const key = v => `${v}`
    const pipe_left = () => ' &lt;&lt; '
    const pipe_right = () => '\n  &gt;&gt; '

    parser.semantics.addOperation('hi',{
        _terminal() { return this.sourceString },
        ident : (i, i2) => (i.hi() + i2.hi().join("")),
        unit: u => u.sourceString,
        unitnumber: (v, u) => num(v.hi() +  u.hi()),
        number_fract: (a, b, c) => num(parseFloat(strip_under(a.sourceString + b.sourceString + c.sourceString))),
        number_whole: a => num(parseInt(strip_under(a.sourceString))),
        number_hex: (_, a) => num(parseInt(strip_under(a.sourceString), 16)),
        string: (_1, txt, _2) => str(txt.sourceString),

        NonemptyListOf: (a, b, c) => [a.hi()].concat(c.hi()),
        EmptyListOf:() => [],
        List: (a, b, c) => p('[') + b.hi().join(",") + p(']'),

        PipeOp_left:(next,_,first) => next.hi() + pipe_left() + first.hi(),
        PipeOp_right:(first,_,next) => {
            let ret = ""
            ret += first.hi()
            indent()
            ret += pipe_right()
            ret += next.hi()
            outdent()
            return ret
        },



        Block: (_1, statements, _2) => {
            let ret = p("\n")
            let states = statements.hi()
            ret += states.map(s => tab()+s+"\n").join("")
            ret += tab()+p("")
            return ret
        },
        FuncallExp: (ident, _1, args, _2) => {
            let ret = ""
            ret += s("funname",ident.hi())
            ret += p('(')
            ret += args.hi().join(", ")
            ret += p(')')
            return ret
        },
        FundefExp: (def, ident,_1,args,_3,block ) => `${def.hi()} ${ident.hi()} ( ${args.hi()} ) { ${block.hi()} }`,
        LambdaExp_short: (ident,_,block) => `${ident.hi()}->${block.hi()}`,
        LambdaExp_full: (_1,ident,_2,_3,block) => {
            let ret = ""
            ret += p('(') + ident.hi() + p(")")
            ret += p("->") + p("{")
            indent()
            ret += block.hi()
            outdent()
            ret += p("}")
            return ret
        },
        DefArg_default: (name,_,a) => argname(name.hi()) + op(":") + a.hi(),
        DefArg_solo:(name) => argname(name.hi()),
        Arg_named: (name, _, a) => argname(name.hi()) + op(":") + a.hi(),


        AddExp_add: (a, o, b) => a.hi()+op(o.hi())+b.hi(),
        MulExp_mul: (a, o, b) => a.hi()+op(o.hi())+b.hi(),
        AsExp_convert: (a, o, unit) => a.hi()+op(o.hi())+unit.hi(),
        UnExp:(o,a) => o.hi() + a.hi(),
        BoolExp_bool:(a,o,b) => a.hi()+op(o.hi()+b.hi()),
        GroupExp: (_1, exps, _2) => p("(")+exps.hi()+p(")"),


        IfExp_full: (_if, test,_then,a,_else,b) => key("if") + test.hi() + key("then") + a.hi() + key("else") + b.hi(),
        IndexRef: (exp,a,b,c) => exp.hi() + p("[") + b.hi() + p("]"),
    })
    let scope = make_standard_scope()

    return Promise.all(codeblocks.map(async (code) => {
        let match = parser.parse('{'+code.content+'}')
        // console.log('match',match.failed())
        if(match.failed()) throw new Error("match failed on: " + code.content);
        let ast = parser.ast(match)
        // console.log("ast is",ast)
        let res = await ast.evalFilament(scope)
        // console.log("final result is",res,'for code',code)
        code.result = res
        code.highlight = parser.semantics(match).hi()
        return res
    })).then(()=>{
        // console.log("all done")
    })
}
