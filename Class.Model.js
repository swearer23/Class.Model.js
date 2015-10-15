//Class Model starts
var construct = function(args){
    for(var k in args){
        switch(k){
            case "private":
            this.prototype.__private__ = args[k];
            break;
            case "final":
            this.prototype.__final__ = args[k];
            break;
            default:
            if(args[k] instanceof Function){
                this.prototype[k] = args[k];
                this.prototype.__methods__[k] = this.prototype[k];
            }else{
                this.prototype.__attrs__[k] = args[k];
            }
            break;
        }
    }
}

var prepareExtend = function(fields , Child , instanceProperty){
    _.each(fields , function(field){
        if(_.has(instanceProperty , field)){
            Child.prototype[field] = _.clone(instanceProperty[field]);
            instanceProperty[field] = null;
            delete instanceProperty[field];
        }else{
            Child.prototype[field] = {};
        }
    })
}

var checkOverride = function(instanceProperty){
    for(var k in instanceProperty){
        if(_.has(this.prototype.__final__ , k)){
            throw new Error("Overriding parent's final method [\"" + k + "\"]")
        }
    }
}

var extend = function(instanceProperty){
    checkOverride.call(this, instanceProperty);
    var Child = {};
    var Parent = this;
    var PP = _.clone(Parent.prototype);
    for(var k in PP){
        if(!_.has(instanceProperty , k)){
            instanceProperty[k] = PP[k];
        }
    }
    if(_.has(instanceProperty , "constructor")){
        Child = function(){instanceProperty["constructor"]()};
    }else{
        Child = function(){Parent.apply(this , arguments)};
    }
    prepareExtend(["__attrs__" , "__methods__" , "__private__" , "__final__"] , Child , instanceProperty);
    construct.call(Child, instanceProperty);
    __privateMethodsConstrain__.call(Child);
    __finalMethodsPrepare__.call(Child);
    for(var k in Parent){Child[k] = Parent[k]};
    Child.__super__  = Child.prototype.__super__ = Parent.prototype;
    Child.new = function(){return new Child(arguments)};
    return Child;
}

__privateMethodsConstrain__ = function(){
    for(var k in this.prototype.__methods__){
        this.prototype[k] = (function(){
            var alias = this.prototype.__methods__[k];
            return function(){
                __insertPrivateMethods__.call(this);
                var ret = alias.apply(this, arguments);
                __removePrivateMethods__.call(this);
                return ret;
            };
        }).call(this);
    }
}

__insertPrivateMethods__ = function(){
    for(var k in this.__private__){
        this[k] = this.__private__[k];
    }
}
__removePrivateMethods__ = function(){
    for(var k in this.__private__){
        this[k] = null;
        delete this[k];
    }
}

__finalMethodsPrepare__ = function(){
    for(var k in this.prototype.__final__){
        this.prototype[k] = this.prototype.__final__[k];
    }
}

Class = function(){};
Class.new = function(){
    var Obj = function(){
        var __attrs__ = this.__attrs__;
        for(var k in __attrs__){
            this[k] = _.clone(__attrs__[k])
        };
        this.initialize.apply(this , arguments[0]);
    };
    Obj.prototype.__attrs__ = {};
    Obj.prototype.__methods__ = {};
    Obj.prototype.__private__ = {};
    construct.apply(Obj, arguments);
    __privateMethodsConstrain__.apply(Obj);
    __finalMethodsPrepare__.apply(Obj);
    Obj.new = function(){return new Obj(arguments)};
    Obj.extend = extend;
    return Obj;
};