#-*-coding: UTF-8-*-
#handlers.py

import re, time, json, logging, hashlib, base64, asyncio, os, functools, datetime, math

from coroweb import get, post

from utils import check_token, format_time, get_page_index, save_img, del_img, change_token

from apis import APIValueError, APIResourceNotFoundError

from models import next_id, User, Token, Cate, Label

from aiohttp import web

_RE_EMAIL = re.compile(r'^[a-z0-9\.\-\_]+\@[a-z0-9\-\_]+(\.[a-z0-9\-\_]+){1,4}$')
_RE_SHAI = re.compile(r'^[0-9a-f]{40}$')


@post('/admin/login')
@asyncio.coroutine
def login(request):
    '''
    登录
    '''
    params = yield from request.json()
    kw = dict(**params)
    name = kw['userName']
    psd = kw['password']
    if not name or not name.strip():
        result = dict(code=0,msg="名称不能为空")
    elif not psd:
        result = dict(code=0,msg="密码不能为空")
    else:
        # 查询该用户是否存在
        users = yield from User.findAll('name=?',[name])
        if len(users) == 0:
            result = dict(code=0,msg="该用户不存在")
        else:
            user = users[0]
            # 加密提交的密码，与数据库的密码对比
            shal = '%s:%s' % (user.id,psd)
            shal_psd = hashlib.sha1(shal.encode('utf-8')).hexdigest()
            if user.password != shal_psd:
                result = dict(code=0,msg="密码不正确")
            else:
                # 修改并返回新的token
                
                token_key = yield from change_token(user.id)

                userDict = dict(id=user.id,name=user.name,token=token_key)
                result = dict(code=1,msg="登录成功",result=userDict)
    return result


@post('/admin/register')
@asyncio.coroutine
def register(request):
    '''
    注册
    '''
    params = yield from request.json()
    kw = dict(**params)
    name = kw['userName']
    psd = kw['password']
    repsd = kw['repassword']
    if not name or not name.strip():
        result = dict(code=0,msg="名称不能为空")
    elif not psd:
        result = dict(code=0,msg="密码不能为空")
    elif psd != repsd:
        result = dict(code=0,msg="确认密码不正确")
    else:
        users = yield from User.findAll('name=?',[name])
        if len(users) > 0:
            result = dict(code=0,msg="该名称已经注册过了")
        else:
            uid = next_id() #生成唯一的id
            shal_psd = '%s:%s' % (uid,psd) #加密密码
            user = User(id=uid,name=name,nickname='',email='',password=hashlib.sha1(shal_psd.encode('utf-8')).hexdigest(),image='')
            yield from user.save()

            #创建token
            shal = '%s=%s=%s' % ('Token',uid,time.time())
            shal_key = hashlib.sha1(shal.encode('utf-8')).hexdigest()
            token = Token(id=next_id(),uid=uid,token_key=shal_key)
            yield from token.save()
            result = dict(code = 1, msg="注册成功")
    return result

@get('/admin/logOut')
def logOut(request,*,userId):
    '''
    退出登录
    '''
    logging.info(userId)
    token_key = change_token(userId)
    return dict(code=1,msg="退出登录成功")


@post('/admin/addCate')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def addCate(request):
    '''
    添加分类
    '''
    params = yield from request.json()
    kw = dict(**params)
    name = kw['name']
    if not name or not name.strip():
        result = dict(code = 0, msg="分类名称不能为空")
    else:
        cates = yield from Cate.findAll('name=?',[name])
        if len(cates)>0:
            result = dict(code = 0, msg="该分类名称已经存在")
        else:
            id = next_id();
            cate = Cate(id=id,name=name)
            yield from cate.save()
            result = dict(code = 1, msg="分类添加成功")
    return result

@get('/admin/cateList')
@asyncio.coroutine
def cateList(request):
    '''
    获取分类
    '''
    cates = yield from Cate.findAll('is_del=?',[0]);
    return dict(code = 1, msg = "获取分类成功", list = cates)

