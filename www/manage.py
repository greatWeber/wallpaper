#-*-coding: UTF-8-*-
#manage.py

import logging
logging.basicConfig(level=logging.INFO)
import asyncio, os, json, time
from datetime import datetime

from aiohttp import web

import orm

from jinja2 import Environment, FileSystemLoader

from coroweb import add_routes, add_static, add_upload, add_emoticon

import aiohttp_cors

def init_jinja2(app,**kw):
    logging.info('init jiaja2...')
    options = dict(
        autoescape = kw.get('autoescape',True),
        block_start_string = kw.get('block_start_string','{%'),
        block_end_string = kw.get('block_end_string','%}'),
        variable_start_string = kw.get('variable_start_string','{{'),
        variable_end_string = kw.get('variable_end_string','}}'),
        auto_reload = kw.get('auto_reload',True)
    )
    path = kw.get('path', None)
    if path is None:
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)),'templates')
    logging.info('set jinja2 path : %s' % path)
    env = Environment(loader=FileSystemLoader(path),**options)
    filters = kw.get('filters',None)
    if filters is not None:
        for name, f in filters.items():
            env.filters[name] = f
    app['__templating__'] = env

@asyncio.coroutine
def logger_factory(app, handler):
    @asyncio.coroutine
    def logger(request):

        return (yield from handler(request))
    return logger

@asyncio.coroutine
def data_factory(app, handler):
    @asyncio.coroutine
    def parse_data(request):
        if request.method == 'POST':
            if request.content_type.startswitch('application/json'):
                request.__data__ = yield from request.json()
                logging.info('request json: %s' % str(request.__data__))
            elif request.content_type.startswitch('application/x-www-form-urlencoded'):
                request.__data__ = yield from request.post()
        return (yield from handler(request))
    return parse_data


@asyncio.coroutine
def response_factory(app, handler):
    @asyncio.coroutine
    def response(request):
        r = yield from handler(request)

        # logging.info(web.Response.headers.get('Access-Control-Allow-Origin'))
        # web.Response.headers["Access-Control-Allow-Origin"]='*'s
        if isinstance(r, web.StreamResponse):
            return r
        if isinstance(r, bytes):
            resp = web.Response(body=r)
            resp.content_type = 'application/octet-stream'
            # resp.headers["Access-Control-Allow-Origin"]='*'
            return resp
        if isinstance(r, str):
            if r.startswitch('redirect:'):
                return web.HTTPFound(r[9:])
            resp = web.Response(body=r.encode('utf-8'))
            resp.content_type = 'text/html;charset=utf-8'
            # resp.headers["Access-Control-Allow-Origin"]='*'
            return resp
        if isinstance(r, dict):
            template = r.get('__template__')
            logging.info('template: %s' % template)
            if template is None:
                resp = web.Response(body=json.dumps(r, ensure_ascii=False, default=lambda o:o.__dict__).encode('utf-8'))
                resp.content_type = 'text/html;charset=utf-8'
                # resp.headers["Access-Control-Allow-Origin"]='*'
                return resp
            else:
                resp = web.Response(body=app['__templating__'].get_template(template).render(**r).encode('utf-8'))
                resp.content_type = 'text/html;charset=utf-8'
                # resp.headers["Access-Control-Allow-Origin"]='*'
                return resp
        if isinstance(r, int) and r >= 100 and r<=600:
            return web.Response(r)
        if isinstance(r, tuple) and len(r) == 2:
            t, m = r
            if isinstance(t, int) and r >= 100 and r<=600:
                return web.Response(t, str(m))

        #default:
        resp = web.Response(body=str(r).encode('utf-8'))
        resp.content_type = 'text/plain;charset=utf-8'
        # resp.headers["Access-Control-Allow-Origin"]='*'
        return resp
    return response


def datetime_filter(t):
    delta = int(time.time()-t)
    if delta < 60:
        return u'一分钟前'
    if delta< 3600:
        #// 除法不管操作数为何种数值类型，总是会舍去小数部分，返回数字序列中比真正的商小的最接近的数字。
        return u'%s分钟前' % (delta//60) 
    if delta < 86400:
        return u'%s小时前' % (delta//3600)
    if delta < 604800:
        return u'%s天前' % (delta//86400)
    dt = datetime.fromtimestamp(t)
    return u'%s年%s月%s日' % (dt.year, dt.month, dt.day)


@asyncio.coroutine
def init(loop):
    yield from orm.create_pool(loop=loop,user='root',password='root',db='wallpaper')
    app = web.Application(loop=loop, middlewares=[
        logger_factory, response_factory
        ],client_max_size=1024**8)
    cors = aiohttp_cors.setup(app,defaults={
        "*":aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
            )
        })
    logging.info(aiohttp_cors.ResourceOptions)
    init_jinja2(app, filters=dict(datetime=datetime_filter))
    add_routes(app,'handlers',cors)
    add_static(app)
    add_upload(app)
    add_emoticon(app)
    srv = yield from loop.create_server(app.make_handler(),'127.0.0.1',8088)
    logging.info('server started at http://127.0.0.1:8088...')
    return srv



# 获取EventLoop:
loop = asyncio.get_event_loop()
# 执行coroutine
loop.run_until_complete(init(loop))
loop.run_forever()
