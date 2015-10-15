# Class.Model.js
118行实现的一个简单的Javascript的对象模型

这个文件中定义了类模型中类似于其他面向对象语言中的Object类。

## 如何新建类

作为基类，类的定义使用 

  var NewClass = Class.new();
  
来进行定义。

通过以上方式定义的类，可以继承：

  var BClass = NewClass.extend();
  
## 如何定义类

类的定义通过向Class.new()方法亦或是Parent.extend()方法中传入参数来进行，形如下面的定义：

  {
    prop1 : null,
    prop2 : null,
    ...
    propN : null,
    initialize : function(args){/*initialize 方式是类在实例化过程中第一个调用的用户定义方法，并且参数args也是通过construct方法传入的用户定义的参数*/},
    method1 : function(){},
    method2 : function(){},
  }
  
如上面的定义方式，所有值不为function类型的键值对将被自动定义为该类的实例变量，所有值为function类型的键值对将作为对象的实例方法。

## 关于private与final

Class.Model.js 为了访问控制还具备private关键字的属性，只需在定义类的参数对象中添加如下代码中相关的部分：

  {
    prop : null,
    initialize : function(args){},
    method1 : function(){},
    private : {
      privateMethod1 : function(){/*这就是一个私有方法*/},
      privateMethod2 : function(){/*这也是一个私有方法*/}
    }
  }
  
在private键对应的对象里定义的方法就是private方法，如果被外界调用，会引发一个找不到方法的异常，很简单吧
  
Class.Model.js 还提供了final关键字的支持，只要在定义类的参数对象中添加下面代码中相关的部分：

  {
    prop : null,
    initialize : function(){},
    method1 : function(){},
    final : {
      finalMethod1 : function(){/*这就是一个final的方法，子类不能复写这个方法*/},
      finalMethod2 : function(){/*这就是一个final的方法，子类不能复写这个方法*/},
    }
  }
  
在final键对应的对象里定义的方法就是final方法，如果子类复写的这个方法会引发一个异常

## 实例化对象

对于已经定义的类，只需要调用 NewClass.new(args)方法即可，args一般为一个js对象，args可以在实例的initialize方法中获取到
