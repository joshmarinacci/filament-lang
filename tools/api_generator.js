import {promises as fs} from 'fs'
export function group_modules(apis) {
    let groups = {}
    apis.forEach(api => {
        if (api.type === 'block') {
            let group_name = null
            let name = null
            let params = null
            let summary = null
            api.tags.forEach(tag => {
                // console.log("tag",tag)
                if (tag[0] === 'module') group_name = tag[1]
                if (tag[0] === 'name') name = tag[1]
                if (tag[0] === 'params') params = tag[1]
                if (tag[0] === 'summary') summary = tag[1]
            })
            if (!group_name) throw new Error(`API needs to be in a group\n${api.raw}`)
            if (!name) throw new Error(`API needs a name\n${api.raw}`)
            if (!groups[group_name]) groups[group_name] = []
            groups[group_name].push({
                name,
                params,
                summary
            })
            return
        }
        // console.log("api",api)
    })
    return groups
}


function log() { console.log(...arguments)}

export async function generate_api_html(out_file, groups) {
    log("generating", groups, 'to dir', out_file)
    let html = `
<html>
<head></head>
<body>

${
        Object.entries(groups).map(([grp_name,group]) => {
            return `<section>
<h2>${grp_name}</h2>

<ul>
${group.map(fun => {
    console.log(fun.params)
     return `
<li>
<h3>${fun.name}</h3>
<dl>
${Object.entries(fun.params).map(([name,type]) => {
    return `<dt>${name}</dt> <dd>${type}</dd>`
}).join("")}
<dt>foo</dt>
<dd>bar</dd>
</dl>
<p>${fun.summary}</p>
</li>`   
}).join("")}
</ul>
 
</section>
`
        }).join("")
    }

<section>


</body>
</html>
`
    log(html)
    await fs.writeFile(out_file, html)
}
