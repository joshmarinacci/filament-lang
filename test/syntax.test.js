import {all, b, l, s, setup} from "./common.js"
import {boolean, list, scalar, string} from '../src/ast.js'
import {make_standard_scope} from '../src/lang.js'
import {FilamentFunction} from '../src/parser.js'
import {eval_code} from '../src/index.js'
import assert from 'assert'

await setup()

describe('error handling',() => {
    let scope = make_standard_scope()
    it('missing symbol', async () => {
        let code = `random(foo)`
        try {
            let ret = await eval_code(code, scope)
            assert.fail("this code should have thrown an error")
        } catch (e) {
            console.log("error is",e.name, e.message, e.source)
            assert.strictEqual(e.source.startIdx,7)
        }
    })
})

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
            ['{def foo(x) { x } foo(42)}', s42],
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

    // if statement returns the value of the evaluated block
    it('if statement', async() => {
        await all([
            [`if(4>2) then {4}`,scalar(4)],
            [`if(4>2) then {4} else {2}`,scalar(4)],
            [`if(4<2) then {4} else {2}`,scalar(2)],
            [`if 4>2 then {4}`,scalar(4)],
            [`if 4<2 then {4} else {2}`,scalar(2)],
            [`4 + if(4<2) then {4} else {2}`,scalar(6)],
            [`if 4>2 then 4`,scalar(4)],
            [`if 4<2 then 4 else 2`,scalar(2)],
        ])
    })

    it('lambda expressions', async () => {
        await all([
            [`{
            foo << (x:?)->{x*2}
            foo(5)
            }`,s(10)],
            [`{
            foo << ()->{2}
            map([1,2],with:foo)
            }`,l(s(2),s(2))],
            [`map([1,2],with:()->{2})`,l(s(2),s(2))],
            [`map([1,2],with:(x:?)->{x*2})`,l(s(2),s(4))],
            [`map([1,2],with:(x:?)->x*2)`,l(s(2),s(4))],
            [`{
            foo << (x)->{x*2}
            foo(5)
            }`,s(10)],
            [`{
            foo << x->x*2
            foo(5)
            }`,s(10)],
            [`map([1,2],with:(x)->x*2)`,l(s(2),s(4))],
            [`map([1,2],with:x->x*2)`,l(s(2),s(4))],
            [`range(3) >> map(with:x->x*2)`,l(s(0),s(2),s(4))],
        ])
    })
    it('list indexing', async () => {
        // console.log("arr",[8][0,2])
        await all([
            [`range(10)[2]`,s(2)],
            [`[42,43,44] [0]`,s(42)],
            [`map(range(10),with:x->x*2)[2]`,s(4)],
            [`{
             c << [1,2,3]
             [c[0]*5,c[1]*2,c[2]*1]
             }`,l(s(5),s(4),s(3))]
            // [`[[42,43,44],[42,43,44]][0,1]`,l(s(42),s(43))],
        ])
    })
    /*
     match 1 {
        1: 1
        2: 2
        ?: 5
     }
     x << 5
     match x {
        (x when x<5)  -> 5
        (x when x<10) -> 10
        else          -> 20
     }

     range(10) >> map(with:(x)->{x*2})
     range(10) >> map(with:(x)->x*2)
     range(10) >> map(with:x->x*2)


      match (x,y) {
        (true,true) -> {print(true)}
        (false, x when x > 6) ->
        (false,x) -> {print(x)}
        (false,x) -> print(x)
        (?) -> {}
      }


guarded lambda
    (guarded arg)
      match exp {
        guarded_lambda
        (x:x=2) -> foo
        (x:x>5) -> foo
        (x:x=5) -> foo
      }

the only difference between regular lambdas and guarded lambdas is that the
conditonal value of the argument is tested for true or false to decide which one to use
inside of a match. Also the argument can be a constant instead of an identifier, which is
shorthand for (x:x=5) same as (5)



match(test:x,cases:[
   case(when:5, then:(x)->x*2),
   case(when:x->x=5, then:x -> x*2)
   case(5, x->x*2)
   case(6, x->x+3)
])

match(x,[
    case(4, ()->print("forty")),
    case(2, ()->print("two")),
    case(x->x<42, x->x*2),
    default: 88,
])

case is a tuple of a constant or function and a second constant or function
if the first part is true, then it returns the second part
if the first part is false, then it goes onto the next case until hitting the default

match(x,
    case: 0, ()->88,
    case: 1, ()->99,
    case: (x)->x<55, ()->100,
)

*/
})
