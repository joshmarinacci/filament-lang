import {convert_file} from './builddocs.js'
import {createWriteStream, promises as fs} from 'fs'

import path from 'path'
import {copy, for_each, init_pureimage, l, mkdir} from './util.js'
import {parse_api_docs} from './api_parser.js'


const OUTDIR = 'output'
const FILES = [
    'docs/api.md',
    'docs/intro.md',
    'docs/spec.md',
    'docs/tutorial.md',
    'tools/test.md',
]

await init_pureimage()
await mkdir(OUTDIR)
await mkdir(path.join(OUTDIR,'images'))
await copy("tools/style.css",path.join(OUTDIR,'style.css'))
await for_each(FILES,async (file) => {
    l("processing",file)
    let outfile = path.join(path.basename(file,'.md')) + '.html'
    await convert_file(file, OUTDIR, outfile)
})

const SRC = [
    'src/chart.js',
    'src/math.js',
    'src/lists.js',
]


let apis = []
await for_each(SRC, async(file) => {
    l("parsing api from",file)
    let raw = (await fs.readFile(file)).toString()
    let defs = await parse_api_docs(raw)
    apis = apis.concat(defs)
})

// l("final apis")
// l(apis)

function group_modules(apis) {
    let groups = {}
    apis.forEach(api => {
        if(api.type === 'block') {
            let group_name = null
            let name = null
            let params = null
            let summary = null
            api.tags.forEach(tag => {
                // console.log("tag",tag)
                if(tag[0] === 'module') group_name = tag[1]
                if(tag[0] === 'name') name = tag[1]
                if(tag[0] === 'params') params = tag[1]
                if(tag[0] === 'summary') summary = tag[1]
            })
            if(!group_name) throw new Error(`API needs to be in a group\n${api.raw}`)
            if(!name) throw new Error(`API needs a name\n${api.raw}`)
            if(!groups[group_name]) groups[group_name] = []
            groups[group_name].push({
                name,
                params,
                summary,
            })
            return
        }
        // console.log("api",api)
    })
    return groups
}

let modules = group_modules(apis)
console.log("groups are")
console.log(modules)
await fs.writeFile('output/api.json',JSON.stringify(modules,null,"    "))

//sort into groups
//generate big JSON file
//generate api.html
