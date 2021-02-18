export function resolve_in_order(proms) {
    let pp = Promise.resolve()
    proms.forEach(p => {
        pp = pp.then(p)
    })
    return pp
}