@post('/admin/delCate')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def delCate(request):
    '''
    删除分类
    '''
    params = yield from request.json()
    kw = dict(**params)
    id = kw['id']
    if not id or not id.strip():
        result = dict(code = 0, msg = "id不能为空")
    else:
        cate = Cate.find(id)
        if not cate:
            result = dict(code = 0, msg = "没有该分类")
        else:
            yield from Cate.update2(id=id,is_del=1)
            result = dict(code = 1, msg = "分类删除成功")
    return result


@get('/admin/cateDetail')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def cateDetail(request, * , id):
    '''
    获取分类详情
    '''
    if not id or not id.strip():
        result = dict(code = 0, msg = "id不能为空")
    else:
        cate = yield from Cate.find(id)
        if not cate:
            result = dict(code = 0, msg = "没有该分类")
        else:
            result = dict(code = 1, msg = "获取分类成功", list=cate)
    return result

@post('/admin/editCate')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def editCate(request):
    '''
    修改分类
    '''
    params = yield from request.json()
    kw = dict(**params)
    id = kw['id']
    name = kw['name']
    if not id or not id.strip():
        result = dict(code = 0, msg = "id不能为空")
    if not name or not name.strip():
        result = dict(code = 0, msg = "名称不能为空")
    else:
        cate = Cate.find(id)
        if not cate:
            result = dict(code = 0, msg = "没有该分类")
        else:
            yield from Cate.update2(id=id,name=name)
            result = dict(code = 1, msg = "分类修改成功")
    return result

@get('/admin/labelList')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def labelList(request):
    '''
    标签分类列表
    '''
    labels = yield from Label.findAll('is_del=?',[0])
    return dict(code = 1, msg = "获取标签列表成功", list = labels)


@post('/admin/addLabel')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def addLabel(request):
    '''
    添加标签
    '''
    params = yield from request.json()
    kw = dict(**params)
    name = kw.get('name',None)
    if not name or not name.strip():
        result = dict(code = 0, msg = "标签名字不能为空")
    else:
        labels = yield from Label.findAll('name=?',[name])
        if len(labels) > 0:
            result = dict(code = 0, msg = "已经存在该标签名称")
        else:
            id = next_id();
            label = Label(id=id,name=name)
            yield from label.save()
            result = dict(code = 1, msg = "标签添加成功")
    return result

@get('/admin/labelDetail')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def labelDetail(request, * , id):
    '''
    获取标签详情
    '''
    if not id or not id.strip():
        result = dict(code = 0, msg = "id不能为空")
    else:
        label = yield from Label.find(id)
        if not label:
            result = dict(code = 0, msg = "没有该标签")
        else:
            result = dict(code = 1, msg = "获取标签成功", list=label)
    return result

@post('/admin/editLabel')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def editLabel(request):
    '''
    修改标签
    '''
    params = yield from request.json()
    kw = dict(**params)
    id = kw['id']
    name = kw['name']
    if not id or not id.strip():
        result = dict(code = 0, msg = "id不能为空")
    elif not name or not name.strip():
        result = dict(code = 0, msg = "标签名字不能为空")
    else:
        label = yield from Label.find(id)
        if not label:
            result = dict(code = 0, msg = "不存在该标签名称")
        else:
            yield from Label.update2(id=id,name=name)
            result = dict(code = 1, msg = "标签修改成功")
    return result


@post('/admin/delLabel')
@asyncio.coroutine
@check_token
@asyncio.coroutine
def delLabel(request):
    '''
    删除标签
    '''
    params = yield from request.json()
    kw = dict(**params)
    id = kw['id']
    if not id or not id.strip():
        result = dict(code = 0, msg = "id不能为空")
    else:
        label = yield from Label.find(id)
        if not label:
            result = dict(code = 0, msg = "没有该标签")
        else:
            yield from Label.update2(id=id,is_del=1)
            result = dict(code = 1, msg = "标签删除成功")
    return result









