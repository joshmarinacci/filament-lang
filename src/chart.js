import {compareAsc, compareDesc, parse as parseDate, eachYearOfInterval, differenceInYears, format as formatDate} from 'date-fns'
import {FilamentFunction, REQUIRED} from './parser.js'
import {CanvasResult, is_string, scalar, string, unpack} from './ast.js'

class Bounds {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.x2 = this.x + this.w
        this.y2 = this.y+this.h
    }
    inset(n) {
        return new Bounds(this.x+n,this.y+n,this.w-n*2,this.h-n*2)
    }
    expand(n) {
        return this.inset(-n)
    }

}

function draw_legend(ctx, bounds, data, x_label, y_label) {
    let font_height = 20
    ctx.font = `${font_height}px sans-serif`
    let legend =`${x_label} vs ${y_label}`
    let metrics = ctx.measureText(legend)

    let xx = (bounds.w-metrics.width)/2
    let yy = font_height
    let txt_bounds = new Bounds(xx,yy-font_height,metrics.width,font_height)
    txt_bounds = txt_bounds.expand(10)
    ctx.fillStyle = '#cccccc'
    ctx.fillRect(txt_bounds.x,txt_bounds.y,txt_bounds.w, txt_bounds.h)
    ctx.fillStyle = 'black'
    ctx.fillText(legend,xx,yy)
}

const max = (data) => data.reduce((a,b)=> unpack(a)>unpack(b)?a:b)


function fill_bounds(ctx, b, red) {
    ctx.fillStyle = red
    ctx.fillRect(b.x,b.y,b.w,b.h)
}

function draw_scatter(ctx, bounds, data, x, y, size, name) {
    let font_size = 20
    let default_radius = 10

    let x_values = data._map((d,i) => data._get_field_from(x,d,i))
    let max_x = max(x_values)
    let x_scale = bounds.w/max_x

    let y_values = data._map((d,i) => data._get_field_from(y,d,i))
    let max_y = max(y_values)
    let y_scale = bounds.h/max_y

    let s_values = null
    let max_s = default_radius
    if(size) {
        s_values = data._map((d,i) => data._get_field_from(size,d,i).value)
        max_s = max(s_values)
    }
    let s_scale = 100/max_s

    let n_values = null
    if(name) {
        n_values = data._map((d, i) => data._get_field_from(name, d, i))
    }

    data._forEach((datum,i) => {
        let vx = x_values[i] * x_scale + bounds.x
        let vy = bounds.h - (y_values[i] * y_scale) + bounds.y
        let vs = default_radius
        if(size) vs = s_values[i] * s_scale
        ctx.fillStyle = '#ccffcc'
        ctx.beginPath()
        ctx.arc(vx, vy, vs, 0, Math.PI*2)
        ctx.fill()
        ctx.strokeStyle = 'black'
        ctx.stroke()
        if(name) {
            let vn = n_values[i]
            ctx.fillStyle = 'black'
            ctx.font = `${font_size}px sans-serif`
            let w = ctx.measureText(vn + "").width
            ctx.fillText(vn + "", vx - w / 2, vy)
        }
    })

    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(bounds.x,bounds.y)
    ctx.lineTo(bounds.x,bounds.y2)
    ctx.lineTo(bounds.x2,bounds.y2)
    ctx.stroke()
}

export const chart = new FilamentFunction('chart',
    {
        data:REQUIRED,
        x:null,
        xlabel:null,
        y:null,
        ylabel:null,
        type:string('bar'),
        size: null,
        name:null
    },
    function (data, x, xlabel, y, ylabel, type, size, name) {
    return new CanvasResult((canvas)=>{
        let ctx = canvas.getContext('2d')
        ctx.save()
        clear(ctx,canvas)
        if(data.data && data.data.items) data = data.data.items

        let x_label = 'index'
        if(x && x.type === 'string') x_label = x.value
        if(xlabel) x_label = xlabel.value

        let y_label = 'value'
        if(y && y.type === 'string') y_label = y.value
        if(ylabel) y_label = ylabel.value

        let bounds = new Bounds(0,0,canvas.width,canvas.height)
        if(type.value === 'bar') {
            // 20px padding on all sides
            bounds = bounds.inset(20)
            draw_bars(ctx,bounds,data,x_label,y)
            draw_legend(ctx,bounds,data,x_label,y_label)
        }
        if(type.value === 'scatter') {
            bounds = bounds.inset(20)
            //shift down by 50px to make room for the legend
            bounds = new Bounds(bounds.x,bounds.y+50,bounds.w,bounds.h-50)
            draw_scatter(ctx,bounds,data,x,y,size, name)
            draw_legend(ctx,bounds,data,x_label,y_label)
        }
        ctx.restore()
    })
},{
    summary:'simple bar and scatter charts'
    })

