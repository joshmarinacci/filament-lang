import {FilamentFunction, REQUIRED} from './parser.js'
import {CanvasResult, is_string, string, unpack} from './ast.js'
import {
    Bounds,
    clear, COLORS,
    draw_centered_text,
    draw_right_aligned_text,
    max,
    min,
    STYLE
} from './graphics.js'

function draw_legend(c, b, m) {
    c.font = STYLE.FONT
    let legend =`${m.x_label} vs ${m.y_label}`
    let metrics = c.measureText(legend)

    let xx = b.x+(b.w-metrics.width)/2
    let yy = STYLE.FONT_SIZE
    let txt_bounds = new Bounds(xx,yy-STYLE.FONT_SIZE,metrics.width,STYLE.FONT_SIZE)
    txt_bounds = txt_bounds.expand(10)
    c.fillStyle = STYLE.LEGEND.FILL_COLOR
    c.fillRect(txt_bounds.x,txt_bounds.y,txt_bounds.w, txt_bounds.h)
    c.fillStyle = STYLE.FONT_COLOR
    c.font = STYLE.FONT
    c.fillText(legend,xx,yy)
}


function draw_scatter(c, b, m) {
    let default_radius = 10
    let x_scale = b.w/m.x_axis.max
    let y_scale = b.h/m.y_axis.max
    let max_s = default_radius
    if(m.size) max_s = m.size_axis.max
    let s_scale = 100/max_s

    m.data._forEach((datum,i) => {
        let vx = m.x_axis.values[i] * x_scale + b.x
        let vy = b.h - (m.y_axis.values[i] * y_scale) + b.y
        let vs = default_radius
        if(m.size) vs = m.size_axis.values[i] * s_scale
        c.fillStyle = '#ccffcc'
        c.beginPath()
        c.arc(vx, vy, vs, 0, Math.PI*2)
        c.fill()
        c.strokeStyle = 'black'
        c.stroke()
        if(m.name) {
            let vn = unpack(m.name_axis.values[i])
            draw_centered_text(c,STYLE.FONT_SIZE, vn+"", vx, vy)
        }
    })

    c.strokeStyle = STYLE.X_AXIS.LINE_COLOR
    c.lineWidth = STYLE.X_AXIS.LINE_WIDTH
    c.beginPath()
    c.moveTo(b.x,b.y)
    c.lineTo(b.x,b.y2)
    c.lineTo(b.x2,b.y2)
    c.stroke()
}

function calc_data_metrics(data, x, x_label, y, y_label, size, name) {
    if(!x) x = 'index'
    let m = {
        data:data,
        x:x,
        x_label:x_label,
        y:y,
        y_label:y_label,
        count:data._get_length(),
        size: size,
        name:name,
    }
    if(x) {
        m.x_axis = {
            get: (d, i) => {
                if (m.x === 'index') return i + ""
                return m.data._get_field_from(m.x, d, i)
            },
        }
        m.x_axis.values = m.data._map(m.x_axis.get)
        m.x_axis.max = unpack(max(m.x_axis.values))
        m.x_axis.min = unpack(min(m.x_axis.values))
    }

    m.y_axis = {
        get:(d,i)=>{
            if(typeof m.y === 'function') return m.y(d,i)
            if(is_string(m.y)) return m.data._get_field_from(m.y,d,i)
            return d
        },
    }
    m.y_axis.values = m.data._map(m.y_axis.get)
    m.y_axis.max = unpack(max(m.y_axis.values))
    m.y_axis.min = unpack(min(m.y_axis.values))

    if(size) {
        m.size_axis = {
            get: (d, i) => m.data._get_field_from(m.size, d, i),
        }
        m.size_axis.values = m.data._map(m.size_axis.get)
        m.size_axis.max = unpack(max(m.size_axis.values))
    }
    if(name) {
        m.name_axis = {
            get: (d, i) => m.data._get_field_from(m.name, d, i),
        }
        m.name_axis.values = m.data._map(m.name_axis.get)
        m.name_axis.max = unpack(max(m.name_axis.values))
    }
    return m
}

