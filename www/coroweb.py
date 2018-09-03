#-*-coding: utf-8-*-
#coroweb.py

import asyncio, os, logging, functools, inspect

from urllib import parse

from aiohttp import web

from apis import APIError

import aiohttp_cors

def get(path):
    '''
    Define decorator @get('/path')
    '''

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            return func(*args, **kw)
        wrapper.__method__ = 'GET'
        wrapper.__route__ = path
        return wrapper
    return decorator

def post(path):
    '''
    Define decorator @post('/path')
    '''

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            return func(*args, **kw)
        wrapper.__method__ = 'POST'
        wrapper.__route__ = path
        return wrapper
    return decorator

def get_request_kw_args(fn):
    '''
    获取请求头的参数
    '''
    args = []
    params = inspect.signature(fn).parameters #获取函数的所有参数，返回一个dict
    for name, param in params.items():
        if param.kind ==inspect.Parameter.KEYWORD_ONLY and param.default == inspect.Parameter.empty:
            #啥意思
            args.append(name)
    return tuple(args)

def get_named_kw_args(fn):
    args = []
    params = inspect.signature(fn).parameters #获取函数的所有参数，返回一个dict
    for name, param in params.items():
        if param.kind ==inspect.Parameter.KEYWORD_ONLY :
            #啥意思
            args.append(name)
    return tuple(args)

def has_named_kw_args(fn):
    params = inspect.signature(fn).parameters
    for name, param in params.items():
        if param.kind == inspect.Parameter.KEYWORD_ONLY :
            return True

def has_var_kw_args(fn):
    params = inspect.signature(fn).parameters
    for name, param in params.items():
        if param.kind == inspect.Parameter.VAR_KEYWORD :
            return True

def has_request_args(fn):
    sig = inspect.signature(fn)
    params = sig.parameters
    found = False
    for name, param in params.items():
        if name == 'request':
            found = True
            continue
        if found and (param.kind != inspect.Parameter.VAR_POSITIONAL and param.kind != inspect.Parameter.KEYWORD_ONLY and param.kind != inspect.Parameter.VAR_KEYWORD):
            raise ValueError('request parameter must be the last named parameter in function: %s%s' % (fn.__name__, str(sig)))
    return found


class RequestHandler(object):

    def __init__(self, app, fn):
        self._app = app
        self._fn = fn
        self._has_request_args = has_request_args(fn)
        self._has_var_kw_args = has_var_kw_args(fn)
        self._has_named_kw_args = has_named_kw_args(fn)
        self._get_named_kw_args = get_named_kw_args(fn)
        self._get_request_kw_args = get_request_kw_args(fn)

    @asyncio.coroutine
    def __call__(self, request):
        kw = None
        if self._get_request_kw_args or self._has_var_kw_args or self._has_named_kw_args:
            if request.method == 'POST':
                if not request.content_type:
                    return web.HTTPBadRequest('Missing the Content-Type')
                ct = request.content_type.lower()
                #startswith : 判断字符串是否以指定字符或子字符串开头
                if ct.startswith('application/json'):
                    #数据为json格式
                    params = yield from request.json()
                    if not isinstance(params, dict):
                        return web.HTTPBadRequest('json must be object')
                    kw = params
                elif ct.startswith('application/x-www-form-urlencoded') or ct.startswith('multipart/form-data'):
                    params = yield from request.post()
                    kw = dict(**params)
                else:
                    return HTTPBadRequest('Unsupported Content-type: %s' % request.content_type)
            if request.method == 'GET':
                qs = request.query_string
                if qs:
                    kw = dict()
                    for k,v in parse.parse_qs(qs, True).items():
                        kw[k] = v[0]
        if kw is None:
            kw = dict(**request.match_info)
        else:
            if not self._has_var_kw_args and self._get_named_kw_args:
                # remove all unamed kw:
                copy = dict()
                for name in self._get_named_kw_args:
                    if name in kw:
                        copy[name] = kw[name]
                kw = copy
            # check named arg:
            for k, v in request.match_info.items():
                if k in kw:
                    logging.warn('Duplicate arg name in named arg and kw args: %s' % k)
                kw[k] = v
        if self._has_request_args:
            kw['request'] = request
        # check required kw:
        if self._get_request_kw_args:
            for name in self._get_request_kw_args:
                if not name in kw:
                    return web.HTTPBadRequest('Missing argument: %s' % name)
        logging.info('call with args: %s' % str(kw))
        try:
            r = yield from self._fn(**kw)
            return r
        except APIError as e:
            return dict(error=e.error,data=e.data,message = e.message)

def add_static(app):
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)),'static')
    app.router.add_static('/static/',path)
    logging.info('add static %s => %s' % ('/static/', path))

def add_upload(app):
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)),'upload')
    app.router.add_static('/upload/',path)
    logging.info('add upload %s => %s' % ('/upload/', path))

def add_emoticon(app):
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)),'emoticon')
    app.router.add_static('/emoticon/',path)
    logging.info('add emoticon %s => %s' % ('/emoticon/', path))


def add_route(app, fn, cors):
    method = getattr(fn,'__method__',None)
    path = getattr(fn,'__route__', None)
    if path is None or method is None:
        raise ValueError('@get or @post not defined in %s.' % str(fn))
    if not asyncio.iscoroutinefunction(fn) and not inspect.isgeneratorfunction(fn):
        fn = asyncio.coroutine(fn)
    logging.info('add route %s %s => %s(%s)' % (method, path, fn.__name__, ', '.join(inspect.signature(fn).parameters.keys())))
    # route = app.router.add_route(method,path,RequestHandler(app, fn))
    resource = cors.add(app.router.add_resource(path))
    route = cors.add(
    resource.add_route(method, RequestHandler(app, fn)), {
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
            max_age=3600,
        )
    })
   

def add_routes(app, module_name,cors):
    n = module_name.rfind('.')

    if n == (-1):
        mod = __import__(module_name,globals(),locals())
    else:
        name = module_name[n+1:]
        mod = getattr(__import__(module_name[:n], globals(), locals(),[name]),name)
    for attr in dir(mod):
        if attr.startswith('_'):
            continue
        fn = getattr(mod,attr)
        if callable(fn):
            method = getattr(fn,'__method__',None)
            path = getattr(fn,'__route__',None)
            if method and path:
                add_route(app, fn, cors)



