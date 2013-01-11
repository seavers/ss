
$.bind = function(func, context) {
      var args = Array.prototype.slice.call(arguments, 2);
      return function() {
          return  func.apply(context, args);
      }
}
$.once = function(func){
        var ran = false;
	return function() {
		if(ran) return;
		ran = true;
		func();
	}
}

//每个ms的时间内，最多执行一次
$.throttle = function(func, ms) {
   ms = ms || 150;

   var last = +new Date();
   var timer ;
    return function() {
        var now = +new Date();
        if(now - last > ms) {
             timer = null;
             last = now;
             func();
        } else {
             timer = setTimeout(func, ms - (now-last));
        }
    }
}

//直至ms的时间内，不再触发，则执行
$.buffer = function(func, ms) {
       ms = ms || 150;
       var timer;
       return function() {
           clearTimeout(timer);
           timer = setTimeout(func, ms);
      }
}