/**
 * @name {chart}
 * @module {charts}
 * @params {
 *     data: required,
 *     x: null,
 *     xlabel, null,
 *     y: null,
 *     ylabel:null,
 *     type:string('bar')
 *     size:null,
 *     name:null,
 * }
 * @return CanvasResult
 * @summary { Draws a chart. Type can be either 'bar' or 'scatter'.
 *
 * }
 */
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
        let m = calc_data_metrics(data,
            x,x_label,
            y,y_label,
            size,
            name,
            )
        bounds = bounds.inset(STYLE.FONT_SIZE*1.5)
        if(type.value === 'bar') {
            draw_xaxis(ctx,bounds,m)
            draw_yaxis(ctx,bounds,m)
            draw_bars(ctx,bounds,m)
            draw_legend(ctx,bounds,m)
        }
        if(type.value === 'scatter') {
            bounds = new Bounds(bounds.x+50,bounds.y+50,bounds.w-50,bounds.h-50)
            draw_scatter(ctx,bounds,m)
            draw_legend(ctx,bounds,m)
            draw_xaxis(ctx,bounds,m)
            draw_yaxis(ctx,bounds,m)
        }
        ctx.restore()
    })
},{
    summary:'simple bar and scatter charts'
    })


function draw_bars(ctx, bounds, m) {
    let bar_inset = 5
    const bar_width = bounds.w/m.count
    let y_scale = (bounds.h)/m.y_axis.max

    m.y_axis.values.forEach((item,i)=>{
        let value = unpack(m.y_axis.get(item,i))
        ctx.fillStyle = COLORS[i%COLORS.length]
        ctx.fillRect(
            bounds.x + bar_width * i+bar_inset,
            bounds.y2-value*y_scale,
            bar_width-bar_inset*2,
            value*y_scale)
    })
}

function draw_xaxis(c, b, m) {
    const bar_width = b.w/m.count


    // x axis line
    c.lineWidth = STYLE.X_AXIS.LINE_WIDTH
    c.strokeStyle = STYLE.X_AXIS.LINE_COLOR
    c.beginPath()
    c.moveTo(b.x,b.y2)
    c.lineTo(b.x2,b.y2)
    c.stroke()

    // ticks between each section, below the line
    c.beginPath()
    for(let i=0; i<=m.count; i++) {
        c.moveTo(b.x+i*bar_width, b.y2)
        c.lineTo(b.x+i*bar_width, b.y2 + STYLE.X_AXIS.TICK_LENGTH)
    }
    c.stroke()

    // labels for each bar below the line
    c.fillStyle = STYLE.FONT_COLOR
    c.font = STYLE.FONT
    m.x_axis.values.forEach((item,i)=>{
        let label = unpack(m.x_axis.get(item,i))
        let x = b.x+bar_width*i + bar_width/2
        let y = b.y2+STYLE.FONT_SIZE
        draw_centered_text(c,STYLE.FONT_SIZE,label,x,y)
    })
}

function draw_yaxis(c, b, m) {
    let ticks = m.y_axis.max - 0
    let tick_gap = b.h/ticks
    while(tick_gap < 20) {
        tick_gap = tick_gap*10
        ticks = ticks / 10
    }
    ticks = Math.floor(ticks)
    tick_gap = Math.floor(tick_gap)

    //y axis line
    c.lineWidth = STYLE.Y_AXIS.LINE_WIDTH
    c.strokeStyle = STYLE.Y_AXIS.LINE_COLOR

    //y axis line
    c.beginPath()
    c.moveTo(b.x,b.y)
    c.lineTo(b.x,b.y2)
    c.stroke()

    //draw background lines
    c.beginPath()
    //light h lines across each tick
    for(let i=0; i<ticks; i++) {
        c.moveTo(b.x,b.y2-i*tick_gap)
        c.lineTo(b.x2,b.y2-i*tick_gap)
    }
    c.stroke()

    //draw tick labels
    for(let i=0; i<ticks; i++) {
        let label = (ticks-i)+""
        draw_right_aligned_text(c,label,b.x,b.y2-(ticks-i)*tick_gap)
    }

}

