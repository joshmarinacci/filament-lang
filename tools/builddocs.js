/*
- parse markdown. two phase parser and grammar?
- generate HTML from AST
- parse embedded codeblocks marked as filament
- generate pretty code
- executed embedded codeblocks
- generate pretty output for common result types
- generate PNGs for canvas result type
- everything into in-memory datastructure
- flatten entire structure into final html file
- run as cli app. accepts input file and output file and output dir
 */


import path from 'path'
import {createWriteStream, promises as fs} from 'fs'
import {Parser, strip_under} from '../src/parser.js'
import {is_canvas_result, is_image_result} from "../src/ast.js"
import {make_standard_scope} from '../src/lang.js'
import {default as PImage} from "pureimage"
import {l, mkdir} from './util.js'
import {parse_markdown} from './markdown.js'


async function eval_filament(doc) {


    // l("evaluating all filament objects in",doc)
    let codeblocks = doc.filter(block => block.type === 'CODE' && block.language === 'filament')
    // l("codeblocks",codeblocks)
    let filament_grammer = (await fs.readFile('src/filament.ohm')).toString()
    let parser = new Parser(null,filament_grammer)

    const lit = v => `<span class="literal">${v}</span>`
    const strlit = v => `<span class="literal">"${v}"</span>`
    const id = v => `<span class="id">${v}</span>`
    const op = v => ` <span class='operator'>${v}</span> `
    const argname = v => `<span class='id'>${v}</span>`

    parser.semantics.addOperation('hi',{
        _terminal() { return this.sourceString },
        ident : (i, i2) => id(i.hi() + i2.hi().join("")),

        unit: u => u.sourceString,
        unitnumber: (v, u) => lit(v.hi() +  lit(u.hi())),
        number_fract: (a, b, c) => lit(parseFloat(strip_under(a.sourceString + b.sourceString + c.sourceString))),
        number_whole: a => lit(parseInt(strip_under(a.sourceString))),
        number_hex: (_, a) => lit(parseInt(strip_under(a.sourceString), 16)),
        // number: (v) => l,
        string: (_1, txt, _2) => strlit(txt.sourceString),

        Block: (_1, statements, _2) => ""+statements.hi().join("\n")+"\n\n",
        PipeOp_left:(next,_,first) => next.hi() + op('&lt;&lt;') + first.hi(),
        PipeOp_right:(first,_,next) => first.hi() + op("&gt;&gt;") + next.hi(),
        NonemptyListOf: (a, b, c) => [a.hi()].concat(c.hi()),
        EmptyListOf:() => [],
        List: (a, b, c) => `[${b.hi().join(", ")}]`,
        FuncallExp: (ident, _1, args, _2) => `${ident.hi()} ( ${args.hi().join(", ")} )`,
        FundefExp: (def, ident,_1,args,_3,block ) => `${def.hi()} ${ident.hi()} ( ${args.hi()} ) { ${block.hi()} }`,
        LambdaExp_short: (ident,_,block) => `${ident.hi()} ->${block.hi()}`,
        LambdaExp_full: (_1,ident,_2,_3,block) => `(${ident.hi()}) -> { ${block.hi()} }`,
        DefArg_default: (name,_,a) => argname(name.hi()) + op(":") + a.hi(),
        DefArg_solo:(name) => argname(name.hi()),
        Arg_named: (name, _, a) => argname(name.hi()) + op(":") + a.hi(),
        AddExp_add: (a, o, b) => a.hi()+op(o.hi())+b.hi(),
        MulExp_mul: (a, o, b) => a.hi()+op(o.hi())+b.hi(),
        AsExp_convert: (a, o, unit) => a.hi()+op(o.hi())+unit.hi(),
        UnExp:(o,a) => o.hi() + a.hi(),
        BoolExp_bool:(a,o,b) => a.hi()+op(o.hi()+b.hi()),
        GroupExp: (_1, exps, _2) => "("+exps.hi()+")",
        IfExp_full: (_if, test,_then,a,_else,b) => "if " + test.hi() + " then " + a.hi() + " else " + b.hi(),
        IndexRef: (exp,a,b,c) => exp.hi() + "[" + b.hi() + "]",
    })
    let scope = make_standard_scope()

    return Promise.all(codeblocks.map(async (code) => {
        // console.log('processing',code)
        let match = parser.parse('{'+code.content+'}')
        // console.log('match',match.failed())
        if(match.failed()) throw new Error("match failed on: " + code.content);
        let ast = parser.ast(match)
        // console.log("ast is",ast)
        let res = await ast.evalFilament(scope)
        // console.log("final result is",res,'for code',code)
        code.result = res
        code.highlight = parser.semantics(match).hi()
        // console.log("highlighted:",code.highlight)
        return res
    })).then(()=>{
        // console.log("all done")
    })
}

