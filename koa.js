const Koa = require('koa')
const KoaStatic = require('koa-static')
const path = require('path')
const KoaRouter = require("koa-router");
const { PassThrough } = require('stream');

const SSE_DEMO_PORT = Number(process.env.SSE_DEMO_PORT) || 8086;

const app = new Koa()
const router = new KoaRouter();


router.get("/open-ai/sendMsg", async (ctx) => {
    ctx.type = "text/event-stream";
    ctx.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    ctx.body = new PassThrough();
    
    const writeMessage = (data) => {
        ctx.body.write(`data: ${data}\n\n`);
    };
    
    let i = 1;
    const sendData = () => {
        if(i === 1){
            writeMessage(ctx.query.message);
        }
        if (i > 5) {
            writeMessage("[DONE]");
            clearInterval(timer);
        } else {
            writeMessage(i);
        }
        i++;
    };
    const timer = setInterval(sendData, 500);
});
app.use(new KoaStatic(path.resolve(__dirname, './static')))
app.use(router.routes()).use(router.allowedMethods());
app.listen(SSE_DEMO_PORT, () => {
    console.log(`服务开启于 ${ SSE_DEMO_PORT } 端口，请打开页面：`)
    console.log(`http://127.0.0.1:${ SSE_DEMO_PORT }/index.html`)
})