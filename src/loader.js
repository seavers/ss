define = (function() {
	
	var loader = {
		cache: {}
	};
	var modules = {};
	var modulesCallbacks = {};
	var alias = window.alias || {};

	function map(arr, callback) {
		var ret = [];
		for(var i = 0; i < arr.length; i++) {
			ret.push(callback(arr[i], i, arr));
		}
		return ret;
	}
	function isString(obj) {
		return typeof(obj) == 'string';
	}
	function isArray(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	}
	function isFunction(obj) {
		return typeof(obj) == 'function';
	}
	function mix(src, dst) {
		for(var key in dst) {
			src[key] = dst[key];
		}
	}
	function getScript(url, callback) {
		var node = document.createElement("script");
		node.async = true;
		if (document.addEventListener) {
			node.addEventListener('load', callback);
		} else {
			node.onreadystatechange = function () {
				if(node.readyState == 'loaded' || node.readyState == 'complete') {
					callback && callback();
				}
			}
		}
		node.src = url;

		var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
		head.insertBefore(node, head.firstChild);
		return node;
	}

	function getCurrentScript() {
		
		//firefox4 and opera
		if (document.currentScript) {
			return document.currentScript;
		} else if (document.attachEvent) {
			//ie6-9 current execute script
			var scripts = document.getElementsByTagName('script');
			for (var i = scripts.length - 1; i > -1; i--) {
				if (scripts[i].readyState === 'interactive') {
					return scripts[i];
				}
			}
		} else {
			// 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
			// chrome and firefox4 version
			var stack;
			try {
				makeReferenceError
			} catch (e) {
				stack = e.stack;
			}
			if (!stack)
				return undefined;
			// chrome uses at, ff uses @

			var e = stack.indexOf(' at ') !== -1 ? ' at ' : '@';
			while (stack.indexOf(e) !== -1) {
				stack = stack.substring(stack.indexOf(e) + e.length);
			}
			stack = stack.replace(/:\d+:\d+$/ig, "");

			var scripts = document.getElementsByTagName('script');
			for (var i = scripts.length - 1; i > -1; i--) {
				if (scripts[i].src === stack) {
					return scripts[i];
				}
			}
		}
	}

	function getScriptWithCache(url, callback) {
		var scripts = this._scripts = this._scripts || {};
		var cache = scripts[url];
		if (cache === true) {
			callback && callback();
			return ;
		} else if (isArray(cache)) {
			cache.push(callback);
			return ;
		} else {
			scripts[url] = [callback];
		}

		getScript(url, function() {
			var callbacks = scripts[url] || [];
			scripts[url] = true;
			for(var i = 0; i < callbacks.length; i++) {
				callbacks[i] && callbacks[i]();
			}
		});		
	}

	function getModule(mod, callback) {
		if (!modules[mod]) {
			modulesCallbacks[mod] = modulesCallbacks[mod] || [];
			modulesCallbacks[mod].push(callback);

			getScriptWithCache(mod);
		} else {
			callback && callback(modules[mod]);
		}
	}

	function getModules(mods, callback) {
		if (mods == undefined || mods.length == 0) {
			callback && callback();
			return ;
		}
		var c = 0;

		var ret = [];
		map(mods, function(mod, i) {
			getModule(mod, function(obj) {
				ret[i] = obj;

				if (++c == mods.length) {
					callback && callback(ret);
				}
			});
		});
	}

	function define(id, deps, callback) {
		var container = this;

		if (!isString(id)) {
			callback = deps;
			deps = id;
			id = '';
		}
		if (!isArray(reps)) {
			callback = deps;
			reps = [];
		}
		
		var uri = normalize(id);
		var module = loader.cache[uri] = loader.cache[uri] || {};

		deps = deps || [];
		if (isString(deps)) {
			deps = deps.split(',');
		}
		var allDeps = map(deps, tran);				//全部转换映射

		getModules(allDeps, function(mods) {
			var ret = isFunction(callback) ? callback.apply(undefined, mods||[]) : callback;
			modules[url] = modules[url] || {}
			mix(modules[url], ret);

			container != window && (mix(container, ret));

			if (modulesCallbacks[url]) {
				for(var i = 0; i < modulesCallbacks[url].length; i++) {
					modulesCallbacks[url][i](ret);
				}
			}
		});

		return container;
	}

	function normalize(id) {
		if(id == '') {
			var current = getCurrentScript();
			return current && current.src;
		}
		return id;		
	}

	function tran(dep) {
		for(var key in alias) {
			dep = dep.replace(new RegExp('^' + key), alias[key]);		//TODO
		}
		return dep + '.js';
	}

	define.alias = alias;
	return define;
})();
