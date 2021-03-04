import {l} from './util.js'
import ohm from 'ohm-js'

let parser = null
function setup_parser() {
    if(!parser) {
        parser = {}
        parser.grammar = ohm.grammar(`
JSDocOuter {
    Stuff = Block | any
    Block = "/**" (~"*/" EOL)* "*/"
    EOL = (~"\\n" any)* "\\n"
}
    `)
        parser.semantics = parser.grammar.createSemantics()
        parser.semantics.addOperation('blocks', {
            Block:(_start, body, _end) => {
                l("block is",body.blocks().join(""))
            },
            _terminal:function() {
                return this.sourceString
            }
        })
    }

    return parser
}

export async function parse_api_docs(text) {
    l("parsing",text)
    let parser = setup_parser()
    let match = parser.grammar.match(text)
    l('match is',match.succeeded())
    if(!match.succeeded()) {
        throw new Error("could not parse",match)
    }

    let blocks = parser.semantics(match).blocks()
    l("blocks",blocks)
    //read file to string
    //pull out the doc blocks
    //parse each doc block into a doc object
    //return list of docs
}
