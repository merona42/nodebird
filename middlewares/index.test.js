//test 나  spec이 들어가있으면 test파일로 인식함

const { isLoggedIn, isNotLoggedIn } = require("./");

describe('isLoggedIn',()=>{
   
    const res={
        status: jest.fn(()=>res),
        send: jest.fn(),
    }
    const next=jest.fn();

    test('로그인되어있으면 next를 호출해야함', ()=>{
        const req={
            isAuthenticated: jest.fn(()=>true),
        };
        isLoggedIn(req,res,next);

        expect(next).toBeCalledTimes(1);

    });

    test('로그인되어있지않으면 403코드로 send해야함',()=>{
        const req={
            isAuthenticated: jest.fn(()=>false),
        };
        isLoggedIn(req,res,next);
        
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
});



describe('isNotLoggedIn',()=>{

    const res = {
        redirect: jest.fn(),
    }
    const next = jest.fn();
    test('로그인안되어있으면 next호출',()=>{
        const req={
            isAuthenticated: jest.fn(()=>false),
        }
        isNotLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1);
    })
    
    test('로그인 되어있으면 에러 리다이렉트',()=>{
        const req={
            isAuthenticated: jest.fn(()=>true),
        }
        const message = encodeURIComponent('로그인한 상태입니다.');

        isNotLoggedIn(req,res,next);
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    })
    
})