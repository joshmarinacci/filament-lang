export function resolve_in_order(proms) {
    let rets = []
    let pp = Promise.resolve()
    proms.forEach((p,i) => {
        pp = pp.then(p).then(ret => {
            rets.push(ret)
            return ret
        })
    })
    return pp.then(()=>rets)
}

async function mkdir(dir) {
    return new Promise((res,rej)=>{
        real_mkdir(dir,(err)=>{
            if(err) {
                // console.log(err)//return rej(err)
            }
            res()
        })
    })
}
