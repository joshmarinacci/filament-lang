import {FilamentFunction, FilamentFunctionWithScope, REQUIRED} from './parser.js'
import {CanvasResult, is_string, scalar, string, unpack} from './ast.js'
import {apply_fun} from './util.js'

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
    zoom = zoom
    ctx.save()
    ctx.strokeStyle = '#cccccc'
    ctx.translate(b.cx,b.cy)
    ctx.scale(zoom,zoom)
    ctx.lineWidth = 2/zoom
    let top = b.h/zoom
    let bottom = -b.h/zoom
    let left = -b.w/zoom
    let right = b.w/zoom

    //grid lines
    ctx.beginPath()
    for(let i=left; i<right; i+=1) {
        ctx.moveTo(i, top)
        ctx.lineTo(i, bottom)
    }
    for(let i=bottom; i<top; i+=1) {
        ctx.moveTo(left,i)
        ctx.lineTo(right,i)
    }
    ctx.stroke()
    ctx.restore()

    //main axes
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(b.x,b.cy)
    ctx.lineTo(b.x2,b.cy)
    ctx.moveTo(b.cx,b.y)
    ctx.lineTo(b.cx,b.y2)
    ctx.stroke()

}

function background(ctx, bounds, zoom, origin) {
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(bounds.x,bounds.y,bounds.w,bounds.h)
}

function draw_plot(ctx, b, zoom, origin, vals) {
    ctx.save()
    ctx.translate(b.cx,b.cy)
    ctx.scale(zoom.value,-zoom.value)
    ctx.lineWidth = 2/zoom
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    vals.forEach(([x,y],i) => (i === 0)?ctx.moveTo(x,y) : ctx.lineTo(x,y))
    ctx.stroke()
    ctx.restore()
}

async function draw_y_to_x(scope, ctx, b, zoom, origin, xfun,min,max) {
    let vals = []
    for( let i=min.value; i<max.value; i+=0.1) {
        let y = scalar(i)
        let x = await apply_fun(scope,xfun,[y])
        vals.push([x.value,y.value])
    }
    draw_plot(ctx,b,zoom,origin,vals)
    return vals
}

async function draw_x_to_y(scope, ctx, b, zoom, origin, yfun,min,max) {
    let vals = []
    for( let i=min.value; i<max.value; i+=0.1) {
        let x = scalar(i)
        let y = await apply_fun(scope,yfun,[x])
        vals.push([x.value,y.value])
    }
    draw_plot(ctx,b,zoom,origin,vals)
    return vals
}

async function draw_t_to_xy(scope, ctx, b, zoom, origin, xfun, yfun,min,max) {
    let vals = []
    for (let i = min.value; i < max.value; i += 0.1) {
        let t = scalar(i)
        let x = await apply_fun(scope,xfun,[t])
        let y = await apply_fun(scope,yfun, [t])
        vals.push([x.value, y.value])
    }
    draw_plot(ctx,b,zoom,origin,vals)
    return vals
}

async function draw_polar(scope, ctx, b, zoom, origin, polar, min,max) {
    let vals = []
    for (let i = min.value; i < max.value; i += 0.05) {
        let theta = scalar(i)
        let rho = await apply_fun(scope, polar, [theta])
        let x = Math.sin(i)*rho.value
        let y = Math.cos(i)*rho.value
        vals.push([x,y])
    }
    draw_plot(ctx,b,zoom,origin,vals)
    return vals
}

export const plot = new FilamentFunctionWithScope('plot',
    {
        x:null,
        y:null,
        polar:null,
        min:scalar(-10),
        max:scalar(10),
        zoom: scalar(50),
    },
    function (scope,x,y,polar,min,max,zoom) {
        return new CanvasResult((canvas)=> {
            // console.log("rendering plot",x,y,polar)
            let ctx = canvas.getContext('2d')
            let bounds = calc_bounds(canvas)
            let origin = bounds.center()
            background(ctx, bounds, zoom, origin)
            axes(ctx, bounds, zoom.value, origin)
            // if (polar) draw_polar()
            if (x && !y) return draw_y_to_x(scope,ctx,bounds,zoom,origin,x,min,max)
            if (y && !x) return draw_x_to_y(scope,ctx,bounds,zoom,origin,y,min,max)
            if (x &&  y) return draw_t_to_xy(scope,ctx,bounds,zoom,origin,x,y,min,max)
            if(polar) return draw_polar(scope,ctx,bounds,zoom,origin,polar,min,max)
            // if (x && y) draw_t()
        })
    })
