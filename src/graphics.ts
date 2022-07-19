import {unpack} from './ast'

export const COLORS = ['red','green','blue','yellow','magenta','cyan']
const font_size = 20
export const STYLE = {
    FONT_SIZE:font_size,
    FONT:`${font_size}px sans-serif`,
    FONT_COLOR: 'black',
    X_AXIS: {
        TICK_LENGTH:10,
        LINE_WIDTH: 2,
        LINE_COLOR:'#888888',
    },
    Y_AXIS: {
        TICK_LENGTH:2,
        LINE_WIDTH: 2,
        LINE_COLOR:'#888888',
    },
    LEGEND: {
        FILL_COLOR: '#cccccc'
    }
}

export class Bounds {
    readonly x: number
    readonly y: number
    readonly w: number
    readonly h: number
    readonly x2:number
    readonly y2:number
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
    inset_sides(top,right,bottom,left) {
        return new Bounds(this.x+left,this.y+top, this.w-left-right, this.h-top-bottom)
    }
}

export function clear(ctx, canvas) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export function draw_centered_text(ctx, font_size, text, x, y) {
    ctx.fillStyle = STYLE.FONT_COLOR
    ctx.font = `${font_size}px sans-serif`
    let measure1 = ctx.measureText(text)
    let xoff = measure1.width/2
    ctx.fillText(text,x - xoff, y)
}
export function draw_right_aligned_text(c, label, x, y) {
    c.fillStyle = STYLE.FONT_COLOR
    c.font = STYLE.FONT
    let measure = c.measureText(label)
    let lh = STYLE.FONT_SIZE
    c.fillText(label, x - measure.width, y+lh/2)
}



export const max = (data) => data.reduce((a,b)=> unpack(a)>unpack(b)?a:b)
export const min = (data) => data.reduce((a,b)=> unpack(a)<unpack(b)?a:b)
