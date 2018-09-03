#-*-coding: utf-8-*-
#orm.py

import asyncio, logging
import aiomysql

@asyncio.coroutine
def create_pool(loop,**kw):
    #创建数据库连接池
    logging.info('create database connection pool...')
    global __pool
    __pool = yield from aiomysql.create_pool(
            host = kw.get('host','127.0.0.1'),
            port = kw.get('post',3306),
            user = kw.get('user',''),
            password = kw.get('password',''),
            db = kw.get('db',''),
            charset = kw.get('charset','utf8'),
            autocommit = kw.get('autocommit', True),
            maxsize = kw.get('maxsize', 10),
            minsize = kw.get('minsize', 1),
            loop = loop
            )



def log(sql, args=()):
    #打印信息
    logging.info('sql: %s=>%s' % (sql, args))

@asyncio.coroutine
def select(sql,args, size=None):
    #搜索
    log(sql, args)
    global __pool
    with (yield from __pool) as conn:
        #aiomysql.dictcursor: 返回dict格式的数据
        cur = yield from conn.cursor(aiomysql.DictCursor)
        yield from cur.execute(sql.replace('?','%s'),args or ())
        if size:
            rs = yield from cur.fetchmany(size)
        else:
            rs = yield from cur.fetchall()
        yield from cur.close()
        logging.info('rows returned: %s' % len(rs))
        return rs

@asyncio.coroutine
def execute(sql, args):
    #通用数据库执行语句
    log(sql, args)
    with (yield from __pool) as conn:
        try:
            cur = yield from conn.cursor(aiomysql.DictCursor)
            yield from cur.execute(sql.replace('?','%s'), args or())
            rows = cur.rowcount
        except BaseException as e:
            raise
        return rows

def create_args_string(num):
    l = []
    for i in range(num):
        l.append('?')
    return ', '.join(l)


class Field(object):

    def __init__(self, name, column_type, primary_key, default):
        self.name = name
        self.column_type = column_type #字段类型
        self.primary_key = primary_key
        self.default = default

    def __str__(self):
        return '<%s, %s: %s>' % (self.__class__.__name__, self.column_type, self.name)

class StringField(Field):

    def __init__(self, name=None, primary_key=False, default='', ddl='varchar(100)'):
        super().__init__(name,ddl,primary_key,default)

class BooleanField(Field):

    def __init__(self, name=None, default=False):
        super().__init__(name, 'boolean',False,default)

class IntergerField(Field):

    def __init__(self, name=None, primary_key=False, default=0):
        super().__init__(name, 'bigint', primary_key, default)

class FloatField(Field):

    def __init__(self, name=None, primary_key=False, default=0.0):
        super().__init__(name, 'real', primary_key, default)

class TextField(Field):

    def __init__(self, name=None, default=None):
        super().__init__(name, 'text', False, default)





class ModelMetaClass(type):
    #meta类
    def __new__(cls, name, bases, attrs):
        #参数分别是：
        #当前准备创建的类的对象；
        #类的名字；
        #类继承的父类集合；
        #类的方法集合。
        if name == 'Model':
            return type.__new__(cls,name, bases, attrs) #啥意思
        # 获取table名称:
        tablename = attrs.get('__table__',None) or name
        logging.info('found model : %s (table:%s)' % (name, tablename))
        # 获取所有的field和主键名:
        mappings = dict()
        fields = []
        primarykey = None
        for k, v in attrs.items():
            if isinstance(v, Field):
                logging.info('found mapping: %s ==> %s' % (k,v))
                mappings[k] = v
                if v.primary_key:
                    #找到主键（唯一）
                    if primarykey:
                        raise BaseException('duplicate primary key for field: %s' % k)
                    primarykey = k
                else: 
                    fields.append(k)
        if not primarykey : 
            raise BaseException('primarykey not found')
        for k in mappings.keys():
            attrs.pop(k)
        escaped_fields = list(map(lambda f: '`%s`' % f, fields)) #啥意思
        attrs['__mappings__'] = mappings # 保存属性和列的映射关系
        attrs['__table__'] = tablename
        attrs['__primary_key__'] = primarykey # 主键属性名
        attrs['__fields__'] = fields #除主键外的属性名
        attrs['__select__'] = 'SELECT `%s` , %s FROM %s' % (primarykey, ', '.join(escaped_fields), tablename)
        attrs['__insert__'] = 'INSERT INTO `%s` (%s, `%s`) VALUES (%s)' % (tablename, ', '.join(escaped_fields), primarykey, create_args_string(len(escaped_fields)+1))
        attrs['__update__'] = 'UPDATE `%s` SET %s WHERE `%s`=?' % (tablename,', '.join(map(lambda f: '%s=?'%(mappings.get(f).name or f ), fields)), primarykey)
        attrs['__delete__'] = 'DELETE FROM `%s` WHERE `%s`=?' % (tablename, primarykey)
        return type.__new__(cls,name, bases, attrs)

