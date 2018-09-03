#-*-coding: UTF-8-*-
#models.py

from orm import Model, StringField, BooleanField, IntergerField, FloatField, TextField

import uuid ,time


def format_time(strtime):
    #格式化时间
    #strtime: 传进来的时间
    localtime = time.localtime(strtime)
    return time.strftime("%Y-%m-%d", localtime)

def next_id():
	return '%015d%s000' % (time.time()*1000, uuid.uuid4())


class User(Model):
    #用户表
    __table__ = 'users'

    id = StringField(primary_key=True,default=next_id,ddl='varchar(60)')
    name = StringField(ddl='varchar(50)')
    nickname = StringField(ddl='varchar(50)')
    password = StringField(ddl='varchar(50)')
    email = StringField(ddl='varchar(50)')
    image = StringField(ddl='varchar(500)')
    created_time = FloatField(default=time.time())
    is_del = BooleanField()
    is_admin = BooleanField()

class Cate(Model):
    #分类表
    __table__ = 'cates'

    id = StringField(primary_key=True,default=next_id,ddl='varchar(60)')
    name = StringField(ddl='varchar(50)')
    created_time = StringField(ddl='varchar(50)',default=format_time(time.time()))
    is_del = BooleanField()

class Label(Model):
    #标签表
    __table__ = 'labels'

    id = StringField(primary_key=True,default=next_id,ddl='varchar(60)')
    name = StringField(ddl='varchar(50)')
    created_time = StringField(ddl='varchar(50)',default=format_time(time.time()))
    is_del = BooleanField()

class Pic(Model):
    #图片表
    __table__ = 'pic'
    id = StringField(primary_key=True,default=next_id,ddl='varchar(60)')
    title = StringField(ddl='varchar(60)')
    author = StringField(ddl='varchar(60)')
    source = StringField(ddl='varchar(60)')
    labels = StringField(ddl='varchar(500)')
    cate = StringField(ddl='varchar(60)')
    path = StringField(ddl='varchar(60)')
    created_time = FloatField(default=time.time())
    is_del = BooleanField()



class Token(Model):
    #token表
    __table__ = 'tokens'

    id = StringField(primary_key=True,default=next_id,ddl='varchar(60)')
    uid = StringField(ddl='varchar(60)')
    token_key = StringField(ddl='varchar(100)')
    last_time = FloatField(default=time.time())



