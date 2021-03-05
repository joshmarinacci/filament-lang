import {l} from './util.js'
import ohm from 'ohm-js'

let parser = null
function setup_parser() {
    if(!parser) {
        parser = {}
        parser.grammar = ohm.grammar(`
JSDocOuter {
    blocks = block* junk_c
    block = junk_a bstart content bend
    bstart = "/**"
    junk_a = (~bstart any)*
    junk_c = any*
    content = (~bend any)+
    bend = "*/"    
    toEOL = (~"\\n" any)* "\\n"
}

    `)
        parser.semantics = parser.grammar.createSemantics()
        parser.semantics.addOperation('block', {
            blocks:(blk,junk_c) => {
                l("blocks",blk.block())
                return blk.block()
            },
            block:(junk_a, bstart, content, bend) => {
                l("block is",content.block().join(""))
                return content.block().join("")
            },
            _terminal:function() {
                return this.sourceString
            }
        })

        let inline_parser = {}
        inline_parser.grammar = ohm.grammar(`
JSDocInner {
    
}        
        `)
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

    let blocks = parser.semantics(match).block()
    l("blocks",blocks)
    //read file to string
    //pull out the doc blocks
    //parse each doc block into a doc object
    //return list of docs
}
