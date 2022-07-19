import {match_args_to_params, strip_under} from "./util";

export const REQUIRED = Symbol('REQUIRED')
export class FilamentFunction {
    private type: string;
    private name: any;
    private params: any;
    fun: any;
    private summary: string;
    constructor(name:string, params, fun, opts?) {
        this.type = 'native-function'
        this.name = strip_under(name.toLowerCase())
        this.params = params
        this.fun = fun
        this.summary = ""
        if(opts) {
            if(opts.summary) this.summary = opts.summary
        }
    }

    log() {
        let args = Array.prototype.slice.call(arguments)
        console.log('###', this.name.toUpperCase(), ...args)
    }

    apply_function(args) {
        let params = match_args_to_params(args,this.params,this.name)
        return this.apply_with_parameters(params)
    }

    async apply_with_parameters(params) {
        let ps = []
        for (let p of params) {
            if (p && p.type === 'callsite') {
                ps.push(await p.apply())
            } else {
                ps.push(await p)
            }
        }
        return await this.fun.apply(this, ps)
    }
    do_apply(scope,params) {
        return this.fun.apply(this,params)
    }
}

export class FilamentFunctionWithScope extends FilamentFunction {
    do_apply(scope,params) {
        return this.fun.apply(this,[scope].concat(params.slice()))
    }
}
