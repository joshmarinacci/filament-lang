import {l} from './util.js'
import ohm from 'ohm-js'

let parser = null

function zip_up(tags) {
    let obj = {}
    // console.log("zipping",tags)
    tags.forEach(pair => {
        // console.log("pair",pair)
        obj[pair[1]] = pair[2]
    })
    return obj
}


function setup_parser() {
    if(!parser) {
        parser = {}
        parser.grammar = ohm.grammar(`
JSDocOuter {
    blocks = block*
    block = junk bstart line* bend junk
    bstart = "/**"
    bend = space* "*/"        
    junk = (~bstart any)*
    line = spaces (~bend "*")?  (~("\\n" | "*/") any)* "\\n"
}    `)
        parser.semantics = parser.grammar.createSemantics()
        parser.semantics.addOperation('block', {
            blocks:(blk) => {
                // l("blocks",blk.block())
                return blk.block()
            },
            block:(junk_a, bstart, content, bend, junk_b) => {
                // l("block is",content.block().join(""))
                return content.block().join("")
            },
            line:(spaces, star, content, nl) => {
                return content.block().join("")
            },
            _terminal:function() { return this.sourceString }
        })
        parser.semantics.addOperation('raw',{
            blocks:(blk) => blk.raw(),
            block:(junk_a, bstart, content, bend, junk_b) => content.raw().join("\n"),
            line:(spaces, star, content, nl) => content.raw().join(""),
            _terminal:function() { return this.sourceString },
        })

        let inline_parser = {}
        inline_parser.grammar = ohm.grammar(`
JSDocInner {
    Tags = (Tag | StructTag | blocktag)*
    blocktag = "@"ident (~"@end" any)* "@end"
    Tag = TagName "(" content ")"
    TagName = "@"ident
    
    ident = letter+
    content = (~")" any)+
    
    StructTag = TagName "{" Struct "}"
    Struct = ListOf<KV,","> ","?
    KV = ident ":" (letter|digit)+
}
        `)
        inline_parser.semantics = inline_parser.grammar.createSemantics()
        inline_parser.semantics.addOperation('tags',{
            _terminal:function() { return this.sourceString },
            ident:(d) => d.tags().join("").trim(),
            content:(d) => d.tags().join("").trim(),
            blocktag:(_1, name, content, end) => [name.tags(), content.tags().join("")],
            Tag:(name,_1,content,_2) => [name.tags(),content.tags()],
            TagName:(_,ident) => ident.tags(),
            NonemptyListOf:(v,_1,_2) => [v.tags()].concat(_2.tags()),
            KV: (key, _, value) => ["keyvalue",key.tags(), value.tags().join("")],
            StructTag:(name, _1, content, _2) => [name.tags(),zip_up(content.tags())],
            Struct:(d,_) => d.tags(),
        })
        parser.inline_parser = inline_parser
    }

    return parser
}

export async function parse_api_docs(text) {
    // l("parsing",text)
    let parser = setup_parser()
    let match = parser.grammar.match(text)
    // l('match is',match.succeeded())
    if(!match.succeeded()) {
        throw new Error(`could not parse outer ${text.substring(0,1000)}`)
    }

    let blocks = parser.semantics(match).block()
    // l("blocks",blocks)
    let res = blocks.map(blk => {
        // l("========")
        // l(blk)
        let mtch = parser.inline_parser.grammar.match(blk)
        // l('internal matched = ', mtch)
        if(!mtch.succeeded()) {
            throw new Error("could not parse inner",mtch)
        }
        let tags = parser.inline_parser.semantics(mtch).tags()
        // console.log("tags",tags)
        return {
            type: 'block',
            tags: tags,
            raw:parser.semantics(match).raw(),
        }
    })
    return res
}
