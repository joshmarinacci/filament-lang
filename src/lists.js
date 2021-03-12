import {FilamentFunction, FilamentFunctionWithScope, REQUIRED} from './parser.js'
import {is_list, list, pack, scalar, unpack} from './ast.js'
import {apply_fun, resolve_in_order} from './util.js'
import {is_date} from './math.js'
import {getYear} from 'date-fns'

/**
 * @name (range)
 * @module (list)
 * @params {
 *     max:required,
 *     min:0,
 *     step:1,
 * }
 * @summary ( creates a new list of numbers, from min to max, counting by step. If min is left out it defaults to 0. If step is
 * left out it defaults to 1. *note* the count will always go up to max, but not include it. Thus `range 5` returns `[0,1,2,3,4]`
 * )

 * @example
 * // List from 0 to 13:
 * range(5) = [0,1,2,3,4]
 * @end
 *
 * @example
 * // same with max:
 * range(max:5) = [0,1,2,3,4]
 * @end
 *
 * @example
 * // 103 to 108
 * range(min:103, max:108) = [103,104,105,106,107]
 * @end
 *
 * @example
 * // multiples of 5 up to 100:
 * range(100, step:5) = [0,4,9]
 * @end
 */
export const range = new FilamentFunction('range',
    {
        max:REQUIRED,
        min:scalar(0),
        step:scalar(1)
    },
    function(max,min,step) {
        // this.log("making a range",max,min,step)
        function gen_range(min,max,step) {
            let list = []
            for(let i=min; i<max; i+=step) {
                list.push(i)
            }
            return list
        }
        return list(gen_range(min.value,max.value,step.value).map(v => scalar(v)))
    })


/**
 * @name (length)
 * @module (list)
 * @params {
 * data:required
 * }
 *
 * @summary ( returns length of list )
 *
 * @example
 * length ([1,8,2]) = 2
 * @end
 */
export const length = new FilamentFunction('length', {
        data:REQUIRED,
    },
    function(data) {
        // this.log(data)
        return scalar(data._get_length())
    }
)

// * __take__: take the first N elements from a list to make a new list `take([1,2,3], 2) = [1,2]`
/**
 * @name(take)
 * @module(list)
 * @params {
 *     data:REQUIRED,
 *     count:REQUIRED
 * }
 * @summary(returns part of the list. positive count takes from the beginning. negative count takes from the end)
 *
 * @example
 * data << range(0,10)
 * take(data, 2) = [0, 1]
 * @end
 *
 * @example
 * data << range(0,10)
 * take(data, -2) = [8,9]
 * @end
 */
export const take = new FilamentFunction('take',
    {
        data:REQUIRED,
        count:REQUIRED,
    },function(data,count) {
        // this.log("taking from data",data,'with count',count)
        if(count < 0) {
            return data._slice(data._get_length()+unpack(count),data._get_length())
        } else {
            return data._slice(0, unpack(count))
        }
    })

/**
 * @name(drop)
 * @module(list)
 * @params {
 *     data:REQUIRED,
 *     count:REQUIRED,
 * }
 * @summary(removes part of the list and returns the rest. positive count drops from the start. negative count drops from the end.)
 * @example
 * data << range(0,10)
 * drop(data,2) = [2,3,4,5,6,7,8,9]
 * @end
 * @example
 * data << range(0,10)
 * drop(data,-2) = [0,1,2,3,4,5,6,7]
 * @end
 */
export const drop =  new FilamentFunction(  "drop",
    {
        data:REQUIRED,
        count:REQUIRED,
    },
    function (data,count) {
        // this.log('params',data,count)
        if(count < 0) {
            return data._slice(0,data.value.length+unpack(count))
        } else {
            return data._slice(unpack(count))
        }
    })


// * __join__: concatentate two lists, returning a new list. is this needed?
/**
 * @name(join)
 * @module(list)
 * @params {
 *     data:REQUIRED,
 *     more:REQUIRED
 * }
 * @summary(Joins two lists. returns the new combined list.)
 * @example
 * join([1,2],   [99,100]) = [1,2,99,100]
 * @end
 */
export const join = new FilamentFunction('join',{
        data:REQUIRED,
        more:REQUIRED,
    },
    function(data,more) {
        if(is_list(data) && is_list(more))    return list(data.value.concat(unpack(more.value)))
        if((!is_list(data)) && is_list(more)) return list([data].concat(unpack(more.value)))
        if(is_list(data) && !is_list(more))   return list(data.value.concat([more]))
        return list([data].concat([more]))
    }
)


