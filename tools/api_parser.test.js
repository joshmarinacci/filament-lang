import {parse_api_docs} from './api_parser.js'
import {all, s} from '../test/common.js'
import {boolean, list} from '../src/ast.js'


describe('lists',() => {
    it('should parse block', async () => {
        let txt = `
/**
 * @name {chart}
 * @module {charts}
 * @params {
 *     data: required,
 *     x: null,
 *     xlabel, null,
 *     y: null,
 *     ylabel:null,
 *     type:"bar",
 *     size:null,
 *     name:null,
 * }
 * @return CanvasResult
 * @summary { Draws a chart. Type can be either 'bar' or 'scatter'.
 *
 * }
 */
        `
        await parse_api_docs(txt)
    })

    it('should parse multiple blocks', async () => {
        let txt = `
        some stuff
/**
 * @name {fun1}
*/
 some stuff after
 
/**
 * @name {fun2}
*/
  
        `
        await parse_api_docs(txt)
    })
})
