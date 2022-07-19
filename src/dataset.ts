import {parse as parseDate} from 'date-fns'
import {cached_json_fetch} from './cache.js'
import {FTable} from './ast.js'
import {FilamentFunction, REQUIRED} from "./base.js";

let AV_API_KEY= '1S4KT3P0F4XXIVRL'
export const dataset = new FilamentFunction('dataset', {
        name:REQUIRED,
    },
    async function (name) {
        let url = `https://api.silly.io/api/list/${name.value}`
        this.log("loading",url)
        return await cached_json_fetch(url).then(json => {
            return new FTable(json)
        })
    }
)



export const stockhistory  = new FilamentFunction('stockhistory', {
    symbol:REQUIRED,
},async function(symbol) {
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol.value}&apikey=${AV_API_KEY}`
    return await cached_json_fetch(url).then(d => {
        let hash_data = d['Monthly Time Series']
        let data = Object.entries(hash_data).map(([name,obj]) => {
            return {
                date:parseDate(name,'yyyy-MM-dd',new Date()),
                close: parseFloat(obj['4. close'])
            }
        })
        console.log("final data",data.length)
        return new FTable({
            data: {
                schema: {
                    properties: {}
                },
                items: data
            }
        })
    })
})
