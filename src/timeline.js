import {CanvasResult, is_string, unpack} from './ast'
import {
    compareAsc,
    compareDesc,
    differenceInYears,
    format as formatDate,
    parse as parseDate
} from 'date-fns'
import {FilamentFunction, REQUIRED} from './base'
import {clear} from './graphics'

export const timeline = new FilamentFunction('timeline',
    {
        data:REQUIRED,
        date:REQUIRED,
        name:REQUIRED,
    },
    function(data, date, name) {
        let get_date = (datum) => datum
        if(is_string(date)) get_date = (d,i) => {
            let dt = data._get_field_from(date,d,i)
            if(is_string(dt)) return parseDate(unpack(dt),'MMMM dd, yyyy', new Date())
            return dt
        }

        let date_values = data._map(get_date)
        date_values.sort((a,b)=>compareAsc(a,b))
        let min = date_values[0]
        let max = data._map(get_date)
        max.sort((a,b)=> compareDesc(a,b))
        max = max[0]
        let interval = {
            start:min,
            end:max,
        }
        return new CanvasResult((canvas)=>{
            let ctx = canvas.getContext('2d')
            ctx.save()
            clear(ctx,canvas)
            let width = canvas.width
            let height = canvas.height
            let pairs = data._map((datum,i) => {
                return {
                    name:data._get_field_from(name,datum,i),
                    date:get_date(datum)
                }
            })

            pairs.forEach((datum,i) => {
                ctx.fillStyle = 'aqua'
                ctx.fillStyle = 'black'
                let diff_x = differenceInYears(datum.date,min)
                let x = diff_x*10
                let y = 0
                ctx.fillRect(x,y,2,canvas.height-30)
                ctx.fillText(datum.name,x+2, (i%20)*10)
            })

            ctx.fillText(formatDate(min,'yyyy'),0,height-10)
            ctx.fillText(formatDate(max,'yyyy'),width-20,height-10)
            ctx.restore()
        })
    }
)
