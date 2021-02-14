import {convert_file} from './builddocs.js'
import path from 'path'
import {copy, for_each, init_pureimage, l, mkdir} from './util.js'


const OUTDIR = 'output'
const FILES = [
    // 'docs/api.md',
    'docs/intro.md'
    // 'docs/spec.md',
    // 'docs/tutorial.md'
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
