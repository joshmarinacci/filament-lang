import {promises as fs} from 'fs'
export function group_modules(apis) {
    let groups = {}
    apis.forEach(api => {
        if (api.type === 'block') {
            let group_name = null
            let name = null
            let params = null
            let summary = null
            let examples = []
            api.tags.forEach(tag => {
                // console.log("tag",tag)
                if (tag[0] === 'module') group_name = tag[1]
                if (tag[0] === 'name') name = tag[1]
                if (tag[0] === 'params') params = tag[1]
                if (tag[0] === 'summary') summary = tag[1]
                if (tag[0] === 'example') examples.push(tag[1])
            })
            if (!group_name) throw new Error(`API needs to be in a group\n${api.raw}`)
            if (!name) throw new Error(`API needs a name\n${api.raw}`)
            if (!groups[group_name]) groups[group_name] = []
            groups[group_name].push({
                name,
                params,
                summary,
                examples,
            })
            return
        }
        // console.log("api",api)
    })
    return groups
}


function log() { console.log(...arguments)}

function tag(name) {
    return function() {
        return `\n<${name}>${[...arguments].join("")} </${name}>`
    }
}
const entries = (obj,fun) => Object.entries(obj).map(fun).join("")
const map = (arr,fn) => arr.map(fn).join("")

const h1 = tag('h1')
const h2 = tag('h2')
const h3 = tag('h3')
const dt = tag('dt')
const dd = tag('dd')
const dl = tag('dl')
const p = tag('p')
const li = tag('li')
const ul = tag('ul')
const section = tag('section')
const body = tag('body')
const head = tag('head')
const html = tag('html')
const blockquote = tag('blockquote')
function stylesheet_link(url) {
    return `<link rel='stylesheet' href='${url}'>`
}




const fn_param = ([name,type]) => dt(name)+dd(type)
const fn_example = (ex) => {
    console.log("ezample is",ex)
    return blockquote(ex)
}

const function_api = (fn) => li(
    h3(fn.name),
    dl(entries(fn.params,fn_param)),
    p(fn.summary),
    map(fn.examples,fn_example)
    )

const module = ([grp_name,group]) => section(
    h2(grp_name),
    ul(map(group,function_api)))


export async function generate_api_html(out_file, mods) {
    log("generating", mods, 'to dir', out_file)
    let output = html(
        head(
            stylesheet_link("api.css")
        ),
        body(
            h1("API"),
            entries(mods,module)
        )
    )
    log(output)
    await fs.writeFile(out_file, output)
}