async function generate_canvas_images(doc, basedir, subdir) {
    await mkdir(path.join(basedir,subdir))
    // l("rendering all canvas images in doc",doc)
    return Promise.all(doc
        .filter(block => block.type === 'CODE')
        .map(async(block,i) => {
            if(is_canvas_result(block.result)) {
                // console.log("is canvas",block.result)
                const img = PImage.make(1000,500);
                await block.result.cb(img)
                let fname = `output.${i}.png`
                block.src = path.join(subdir,fname)
                let imgpath = path.join(basedir,subdir,fname)
                await PImage.encodePNGToStream(img,createWriteStream(imgpath))
                l('rendered image',imgpath)
            }
            // console.log("doing block",block)
            if(is_image_result(block.result)) {
                // console.log("is image", block.result)
                let fname = `output.${i}.png`
                block.src = path.join(subdir,fname)
                let imgpath = path.join(basedir,subdir,fname)
                let img = block.result
                await PImage.encodePNGToStream(img,createWriteStream(imgpath))
            }
        })).then(done => {
            console.log("fully done writing images")
        })
}

function BQ(code) {
    return `<blockquote class="input">${code}</blockquote>`
}

function RESULT(code) {
    return `<blockquote class="output">${code}</blockquote>`
}

const render_array = (ar) => ar.map(v => v.toString()).join(", ")
function render_list(result) {
    if(result.value.length > 50) {
        let l1 = result.value.slice(0,25)
        let l2 = result.value.slice(-25)
        return RESULT("[" + render_array(l1) + " ... " + render_array(l2) +"]")
    } else {
        return RESULT(result.value.map(v => v.toString()).join(", "))
    }
}

function render_result(result) {
    if(result.type === 'table') {
        let header = Object.entries(result.schema.properties).map(prop => {
            return `<th>${prop[0]}</th>`
        }).join("")
        let rows = result.value.map(record => {
            let cols = Object.values(record).map(value => {
                return `<td>${value}</td>`
            })
            return `<tr>${cols.join("")}</tr>`
        }).join("\n")
        return `<div class="wrapper"><table class="output">
                    <thead><tr>${header}</tr></thead>
                    <tbody>${rows}</tbody>
                    </table></div>`
    }
    if(result.type === 'list') return render_list(result)
    if(result.type === 'scalar') return RESULT(result.toString())
    if(result.type === 'canvas-result') return ""
    if(is_image_result(result)) return ""
    console.log("type is",result.type)
    return RESULT('UNKNOWN')
}

function render_code_output(block) {
    let code = ""
    if(block.language === 'filament') {
        code = BQ(block.highlight)
    } else {
        code = BQ(block.content)
    }
    if(block.src) {
        code += `<img src="${block.src}" width="500" height="250">`
    }
    if(block.result) {
        code += render_result(block.result)
    }
    return code
}

function render_block_content(block) {
    return block.content.map(run => {
        if(run[0] === 'plain') return run[1]
        if(run[0] === 'bold') return '<b>'+run[1]+'</b> '
        if(run[0] === 'italic') return '<i>'+run[1]+'</i> '
        if(run[0] === 'code') return '<code>'+run[1]+'</code> '
        if(run[0] === 'link') {
            if(run[3] === '!') {
                return `<img src="${run[2]}" alt="${run[1]}"/> `
            } else {
                return `<a href="${run[2]}">${run[1]}</a> `
            }
        }
        return run[1]
    }).join("")
}

function render_paragraph_output(block) {
    return '<p>' + render_block_content(block) +"</p>"
}

function render_list_item(block) {
    return '<li>' +render_block_content(block)+ "</li>"
}

