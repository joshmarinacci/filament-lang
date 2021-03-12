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

        }
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
const b = tag('b')
const li = tag('li')
const ul = tag('ul')
const section = tag('section')
const body = tag('body')
const head = tag('head')
const html = tag('html')
const blockquote = tag('blockquote')
const nav = tag('nav')
function stylesheet_link(url) {
    return `<link rel='stylesheet' href='${url}'>`
}
function a(atts, ...content) {
    let ats = Object.entries(atts).map(([key,value]) => {
        return `${key}="${value}"`
    })
    return `<a ${ats.join(" ")} >${[...content].join("")}</a>`
}




const fn_param = ([name,type]) => dt(name)+dd(type)
const fn_example = (ex) => blockquote(ex)

const function_api = (fn) => li(
    a({name:fn.name},h3(fn.name)),
    dl(entries(fn.params,fn_param)),
    p(fn.summary),
    map(fn.examples,fn_example)
    )

const function_toc = (fn) => li(
    a({href:'#'+fn.name},fn.name)
)
const module = ([grp_name,group]) => section(
    nav(ul(a({name:grp_name},b(grp_name)),map(group,function_toc))),
    ul(map(group,function_api)))

const toc = ([grp_name,group]) => li(a({href:'#'+grp_name},grp_name))

export async function generate_api_html(out_file, mods) {
    // log("generating", mods, 'to dir', out_file)
    let output = html(
        head(
            stylesheet_link("api.css")
        ),
        body(
            h1("Filament API"),
            p(
                a({href:"tutorial.html"},"tutorial"),
                a({href:"intro.html"},"intro"),
                a({href:"spec.html"},"spec"),
                a({href:"api.generated.html"},"api"),
            ),
            nav(ul(b('API'),entries(mods,toc))),
            entries(mods,module)
        )
    )
    // log(output)
    await fs.writeFile(out_file, output)
}