// * __map__:  convert every element in a list using a lambda function: `(list, lam)`
/**
 * @name(map)
 * @module(list)
 * @params {
 *     data:REQUIRED,
 *     with:REQUIRED
 * }
 * @summary(applies the function 'with' to every element of the list, creating a new list)
 * @example
 * data << range(3)
 * map(data, with: x => x*2)
 * // returns [2,4,6],
 * @end
 *
 * @example
 * double << (x) => {
 *   x * 2
 * }
 * range(10) >> map(with:double)
 * // returns [1,2,3,5,7]
 * @end
 */
export const map = new FilamentFunctionWithScope('map',{
    data:REQUIRED,
    with:REQUIRED,
},function(scope, data,cb) {
    let proms = data._map((el,i)=> async () => {
        return await apply_fun(scope, cb, [el])
    })
    return resolve_in_order(proms).then(vals => list(vals))
})

/**
 * @name(select)
 * @module(list)
 * @params {
 *     data:REQUIRED,
 *     where:REQUIRED
 * }
 * @summary(return a subset of a list based on if the  'where' function returns true or false)
 *
 * @example
 * //is_prime is a built in function that returns true or false if the number is prime
 * select(range(10), where:is_prime)
 * // returns [1,2,3,5,7]
 * @end
 *
 */
export const select = new FilamentFunctionWithScope('select',{
    data:REQUIRED,
    where:REQUIRED,
},async function(scope,data,where) {
    let vals = await Promise.all(data._map(async (el)=>{
        if(where.type === 'lambda') {
            return await where.apply_function(scope,where,[el])
        } else {
            return await where.fun.apply(where, [el])
        }
    }))
    return list(data._filter((v,i)=>unpack(vals[i])))
})

/**
 * @name(sort)
 * @module(list)
 * @params{
 *     data:REQUIRED,
 *     order:"ascending"
 *     by:null
 * }
 * @summary(returns a sorted copy of the list. set the order to 'ascending' or 'descending'.
 *  sort by part of the value using the `by` parameter.
 * )
 * @example
 * sort([42,2,4])
 * //returns [2,4,42]
 * @end
 */

export const sort = new FilamentFunction( "sort",
    {
        data:REQUIRED,
        order:"ascending",
    },
    function(data,order) {
        // this.log("params",data,order)
        let new_data = data._slice()._sort((a,b)=>{
            let av = unpack(a)
            let bv = unpack(b)
            if(av < bv) return -1
            if(av > bv) return 1
            return 0
        })
        if(unpack(order) === 'descending') {
            return new_data.reverse()
        } else {
            return new_data
        }
    }
)

/**
 * @name(reverse)
 * @module(list)
 * @params{
 *     data:REQUIRED
 * }
 * @summary(returns a copy of the list with a reverse order)
 * @example
 * reverse([42,2,4])
 * //returns [4,2,42]
 * @end
 */
export const reverse = new FilamentFunction('reverse',{
    data:REQUIRED,
},function(data) {
    // this.log("params",data)
    return list(data.value.reverse())
})

/**
 * @name(sum)
 * @module(list)
 * @params {
 *     data:REQUIRED
 * }
 * @summary(adds a list of numbers together)
 * @example
 * sum([42,2,4])
 * // returns 48
 * @end
 */
export const sum = new FilamentFunction("sum",
    {
        data:REQUIRED,
    },
    async function(data) {
        return await scalar(data._reduce((a,b)=>unpack(a)+unpack(b)))
    }
)

/**
 * @name(max)
 * @module(list)
 * @params {
 *     data:REQUIRED
 * }
 * @summary(returns the biggest element in the list)
 * @example
 * max([4,2,42])
 * //returns 42
 * @end
 */
export const max = new FilamentFunction("max",
    {
        data:REQUIRED,
    },
    function (data) {
        return data._reduce((a,b)=> a>b?a:b)
    }
)

/**
 * @name(min)
 * @module(list)
 * @params {
 *     data:REQUIRED
 * }
 * @summary(returns the smallest element in the list)
 * @example
 * min([4,2,42])
 * //returns 2
 * @end
 */
export const min = new FilamentFunction("min",
    {
        data:REQUIRED,
    },
    function (data) {
        return data._reduce((a,b)=> a<b?a:b)
    }
)

export const get_field = new FilamentFunction("get_field",{
    data:REQUIRED,
    field:REQUIRED
},(data,field)=>{
    if(is_date(data)) {
        let f = unpack(field)
        if(f === 'year') {
            return scalar(getYear(unpack(data).value))
        }
    }
    return pack(data[unpack(field)])
})
