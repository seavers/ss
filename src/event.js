var Event = {};

Event.on = function(type, callback) {
	this.__event = this.__event || {};
	this.__event[type] = this.__event[type] || [];
	this.__event[type].push(callback);
	return this;
}
Event.trigger = function(type   /* arguments */) {
	if(!this.__event || !this.__event[type]) return this;
	
	var args = Array.prototype.slice.call(arguments, 1);
	for(var i = 0; i < this.__event[type].length; i++) {
		this.__event[type][i].apply(this, args);
	}
	return this;
}
Event.off = function(type, callback) {
	if(!this.__event) return this;
	if(type == undefined) {
		delete this.__event;
		return this;
	}
	
	if(!this.__event[type]) return this;
	if(callback == undefined) {
		delete this.__event[type];
		return this;
	}
		
	for(var i = this.__event[type].length-1; i >= 0; i--) {
		if(this.__event[type][i] === callback) {
			this.__event[type].splice(i, 1);
		}
	}
	return this;
}





