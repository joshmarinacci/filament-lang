import {all, b, l, s, setup} from "./common.js"
import {list, string} from '../dist/index.js'

await setup()
console.log("done with setup")

describe('complex',() => {
    it("gui examples", async () => {
        await all([
            ['add(1,2)', s(3)],
            [`[1,2,3]`, l(1,2,3)],
            [`add([1,2], [3,4])`, l(4,6)],
            [`range(min:0,max:20,step:5)`, l(0,5,10,15)],
            ['take(range(10),2)', l(0, 1)],
            ['take(range(min:0, max:100,step:10), 4)', l(0,10,20,30)],
            [`join([1,2,3], [4,5,6])`, l(1, 2, 3, 4, 5, 6)],
            [`reverse(range(11))`, l(10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0)],
            [`range(10) >> take(2)`, l(0, 1)],
            [`dataset('alphabet') >> length()`, s(26)],
            [`{
            alpha << dataset('alphabet')
            length(alpha)
            }`, s(26)],
            [`dataset('planets') >> length()`, s(8)],
            [`{countries << take(dataset('countries'), 10)
           length(countries)}`, s(10)],
            [`{states << dataset('states')
    def first_letter (state:?) {
       take(get_field(state,'name'), 1)
    }
    states << map(states, first_letter)
    take(states,1)
    }`, list([string('A')])],
            // [ `dataset('states') >> timeline(date:'statehood_date', name:'name')`],
            // [ `chart(stockhistory('AAPL'), y:'close')`],
        ])
    })
})
