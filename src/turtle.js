
/*


- Init offscreen canvas object.
- Track turtle position and heading
- Implement forward and left and right
- Implement pen up and down
- Draw offscreen to real canvas with return value

 */


import {FilamentFunction, FilamentFunctionWithScope, REQUIRED} from './parser.js'
import {CanvasResult, scalar} from './ast.js'

class TurtleState {
    constructor() {
        this.x = 0
        this.y = 0
        this.heading = 0
        this.commands = []
    }
    push_command(cmd) {
        this.commands.push(cmd)
    }
}

export const turtle_start = new FilamentFunctionWithScope('turtlestart',
    {
        x:scalar(0),
        y:scalar(0),
        a:scalar(0)
    },
    function (scope,x,y,a) {
        this.log("starting with",x,y,a)
        scope.set_var('!turtle_state', new TurtleState())
    }
)

function toRad(a) {
    return a/180*Math.PI
}

export const turtle_done = new FilamentFunctionWithScope('turtledone',
    {},
    function (scope) {
        // console.log("done with the turtle. scope is",scope)
        let state = scope.lookup('!turtle_state')
        return new CanvasResult((canvas) => {
            // console.log('drawing the turtle with state',state.commands)
            let ctx = canvas.getContext('2d')
            ctx.save()
            ctx.translate(canvas.width/2,canvas.height/2)
            ctx.fillStyle = 'white'
            ctx.fillRect(0,0,canvas.width,canvas.height)
            let x = 0
            let y = 0
            let a = 0
            ctx.strokeStyle = 'black'
            ctx.beginPath()
            ctx.moveTo(x,y)
            // console.log('moved to',x,y)
            state.commands.forEach(cmd => {
                // console.log(cmd)
                if(cmd[0] === 'f') {
                    let ra = toRad(a)
                    let dx = Math.cos(ra)
                    let dy = Math.sin(ra)
                    // console.log(dx,dy)
                    x+= dx*cmd[1]
                    y+= dy*cmd[1]
                    ctx.lineTo(x,y)
                }
                if(cmd[0] === 'r') {
                    a += cmd[1]
                }
                if(cmd[0] === 'l') {
                    a -= cmd[1]
                }
            })
            ctx.stroke()

        })
    }
)
export const turtle_pendown = new FilamentFunctionWithScope('turtlependown',
    {},
    function (a,b) {
        // this.log("pen down")
    }
)
export const turtle_penup = new FilamentFunctionWithScope('turtlepenup',
    {},
    function (a,b) {
        // this.log("pen up")
    }
)
export const turtle_forward = new FilamentFunctionWithScope('turtleforward',
    {
        distance:REQUIRED,
    },
    function (scope,n) {
        // this.log("forward",n)
        let state = scope.lookup('!turtle_state')
        state.push_command(['f',n.value])
    }
)
export const turtle_right = new FilamentFunctionWithScope('turtleright',
    {
        angle:REQUIRED
    },
    function (scope,a) {
        let state = scope.lookup('!turtle_state')
        state.push_command(['r',a.value])
    }
)

export const turtle_left = new FilamentFunctionWithScope('turtleleft',
    {
        angle:REQUIRED
    },
    function (scope,a) {
        let state = scope.lookup('!turtle_state')
        state.push_command(['l',a.value])
    }
)
