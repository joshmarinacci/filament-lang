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
