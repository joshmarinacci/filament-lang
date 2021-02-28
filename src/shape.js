import {FilamentFunction, FilamentFunctionWithScope, REQUIRED} from './parser.js'
import {CanvasResult, FObject, list, scalar, string, unpack} from './ast.js'

export const rect = new FilamentFunctionWithScope('rect',
    {
        x:scalar(0),
        y:scalar(0),
        width:scalar(10),
        height:scalar(10),
        fill:string("red"),
    },
    function (scope, x,y,width,height,fill) {
        return new FObject({
            type:'rect',
            x,y,width,height,fill
        })
    }
)

export const circle = new FilamentFunctionWithScope('circle',
    {
        x:scalar(0),
        y:scalar(0),
        radius:scalar(10),
        fill:string("black"),
    },
    function (scope, x,y,radius,fill) {
        return new FObject({
            type:'circle',
            x,y,radius,fill
        })
    }
)

export const row = new FilamentFunctionWithScope('row',{
    data:REQUIRED,
    gap:scalar(1,'cm')
}, function(scope,data,gap){
    console.log("laying out",data)
    let x = 0
    return list(data._map(r => {
        this.log("rect",r)
        let r2 = new FObject({
            type:r.value.type,
            x:scalar(x),
            y:r.value.y,
            width:r.value.width,
            height:r.value.height,
            fill:r.value.fill,
        })
        x += to_px(r.value.width)
        x += to_px(gap)
        return r2
    }))
})


function fill_bg(canvas, ctx, white) {
    ctx.fillStyle = white
    ctx.fillRect(0,0,canvas.width,canvas.height)
}

export const draw = new FilamentFunctionWithScope('draw',
    {
        data:REQUIRED,
    },
    function (scope, data) {
        return new CanvasResult((canvas) => {
            let ctx = canvas.getContext('2d')
            ctx.save()
            fill_bg(canvas,ctx,'white')
            ctx.scale(10,10)
            this.log("drawing data",data)
            if(data.type) {
                draw_shape(ctx,data)
            }
            ctx.restore()
        })
    }
)

const IN_PX = 72
const CM_PX = IN_PX/2.54
function to_px(value) {
    // console.log("converting to pixels",value)
    if(value.unit) {
        if(value.unit === 'centimeter') {
            return value.value * CM_PX
        }
        if(value.unit === 'inch') {
            return value.value * IN_PX
        }
    }
    return value.value
}

function to_color(fill) {
    console.log("converting color",fill)
    if(fill.type === 'string') return fill.value
    if(fill.type === 'list') {
        if(fill._get_length() === 3) {
            let vals = fill.value.map(s => s.value*255).join(",")
            return `rgb(${vals})`
        }
    }
    return 'blue'
}

function draw_shape(ctx, data) {
    // console.log('drawing',data)
    if(data.type === 'object') {
        draw_shape(ctx,data.value)
        return
    }
    if(data.type === 'list') {
        data._forEach(el => {
            draw_shape(ctx,el.value)
        })
        return
    }

    if(data.type === 'rect') {
        // console.log("drawings",data)
        ctx.fillStyle = to_color(data.fill)
        let x = to_px(data.x)
        let y = to_px(data.y)
        let w = to_px(data.width)
        let h = to_px(data.height)
        console.log("using",x,y,w,h,ctx.fillStyle)
        ctx.fillRect(x,y,w,h)
        // console.log("filled")
        return
    }
    if(data.type === 'circle')  {
        ctx.fillStyle = to_color(data.fill)
        let x = to_px(data.x)
        let y = to_px(data.y)
        let radius = to_px(data.radius)
        ctx.beginPath()
        ctx.arc(x,y,radius, 0, Math.PI*2)
        ctx.fill()
        return
    }
    console.log("Unknown type",data.type)
}
