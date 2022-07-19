import {CanvasResult, is_scalar, scalar, string, unpack} from './ast.js'
import {
    Bounds,
    clear,
    COLORS,
    draw_centered_text,
    draw_right_aligned_text,
    max,
    STYLE
} from './graphics.js'
import {FilamentFunctionWithScope, REQUIRED} from "./base.js";

function draw_y_axis(c,b,max) {
    //y axis line
    c.lineWidth = STYLE.Y_AXIS.LINE_WIDTH
    c.strokeStyle = STYLE.Y_AXIS.LINE_COLOR

    c.beginPath()
    c.moveTo(b.x,b.y)
    c.lineTo(b.x,b.y2)
    c.stroke()

    let min = 0
    // console.log("doing ticks from",min,max,'over',b.h,b.y2)


    let size = b.h/(max-min)
    for(let i=min; i<=max; i++) {
        let y = b.y2 - i*size
        c.fillStyle = 'black'
        c.fillRect(b.x-10,y,10,1)
        draw_right_aligned_text(c,i+"",b.x-2,y+5)
    }
}

/**
 * @name {histogram}
 * @module {charts}
 * @params {
 *     data: required,
 *     bucket:scalar(1),
 *     title:string('count'),
 * }
 * @return CanvasResult
 * @summary {Draws a histogram by counting repeated values in the data. Counts by buckets,
 * so a bucket of 10 would give you counts of 0->9, 10->19, 20->29, etc. }
 */

export const histogram = new FilamentFunctionWithScope('histogram',{
    data:REQUIRED,
    bucket:scalar(1),
    title:string('count'),
}, function(scope,data,bucket,title) {
    //count frequency of each item in the list
    //draw a barchart using frequency for height
    //use the key for the name
    return new CanvasResult((canvas)=>{
        let ctx = canvas.getContext('2d')
        ctx.save()
        clear(ctx,canvas)

        const freqs = calc_frequencies(data, bucket)
        let bounds = new Bounds(0,0,canvas.width,canvas.height)
        bounds = bounds.inset(STYLE.FONT_SIZE*1.5)

        let entries = Object.entries(freqs)
        let w = bounds.w / entries.length
        let gap = 5
        let max_y = max(entries.map(pair => pair[1]))
        let hh = bounds.h/max_y
        //draw bars
        entries.forEach((pair,i) => {
            const [name,count] = pair
            let h = hh*(count as number)
            ctx.fillStyle = COLORS[i%COLORS.length]
            ctx.fillRect(bounds.x+i*w+gap,bounds.y2-h,w-gap*2,h)
        })
        entries.forEach((pair,i) => {
            const [name,count] = pair
            draw_centered_text(ctx,STYLE.FONT_SIZE,name,bounds.x+i*w+w/2, bounds.y2-20)
            draw_centered_text(ctx,STYLE.FONT_SIZE,count+"",bounds.x+i*w+w/2, bounds.y2-40)
        })

        let lx = bounds.x+bounds.w/2
        let ly = bounds.y+STYLE.FONT_SIZE

        //legend
        draw_centered_text_with_background(ctx,lx,ly,unpack(title),STYLE.FONT_SIZE,STYLE.LEGEND.FILL_COLOR)

        //y axis
        draw_y_axis(ctx,bounds,max_y)
        ctx.restore()
    })
})

function fill_bounds(ctx, tb, FILL_COLOR) {
    ctx.fillStyle = FILL_COLOR
    ctx.fillRect(tb.x,tb.y,tb.w,tb.h)
}

function draw_centered_text_with_background(ctx, lx,ly,title, padding, fill_color) {
    let tm = ctx.measureText(title)
    let tb = new Bounds(lx-tm.width/2,ly,tm.width,STYLE.FONT_SIZE)
    tb = tb.expand(padding)
    fill_bounds(ctx,tb, fill_color)
    ctx.fillStyle = STYLE.FONT_COLOR
    ctx.font = STYLE.FONT
    ctx.fillText(title,lx-tm.width/2,ly+STYLE.FONT_SIZE)
}


function calc_frequencies(data, bucket) {
    bucket = unpack(bucket)
    let freqs = {}
    data._map(datum => {
        let value = unpack(datum)
        // console.log("value",value)
        if(is_scalar(value)) {
            value = Math.round(value / bucket) * bucket
        }
        if(!freqs[value]) freqs[value] = 0
        freqs[value] += 1
    })
    // console.log("bucket is",bucket)
    // console.log("final frequencies",freqs)
    return freqs
}