class Model(dict, metaclass=ModelMetaClass):
    #基类
    #metaclass: 允许你创建类或者修改类。换句话说，你可以把类看成是metaclass创建出来的“实例”。

    def __init__(self,**kw):

        super(Model,self).__init__(**kw)

    def __getattr__(self,key):
        try:
            return self[key]
        except KeyError:
            raise AttributeError('models no have attribute: %s' % key)


    def __setattr__(self, key, value):
        self[key] = key

    def getValue(self, key):
        return getattr(self,key,None)

    def getValueOrDefault(self,key):
        val = getattr(self,key,None)
        if val is None:
            field = self.__mappings__[key]
            if field.default is not None:
                val = field.default() if callable(field.default) else field.default
                logging.info('using default value for %s: %s' % (key,str(val)))
                setattr(self,key,val)
        return val

    @classmethod
    @asyncio.coroutine
    def findAll(cls, where=None, args=None, **kw):
        ' find objects by where clause. '
        sql = [cls.__select__]
        if where:
            sql.append('where')
            sql.append(where)
        if args is None:
            args = []
        orderby = kw.get('orderby',None)
        if orderby:
            sql.append('orderby')
            sql.append(orderby)
        limit = kw.get('limit',None)
        if limit is not None:
            sql.append('limit')
            if isinstance(limit, int):
                sql.append('?')
                sql.append(limit)
            elif isinstance(limit, tuple) and len(limit) == 2:
                sql.append('?, ?')
                args.extend(limit)
            else :
                raise valueerror('limit value is error: %s' % str(limit))
        rs = yield from select((' ').join(sql), args)
        return [cls(**r) for r in rs]


    @classmethod
    @asyncio.coroutine
    def findNumber(cls, selectfield,where=None, args=None):
        ' find number by select and where. '
        sql = ['select %s _num_ from `%s`' % (selectfield,cls.__table__)]
        if where:
            sql.append('where')
            sql.append(where)
        rs = yield from select((' ').join(sql), args, 1)
        if len(rs) == 0:
            return None
        return rs[0]['_num_']



    @classmethod
    @asyncio.coroutine
    def find(cls, pk):
        ' find object by primary key. '
        rs = yield from select('%s where `%s`=?' % (cls.__select__,cls.__primary_key__),pk,1)
        if(len)==0:
            return None
        return cls(**rs[0])



    @asyncio.coroutine
    def save(self):
        args = list(map(self.getValueOrDefault,self.__fields__))
        args.append(self.getValueOrDefault(self.__primary_key__))
        rows = yield from execute(self.__insert__,args)
        if rows != 1:
            logging.warn('failed to insert record: affected rows %s' % rows)

    @asyncio.coroutine
    def update(self):
        
        args = list(map(self.getValue, self.__fields__))
        args.append(self.getValueOrDefault(self.__primary_key__))
        rows = yield from execute(self.__update__, args)
        if rows != 1:
            logging.warn('failed to update record: affected rows %s' % rows)

    @classmethod
    @asyncio.coroutine
    def update2(cls,**kw):
        fields = []
        value = []

        params = dict(**kw)
        for k,v in params.items():
            if k != cls.__primary_key__:
                fields.append(k)
                value.append(v)
        args =  value
        args.append(params[cls.__primary_key__])
        _update_ = 'UPDATE `%s` SET %s WHERE `%s`=?' % (cls.__table__,', '.join(map(lambda f: '%s=?'%(cls.__mappings__.get(f).name or f ), fields)), cls.__primary_key__)
        rows = yield from execute(_update_, args)
        if rows != 1:
            logging.warn('failed to update record: affected rows %s' % rows)

    @classmethod
    @asyncio.coroutine
    def updateAll(cls,**kw):
        fields = []
        value = []

        params = dict(**kw)
        for k,v in params.items():
            if k != cls.__primary_key__:
                fields.append(k)
                value.append(v)
        args =  value
        keys = params[cls.__primary_key__]
        for k in keys:
            args.append(k)
        _update_ = 'UPDATE `%s` SET %s WHERE `%s`in(%s)' % (cls.__table__,', '.join(map(lambda f: '%s=?'%(cls.__mappings__.get(f).name or f ), fields)), cls.__primary_key__,', '.join(map(lambda f: '?', keys)))
        rows = yield from execute(_update_, args)


    @asyncio.coroutine
    def remove(self):
        args = [self.getValue(self.__primary_key__)]
        rows = yield from execute(self.__delete__, args)
        if rows != 1:
            logging.warn('failed to remove record: affected rows %s' % rows)

    @classmethod
    @asyncio.coroutine
    def remove2(cls,**kw):
        args = []
        params = dict(**kw)
        keys = params[cls.__primary_key__]
        for k in keys:
            args.append(k)
        _update_ = 'DELETE FROM `%s` WHERE `%s` in (%s)' % (cls.__table__, cls.__primary_key__, ', '.join(map(lambda f: '?', keys)))
        rows = yield from execute(_update_, args)
        if rows == 0:
            logging.warn('failed to update record: affected rows %s' % rows)

















