import {all, s, setup} from './common.js'
import {date, time} from '../src/ast.js'

await setup()

describe('min max ranges',() => {
    it('simple dates', async () => {
        await all([
            ['date("July 27 2021",format:"MMMM dd yyyy")', date(2021,7,27)],
            ['date(input:"8/8/08",format:"MM/dd/yy")',date(2008,8,8)],
            ['date(year:2021, month:7, day:27)',date(2021,7,27)],
            // ['date(year:2021)',date(2021)],
            // ['date("July 27th 2021")',date(2021,7,27)],
        ])
    })
    it('time',async() => {
        await all([
            ['time("3:42",format:"kk:mm")',time(3,42,0)],
            ['time("14:42:33",format:"kk:mm:ss")',time(14,42,33)],
            ['time("3:42pm",format:"hh:mmaa")',time(12+3,42,0)],
            ['time("4$42$am",format:"h$mm$a")',time(4,42,0)]
        ])
    })
    it("durations",async()=>{
        await all([
            ['23hours + 60minutes as days',s(1,'day',1)],
            ['23min - 8s',s(23*60-8,'second',1)],
            ['80min * 6',s(80*6,'minute',1)],
        ])
    })
    it("date math",async()=>{
        await all([
            // days until next christmas
            ['date(month:12, day:25, year:2021) - date(month:2, day:16, year:2021) as days',s(312,'day',1)]
        ])
    })
    it("time math",async()=>{
        await all([
            ['time("8pm",format:"hhaa") - time("2am",format:"hhaa") as hours',s(18,'hour',1)],
            ['time("3am",format:"hhaa") + 2hours',time(5,0,0)],
        ])
    })
})