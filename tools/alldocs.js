import {convert_file} from './builddocs.js'
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
    // l("processing",file)
    let outfile = path.join(path.basename(file,'.md')) + '.html'
    // await convert_file(file, OUTDIR, outfile)
})

const SRC = [
    'src/chart.js'
]


let api = []
await for_each(SRC, async(file) => {
    l("parsing api from",file)
    let defs = await parse_api_docs(file)
    api = api.concat(defs)
})

l("final apis",apis)
//sort into groups
//generate big JSON file
//generate api.html
