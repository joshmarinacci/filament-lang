import {default as PImage} from 'pureimage'
import {mkdir as real_mkdir, promises as fs} from 'fs'

export async function init_pureimage() {
    return new Promise((res,rej)=>{
        const fnt = PImage.registerFont('node_modules/pureimage/tests/unit/fixtures/fonts/SourceSansPro-Regular.ttf','Source Sans Pro');
        try {
            fnt.load(() => {
                res()
            })
        } catch (e) {
            rej(e)
        }
    })
}

export async function mkdir(dir) {
    return new Promise((res,rej)=>{
        real_mkdir(dir,(err)=>{
            if(!err)  console.log("made dir",dir)
            res()
        })
    })
}

export async function copy(src, dst) {
    console.log("copying",src,'to',dst)
    let src_ref = await fs.readFile(src)
    await fs.writeFile(dst,src_ref.toString())
}



export async function for_each(files, process_file) {
    for (const file of files) {
        await process_file(file)
    }
}


export function l(...args) {
    console.log(...args)
}
