import {convert_file} from './builddocs.js'
import {promises as fs} from 'fs'
import path from 'path'
import {copy, for_each, init_pureimage, l, mkdir} from './util.js'
import {parse_api_docs} from './api_parser.js'
import {generate_api_html, group_modules} from './api_generator.js'


const OUTDIR = 'output'
const FILES = [
    'docs/api.md',
    'docs/intro.md',
    'docs/spec.md',
    'docs/tutorial.md',
    'tools/test.md',
]

async function setup() {
    await init_pureimage()
    await mkdir(OUTDIR)
    await mkdir(path.join(OUTDIR, 'images'))
    await copy("tools/style.css", path.join(OUTDIR, 'style.css'))
    await copy("tools/prism.css", path.join(OUTDIR, 'prism.css'))
    await copy("tools/api.css", path.join(OUTDIR, 'api.css'))
    await copy("tools/prism.js", path.join(OUTDIR, 'prism.js'))
    await copy("tools/filament-style.js", path.join(OUTDIR, 'filament-style.js'))
}

async function make_prose_docs() {
    await for_each(FILES,async (file) => {
        l("processing",file)
        let outfile = path.join(path.basename(file,'.md')) + '.html'
        await convert_file(file, OUTDIR, outfile)
    })
}


const SRC = [
    'src/chart.ts',
    'src/math.ts',
    'src/lists.ts',
    // 'tools/test.api.js',
]


async function make_api_docs(files) {
    let apis = []
    await for_each(files, async (file) => {
        l("parsing api from", file)
        let raw = (await fs.readFile(file)).toString()
        let defs = await parse_api_docs(raw)
        apis = apis.concat(defs)
    })

    let modules = group_modules(apis)
    await fs.writeFile('output/api.json', JSON.stringify(modules, null, "    "))
    await generate_api_html('output/api.generated.html',modules)
}

await setup()
await make_prose_docs()
await make_api_docs(SRC)

