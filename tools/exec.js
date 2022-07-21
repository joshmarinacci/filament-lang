// import {eval_code, setup_parser} from '../src/index.ts'
import {createWriteStream, promises as fs} from 'fs'
// import {make_standard_scope} from '../src/lang.ts'
import {default as PImage} from 'pureimage'
import {default as path} from 'path'

async function run_exec() {
    if (process.argv.length < 3) return console.log("missing file\nnpm run exec <filename.fila>")
    let src_path = process.argv[2]
    let outfile_path = null
    if(process.argv.length > 3) {
        outfile_path = process.argv[3]
    }
    console.log("running", src_path,outfile_path)

    // console.log("parsing",code)
    // await mkdir('output')
    // await mkdir('output/turtle')
    // console.log("rendering to ",fname)
    await setup_parser()
    let std_scope = make_standard_scope()
    let code = await fs.readFile(src_path)
    let ret = await eval_code(code, std_scope)
    console.log("output\n",ret)
    if(ret.width && ret.height && ret.data && outfile_path) {
        console.log('writing out', outfile_path)
        await PImage.encodePNGToStream(ret, createWriteStream(outfile_path))
    }
}
run_exec()
