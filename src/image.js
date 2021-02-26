import {FilamentFunctionWithScope, REQUIRED} from './parser.js'
import {list, scalar} from './ast.js'
import {default as PImage} from 'pureimage'
import {default as fetch} from "node-fetch"


export const make_image = new FilamentFunctionWithScope('makeimage',
    {
        width: scalar(64),
        height: scalar(64)
    },
    function (scope, width, height) {
        return PImage.make(width.value, height.value)
    }
)

function get_pixel_as_array(image_data, x, y) {
    let n = (image_data.width*y + x)*4
    let px = [
        image_data.data[n+0]/255,
        image_data.data[n+1]/255,
        image_data.data[n+2]/255
    ]
    return px
}

function set_pixel_as_array(image_data, x, y, vals) {
    let n = (image_data.width*y + x)*4
    image_data.data[n+0] = vals[0]*255
    image_data.data[n+1] = vals[1]*255
    image_data.data[n+2] = vals[2]*255
    image_data.data[n+3] = 255
}

export const map_image = new FilamentFunctionWithScope('mapimage',
    {
        "image": REQUIRED,
        "with": REQUIRED
    },
    async function (scope, image, _with) {
        let ctx = image.getContext('2d')
        let image_data = ctx.getImageData(0,0,image.width,image.height)
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                if (_with.type === 'lambda') {
                    let sx = scalar(x)
                    let sy = scalar(y)
                    let px = get_pixel_as_array(image_data,x,y)
                    let color = list([scalar(px[0]), scalar(px[1]), scalar(px[2])])
                    let ret = await _with.apply_function(scope, _with, [sx, sy, color])
                    let vals = ret.value.map(s => s.value)
                    set_pixel_as_array(image_data,x,y,vals)
                } else {
                    // return cb.fun.apply(cb, [el])
                }
            }
        }
        ctx.putImageData(image_data,0,0)
        return image
    }
)

export const load_image = new FilamentFunctionWithScope('loadimage',
    {
        "src": REQUIRED
    },
    async function (scope, src) {
        let url = src.value
        if(process.browser) {
            return new Promise((res,rej)=>{
                let img = new Image()
                img.crossOrigin = "Anonymous";
                img.onload = () => res(img)
                img.onerror = () => rej(img)
                img.src = url
            })
        } else {
            return await fetch(url)
                .then(r => {
                    // console.log("type", r.type, 'status', r.statusText, r.status, r.ok)
                    // console.log(Array.from(r.headers.entries()))
                    // console.log("headers",r.headers,r.headers.get('Content-Type'))
                    if (r.headers.get('Content-Type') === 'image/jpeg') return PImage.decodeJPEGFromStream(r.body)
                    if (r.headers.get('Content-Type') === 'image/png') return PImage.decodePNGFromStream(r.body)
                })
        }
    }
)
