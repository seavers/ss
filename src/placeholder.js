/**
  *   placeholder
  *
  *		$.placeholder(input_node);
  *
  *   author  seavers
  */
$.placeholder = "placeholder" in document.createElement("input") ? function() {} : function placeholder(selectors) {
	selector = selector || 'input,textarea';
	
	$(selectors).filter('input[placeholder],textarea[placeholder]').each(function(node) {
		$(el).on('focus', focus).on('blur', blur).trigger('blur');
		$(el.form).on('submit', function () {
			focus();
			setTimeout(blur, 10);
		});

		function focus() {
			if (D.hasClass(el, 'placeholder') && el.value === text) {
				el.value = '';
			}
			D.removeClass(el, 'placeholder');
		}

		function blur() {
			if (el.value === '') {
				D.addClass(el, 'placeholder');
				el.value = text;
			}
		}
	};
    return placeholder;
};

$.ready($.placeholder);




