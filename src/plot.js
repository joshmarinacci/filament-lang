import {FilamentFunction, REQUIRED} from './parser.js'
import {CanvasResult, is_string, scalar, string, unpack} from './ast.js'

class Point {
    constructor(cx, cy) {
        this.x = cx
        this.y = cy
    }
}

class Rect {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.x2 = this.x + this.w
        this.y2 = this.y + this.h
        this.cx = this.x + this.w/2
        this.cy = this.y + this.h/2
    }
    center() {
        return new Point(this.cx,this.cy)
    }
}
function calc_bounds(canvas) {
    return new Rect(0,0,canvas.width,canvas.height)
}

function axes(ctx, b, zoom, origin) {
    ctx.save()
    ctx.strokeStyle = '#888888'
    ctx.beginPath()
    ctx.moveTo(b.x,b.cy)
    ctx.lineTo(b.x2,b.cy)
    ctx.moveTo(b.cx,b.y)
    ctx.lineTo(b.cx,b.y2)
    ctx.stroke()

    ctx.translate(b.cx,b.cy)
    ctx.scale(zoom,zoom)
    ctx.beginPath()
    for(let i=-10; i<10; i+=1) {
        ctx.moveTo(i,-0.25)
        ctx.lineTo(i,+0.25)
        ctx.moveTo(-0.25,i)
        ctx.lineTo(+0.25,i)
    }
    ctx.stroke()
    ctx.restore()
}

function background(ctx, bounds, zoom, origin) {
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(bounds.x,bounds.y,bounds.w,bounds.h)
}

async function draw_y_to_x(ctx, b, zoom, origin, xfun) {
    let vals = []
    for( let i=-10; i<10; i+=0.1) {
        let y = scalar(i)
        let x = await xfun.fun.apply(xfun,[y])
        vals.push([x.value,y.value])
    }
    draw_plot(ctx,b,zoom,origin,vals)
    return vals
}

function draw_plot(ctx, b, zoom, origin, vals) {
    ctx.save()
    ctx.translate(b.cx,b.cy)
    ctx.scale(zoom,zoom)
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    vals.forEach(([x,y],i) => (i === 0)?ctx.moveTo(x,y) : ctx.lineTo(x,y))
    ctx.stroke()
    ctx.restore()
}

async function draw_x_to_y(ctx, b, zoom, origin, yfun) {
    let vals = []
    for( let i=-10; i<10; i+=0.1) {
        let x = scalar(i)
        let y = await yfun.fun.apply(yfun,[x])
        vals.push([x.value,y.value])
    }
    draw_plot(ctx,b,zoom,origin,vals)
    return vals
}

export const plot = new FilamentFunction('plot',
    {
        x:null,
        y:null,
        polar:null,
    },
    function (x,y,polar) {
        return new CanvasResult((canvas)=> {
            console.log("rendering plot",x,y,polar)
            let ctx = canvas.getContext('2d')
            let bounds = calc_bounds(canvas)
            let zoom = 50
            let origin = bounds.center()
            background(ctx, bounds, zoom, origin)
            axes(ctx, bounds, zoom, origin)
            // if (polar) draw_polar()
            if (x && !y) return draw_y_to_x(ctx,bounds,zoom,origin,x)
            if (y && !x) return draw_x_to_y(ctx,bounds,zoom,origin,y)
            // if (y && !x) draw_y()
            // if (x && y) draw_t()
        })
    })