function generate_toc(doc) {
    let toc = {
        type:'toc',
        content:[]
    }
    doc.map(block => {
        if(block.type === 'H1') toc.content.push(block)
        if(block.type === 'H2') toc.content.push(block)
        if(block.type === 'H3') toc.content.push(block)
    })
    return toc
}

function gen_slug(str) {
    return str.replaceAll(" ","_")
}

function render_toc_tree(root) {
    let childs = ""
    if(root.content.length > 0) {
        childs = "<ul>"+root.content.map(child => {
            return `<li>${render_toc_tree(child)}</li>`
        }).join("\n") + "</ul>"
    }
    return `<a href="#${gen_slug(root.title)}">${root.title}</a>${childs}`
}

function render_toc(toc) {
    // console.log("toc",toc)
    let stack = []
    toc.content.map(v => {
        if(v.type === 'H1') {
            stack.push({title:v.content,content:[]})
        }
        if(v.type === 'H2') {
            let top = stack[stack.length-1]
            top.content.push({title:v.content,content:[]})
        }
        if(v.type === 'H3') {
            let top = stack[stack.length-1]
            top = top.content[top.content.length-1]
            top.content.push({title:v.content,content:[]})
        }
    })
    return render_toc_tree({title:"Tutorial",content:stack})

    // let toc_html = `<ul>${toc.content.map(v => {
    //     return `<li><a href='#${gen_slug(v.content)}'>${v.content}</a></li>`
    // }).join("")}</ul>`
}

function render_html(toc, doc) {
    // l('rendering html from doc',doc)
    let toc_html = render_toc(toc)
    const title = 'tutorial'
    const content = doc.map(block => {
        // l("block is",block)
        if(block.type === 'H1') return `<h1><a name="${gen_slug(block.content)}">${block.content}</a></h1>`
        if(block.type === 'H2') return `<h2><a name="${gen_slug(block.content)}">${block.content}</a></h2>`
        if(block.type === 'H3') return `<h3><a name="${gen_slug(block.content)}">${block.content}</a></h3>`
        if(block.type === 'LI') return render_list_item(block)
        if(block.type === 'P') return render_paragraph_output(block)
        if(block.type === 'CODE') return render_code_output(block)
        if(block.type === 'BLANK') return ""
        l("block is",block)
        return "ERROR"
    }).join("\n")
    let template = `
     <html>
     <head><title>${title}</title>
     <link rel="stylesheet" href="style.css">
     </head>
        <body>
        <nav>
            <div class="nav-contents">
            <h3>Filament</h3>
            <p>
            <a href="tutorial.html">tutorial</a>
            <a href="intro.html">intro</a>
            <a href="spec.html">spec</a>
            <a href="api.html">api</a>
            </p>
            ${toc_html}
        </div>
        </nav>
        <main>
        ${content}
        </main>
        </body>
        </html>`
    return template
}

export async function convert_file(infile_path, outdir_path, outfile_name) {
    let raw_markdown = (await fs.readFile(infile_path)).toString()
    let doc = await parse_markdown(raw_markdown+"\n")
    let toc = generate_toc(doc)
    await eval_filament(doc)
    await generate_canvas_images(doc,outdir_path,'images')
    let html = render_html(toc,doc)
    //console.log("final html is",html)
    let outpath = path.join(outdir_path,outfile_name)
    await fs.writeFile(outpath,html)
    console.log("finished writing", outpath)
}

function processArgs(args) {
    let res = {
        missing:false
    }
    args.slice(2).forEach(arg => {
        let [key,value] = arg.split("=")
        res[key.slice(2)] = value
    })
    if(!res.infile) {
        res.missing = true
        return res
    }

    if(!res.outdir) {
        res.outdir = 'output'
    }
    if(!res.outfile) {
        res.outfile = path.join(path.basename(res.infile,'.md')) + '.html'
    }
    return res
}

function run () {
    let args = processArgs(process.argv)
    if (args.missing) return console.log("files missing\nnode tools/builddoc --infile=in_markdown_file.md --outdir=out_dir")
    console.log("using config",args)
    const fnt = PImage.registerFont('node_modules/pureimage/tests/unit/fixtures/fonts/SourceSansPro-Regular.ttf','Source Sans Pro');
    fnt.load(()=>{
        return convert_file(args.infile, args.outdir, args.outfile)
            .then(()=>console.log("done"))
            .catch(e => console.error(e))
    })
}
// run()

