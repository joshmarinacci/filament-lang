import path from 'path'
import {eval_filament} from './code_formatter.js'



describe('code format',() => {

    it('should parse code', async () => {
        let doc = [
            {
                type:'CODE',
                language:'filament',
                content:`
                foo << () -> {
                  4*5*6
                }
                `
            }
        ]
        await eval_filament(doc)
    })

    it("should do a block", async() => {
        let doc = [
            {
                type:'CODE',
                language:'filament',
                content:`
spiral << theta -> 0.25*theta
plot(polar:spiral, min:0, max:pi*32)
                `
            }
        ]
        await eval_filament(doc)
    })

})

