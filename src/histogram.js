import {FilamentFunctionWithScope, REQUIRED} from './parser.js'
import {CanvasResult, is_scalar, scalar, string, unpack} from './ast.js'
import {Bounds, clear, COLORS, draw_centered_text, max, STYLE} from './graphics.js'

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
        let max_y = max(entries.map(pair => pair[1]))
        let hh = canvas.height/max_y
        //draw bars
        entries.forEach((pair,i) => {
            const [name,count] = pair
            ctx.fillStyle = COLORS[i%COLORS.length]
            ctx.fillRect(bounds.x+i*w,bounds.y2-hh*count,w-5,hh*count)
        })
        entries.forEach((pair,i) => {
            const [name,count] = pair
            draw_centered_text(ctx,STYLE.FONT_SIZE,name,bounds.x+i*w+w/2, bounds.y2-20)
            draw_centered_text(ctx,STYLE.FONT_SIZE,count+"",bounds.x+i*w+w/2, bounds.y2-40)
        })

        let lx = bounds.x+bounds.w/2
        let ly = bounds.y+STYLE.FONT_SIZE

        draw_centered_text_with_background(ctx,lx,ly,unpack(title),STYLE.FONT_SIZE,STYLE.LEGEND.FILL_COLOR)
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


