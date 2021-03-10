/**
 * @name (add)
 * @module (math)
 * @params {
 *     a:required,
 *     b:required
 * }
 * @summary (Adds two values. Can be two numbers, with or without units. Can also be two lists. Or a number
 * and a list. Follows the rules of all binary operations. )
 * @example // use with the operator form
 * 4 + 2 = 6
 * @end
 * @example // use as a function
 *    add(4,2)
 * @end
 * @example // add number to an array
 * 4 + [2,2]  = [6,6]
 * @end
 */
const add = (a,b) => a+b