function clear(ctx,canvas) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width,canvas.height)
}

function draw_border(ctx, canvas) {
    ctx.fillStyle = 'white'
    ctx.lineWidth = 1.0
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.strokeStyle = 'black'
    ctx.strokeRect(3,3,canvas.width-6,canvas.height-6)
}

const COLORS = ['red','green','blue','yellow','magenta','cyan']

function draw_bars(ctx, bounds, data, x_label, y) {

    let bar_gap = 10
    let font_size = 20
    const bar_width = bounds.w/data._get_length()
    let get_y = (datum) => datum
    if(typeof y === 'function') get_y = y
    if(is_string(y)) get_y = (d,i) => data._get_field_from(y,d,i)

    let values = data._map(get_y)
    let max_val = max(values)

    // ctx.fillStyle = 'darkgray'
    // ctx.fillRect(bounds.x,bounds.y,bounds.w,bounds.h)

    data._forEach((datu,i)=>{
        let label = i+""
        if(x_label !== 'index') label = datu[x_label]
        ctx.fillStyle = 'black'
        ctx.font = `${font_size}px sans-serif`
        let xoff = (bar_width-bar_gap)/2
        let measure = ctx.measureText(label)
        xoff -= measure.width/2
        ctx.fillText(label,bounds.x+bar_width*i + xoff, bounds.y2)
        // ctx.fillRect(bounds.x+bar_width*i+xoff, bounds.y2-20,measure.width,5)
    })
    // make the bottom 30px shorter
    bounds = new Bounds(bounds.x,bounds.y,bounds.w,bounds.h-font_size)

    let scale = (bounds.h)/max_val
    data._forEach((datu,i)=>{
        let value = get_y(datu,i)
        ctx.fillStyle = COLORS[i%COLORS.length]
        ctx.fillRect(
            bounds.x+bar_width*i,
            bounds.y2-value*scale,
            bar_width-bar_gap,
            value*scale)
    })
}

function draw_centered_text(ctx, font_size, name, x, y) {
    ctx.fillStyle = 'black'
    ctx.font = `${font_size}px sans-serif`
    let measure1 = ctx.measureText(name)
    let xoff1 = measure1.width/2
    ctx.fillText(name,x - xoff1, y)
}

export const histogram = new FilamentFunction('histogram',{
    data:REQUIRED
}, function(data) {
    //count frequency of each item in the list
    //draw a barchart using frequency for height
    //use the key for the name
    return new CanvasResult((canvas)=>{
        let font_size = 20
        let ctx = canvas.getContext('2d')
        ctx.save()
        clear(ctx,canvas)
        let freqs = {}
        data._map(datum => {
            let letter = unpack(datum)
            if(!freqs[letter]) freqs[letter] = 0
            freqs[letter] += 1
        })
        let entries = Object.entries(freqs)
        let w = canvas.width / entries.length
        let max_y = max(entries.map(pair => pair[1]))
        let hh = canvas.height/max_y
        entries.forEach((pair,i) => {
            const [name,count] = pair
            ctx.fillStyle = COLORS[i%COLORS.length]
            let x = i*w
            let y = canvas.height - hh*count
            ctx.fillRect(x,y,w-5,hh*count)
            draw_centered_text(ctx,font_size,name,i*w+w/2, canvas.height-30)
            draw_centered_text(ctx,font_size,count+"",i*w+w/2, canvas.height-10)
        })
        ctx.restore()
    })
})

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
                date:get_date(datum,i)
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