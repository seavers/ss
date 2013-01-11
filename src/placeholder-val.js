/**
  *   jQuery.valHooks
  */
$.valHooks.input = $.valHooks.textarea = {
	chain : {'INPUT' : $.valHooks.input, 'TEXTAREA' : $.valHooks.textarea},
	get: function(el) {
		var ret = this.chain[el.tagName] && this.chain[el.tagName].get && this.chain[el.tagName].get(el);
		if(el.getAttribute('placeholder') === ret && $(el).hasClass('placeholder')) {
			return '';
		}
	},
	set: function(el, value) {
		this.chain[el.tagName] && this.chain[el.tagName].set && this.chain[el.tagName].set(el, value);
		if(document.activeElement === el) {
			$(el).trigger('focus');
		} else {
			$(el).trigger('blur');
		}
	}
}