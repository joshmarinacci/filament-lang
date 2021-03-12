#!/usr/bin/env node
import {promises as fs} from 'fs'
import {parse_api_docs} from './api_parser.js'
import {group_modules} from './api_generator.js'

const SRC = [
    'src/chart.js',
    'src/math.js',
    'src/lists.js',
]


export async function for_each(files, process_file) {
    for (const file of files) {
        await process_file(file)
    }
}

async function make_api_docs(files) {
    let apis = []
    await for_each(files, async (file) => {
        // l("parsing api from", file)
        let raw = (await fs.readFile(file)).toString()
        let defs = await parse_api_docs(raw)
        apis = apis.concat(defs)
    })

    let modules = group_modules(apis)
    let json = JSON.stringify(modules, null, "    ")
    // await fs.writeFile('output/api.json', json)
    // await generate_api_html('output/api.generated.html',modules)
    json = json.replaceAll(/`/g,"'")
    const js = `export default String.raw\`${json}\``;
    await fs.writeFile('src/api.json.js',js)
}


await make_api_docs(SRC)
