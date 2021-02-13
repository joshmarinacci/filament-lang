import {all, b, l, s, setup} from "./common.js"
import {list, scalar, string} from '../src/ast.js'
import {make_standard_scope} from '../src/lang.js'
import {FilamentFunction} from '../src/parser.js'

await setup()


describe('syntax',() => {
    let scope = make_standard_scope()
    const func =  new FilamentFunction(  "func", { data:null, },
        (data) => data)
    scope.install(func)
    const funk =  new FilamentFunction(  "funk", { data:null, },
        (data) => data)
    scope.install(funk)
    let s42 = s(42)
    let l42 = list([s(42)])

    it('case identifier tests', async () => {
        await all([
            ['pi',s(Math.PI)],
            ['Pi',s(Math.PI)],
            ['pI',s(Math.PI)],
            ['p_i',s(Math.PI)],
            ['P_I',s(Math.PI)],
            ['PI_',s(Math.PI)],
            // ['_PI_',s(Math.PI)],
            // ['_PI',s(Math.PI)],
        ])
    })

    // test("unicode", async ()=>{
    //     await all([
    //         ['foo',ident("foo"),'foo',42],
    //         ['ø',ident('ø'),'theta',42],
    //         ['π','pi'],
    //         ['','alpha'],
    //         ['','sigma'],
    //         ['','<<'],
    //         ['','>>'],
    //         ['','<>']
    //     ])
    // })
    //
    // test('conditionals', async () => {
    //     await all([
    //         [`if true { 42 }`,'if(true, {42},{})'],
    //         [`if _false { 42 }`,'if(false,{42},{})'],
    //         [`if true { 42 } else { 24 }`,'if(true,{42},{24})'],
    //         [`value << if true {42} else {24}`,'if(true,{42},{24}) >> value'],
    //         [`if true {42} else {24} >> value`,'if(true,{42},{24}) >> value'],
    //         [`if true {42} >> value func()`,'if(true,{42}) >> value\nfunc()'],
    //         [`if true {func() 42} func()`,'if(true,{func()\n42},{})\nfunc()'],
    //     ])
    // })

    it('function definitions', async () => {
        let s42 = s(42)
        let s24 = s(24)
        await all([
            ['{def foo() { 42 } foo()}', s42],
            ['{def foo(x:24) { x } foo(42)}', s42],
            ['{def foo(x:24) { x } foo()}', s24],
            ['{def foo(data:?) { take(data,1) } foo([42,24,24])}', list([s42])],
            ['{def double(x:?) { x*2} map([1,2,3],with:double)}', list([s(2), s(4), s(6)])],
            ['{def first_letter(v:?) { take(v,1)} map(["foo","bar"],with:first_letter)}', list([string("f"), string("b")])],
            //TODO: ['range(100, step:10) as jesse',list([string('ten'),string('4D'),'ten twenty thirty 4D fifty 6D 7D AD 9D'])]
        ])
    })

    it('comments', async () => {
        await all([
            ['42 //comment', s(42)],
            ['42 + /* stuff */ 58', s(42+58)],
        ])
    })

    it('variables and identifiers', async () => {
        await all([
            [`aprime<<13`, s(13)],
            [`a_prime << 13`,s(13)],
            [`APRIME << 13`,s(13)],
            [`13 >> aprime`,s(13)],
            ['42 >> answer', s(42)],
            ['answer << 42',s(42)],
            ['answer24 << 42',s(42)],
            ['answ24er << 42',s(42)],
            // ['42 >> _a_n_sw24er',s(42)],
        ])
    })

    it('variables as arguments', async () => {
        await all([
            [`{ 42 }`, scalar(42)],
            [`{ 42 24 }`, scalar(24)],
            [`{ 42 >> foo }`, scalar(42)],
            [`{ 42 >> foo 43 }`, scalar(43)],
            [`{ 42 >> foo 1+foo}`, scalar(43)],
            [`{ 42 >> foo add(1,foo)}`, scalar(43)],
            [`{ data << [1,2]  length(data)}`, scalar(2)],
        ])
    })

    it('function calls', async () => {

        await all([
            //'func' function returns data or first arg
            ['func()', null],
            ['func(42)', s42],
            ['func([42])', l42],
            ['func(data:42)', s42],
            ['func(data:[42],count:42)',l42],
            ['func(count:42, [42])',l42],
            ['func(func(42))',s42],
            ['func(42,func(42))', s42],
            ['func(count:func,func(),func)',null]
        ],scope)
    })

    it("pipelines", async () => {
        await all([
            ['func() >> funk()',null],
            ['func([42]) >> funk()',l42],
            ['func(42) >> func(count:42)',s(42)],
            ['func(42) >> func(count:42) >> func(42)', s(42)],
            ['func(arg: _42, [4_2 ]) >> func(count:42) >> funk(42) >> answer',l42]
        ],scope)
    })

    it("blocks", async () => {
        await all([
            [`{4  2}`,s(2)],
            [`{4*2  2+4}`, s(6)],
            [`add(4,2)`,  s(6)],
            ['{ add(4,2) subtract(4,2) }', s(2)],
            [`{ func() << func(2)
            func(4_0) }`,  s(40)],
        ],scope)
    })
})
