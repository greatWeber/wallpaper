#-*-coding: UTF-8-*-
#utils.py


import re, time, json, logging, hashlib, base64, asyncio, os, functools, datetime

from aiohttp import web

from models import Token

from urllib import parse


def check_token(func):
    '''
    检查token是否过期
    '''
    @functools.wraps(func)
    def wrapper(*args,**kw):
        err = False
        #获取request里面的参数
        if kw['request'].method == 'POST':
            params = yield from kw['request'].json()
        else:
            qs = kw['request'].query_string
            if qs:
                q = dict()
                for k,v in parse.parse_qs(qs, True).items():
                    q[k] = v[0]
                params = q
        kws = dict(**params)
        key = kws.get('token',None)
        if key is None:
            err = True
        else:
            token = yield from Token.findAll('token_key=?',[key])

            if len(token) == 0:
                err = True
            else:
                now = datetime.datetime.now()
                end = now - datetime.timedelta(hours=3) #有效期
                nowNum = time.mktime(now.timetuple())
                endNum = time.mktime(end.timetuple())
                lastTime = token[0]['last_time']

                if lastTime < endNum :
                    #过期
                    err = True
        if err:
            r = web.Response()
            r.content_type = 'application/json'
            Dict = dict(code=-1,msg='token失效，请重新登录')
            logging.info(Dict)
            r.body = json.dumps(Dict,ensure_ascii=False).encode('utf-8')
            return r
        res = yield from func(*args,**kw)
        return res
    return wrapper
                        



@asyncio.coroutine
def create_token(uid):
    '''
    生成token
    '''
    shal = '%s=%s=%s' % ('Token',uid, time.time())
    shal_uid = hashlib.sha1(shal.encode('utf-8')).hexdigest()

    token = Token(id=next_id(),uid=uid,key=shal_uid)
    yield from token.save()
    return token['key']

@asyncio.coroutine
def change_token(uid):
    '''
    修改token
    '''
    tokens = yield from Token.findAll('uid=?',[uid])
    shal = '%s=%s=%s' % ('Token',uid,time.time())
    shal_uid = hashlib.sha1(shal.encode('utf-8')).hexdigest()

    token = Token(id=tokens[0].id,uid=uid,token_key=shal_uid,last_time=time.time())
    yield from token.update()
    return token.token_key


def save_img(suffix, content,path='upload'):
    '''
    保存图片
    '''
    if not os.path.exists(path):
        os.makedirs(path)
    img_name = '%s.%s' % (int(time.time()*1000),suffix)
    img_path = os.path.join(path,img_name)
    with open(img_path,'wb') as f:
        f.write(content)
    return '%s/%s' % (path,img_name)

def del_img(imgpath):
    '''
    删除图片
    '''
    if os.path.isfile(imgpath):
        os.remove(imgpath)
        logging.info('图片已删除')

def del_imgs():
    '''
    清理图片
    '''
    currentpath = os.path.split(os.path.realpath(__file__))[0];
    logging.info(currentpath);
    return


def get_page_index(str):
    '''
    获取页数
    '''
    p = 1;
    try:
        p = int(str)
    except ValueError as e:
        pass
    if p<1:
        p=1
    return p


def format_time(strtime):
    #格式化时间
    #strtime: 传进来的时间
    localtime = time.localtime(strtime)
    return time.strftime("%Y-%m-%d", localtime)
