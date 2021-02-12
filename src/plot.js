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

function axes(ctx, bounds, zoom, origin) {
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(bounds.x,bounds.cy)
    ctx.lineTo(bounds.x2,bounds.cy)
    ctx.moveTo(bounds.cx,bounds.y)
    ctx.moveTo(bounds.cx,bounds.y2)
}

function background(ctx, bounds, zoom, origin) {
    ctx.fillStyle = 'magenta'
    ctx.fillRect(bounds.x,bounds.y,bounds.w,bounds.h)
}

async function draw_x_to_y(ctx, bounds, zoom, origin, yfun) {
    console.log("yfun is",yfun)

    // return Promise.resolve(42)

    let val = await yfun.fun.apply(yfun,[scalar(42)])

    console.log('value is',val)
    // return Promise.resolve(ret).then((ret => {
    //     console.log("real ret is",ret)
    //     return ret
    // }))

    // ctx.save()
    // ctx.strokeStyle = 'red'
    // ctx.beginPath()
    // for(let x=0; x<10; x++) {
        // console.log(x,yfun(x))
        // if(x === 0) {
        //     ctx.moveTo(x, yfun(x))
        // } else {
        //     ctx.lineTo(x, yfun(x))
        // }
    // }
    // ctx.stroke()
    // ctx.restore()

    return 'done'
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
            if (y) return draw_x_to_y(ctx,bounds,zoom,origin,y)
            // if (y && !x) draw_y()
            // if (x && y) draw_t()
        })
    })
