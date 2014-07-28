/* js file for saving-what */

var saving_what_items		= false;
var saving_what_item_count 	= 0;

jQuery(function($) {

	$.fn.addSavingWhatItem = function(table,i,added) {
		var item_id				= '';
		var item_value			= '';
		var item_type			= '';
		var item_name			= $(this).attr('name');

		if ("undefined" !== typeof $(this).attr('id') && false !== $(this).attr('id'))
			item_id 			= '#' + $(this).attr('id');

		if ("undefined" !== typeof $(this).attr('value') && false !== $(this).attr('value'))
			item_value			= $(this).val();

		if ("undefined" !== typeof $(this).attr('type') && false !== $(this).attr('type'))
			item_type			= $(this).attr('type');
		else if ($(this).is('select'))
			item_type			= 'select';
		else if ($(this).is('textarea'))
			item_type			= 'textarea';

		if ($(this).is(':checked'))
			item_type			+= '/checked';

		$(this).addClass('saving-what-item saving-what-item-' + i);

		var id 					= '<td class="item-id">' + item_id + '</td>';
		var name				= '<td class="item-name">' + item_name + '</td>';
		var type 				= '<td class="item-type">' + item_type + '</td>';
		var value				= '<td class="item-value">' + item_value + '<input type="text" value="' + item_value + '" readonly="readonly" /></td>';

		var num 				= i + "";
		while (num.length < 3)	num = "0" + num;

		var html = '<tr id="form-item-' + i + '"';
		if (true === added) html += ' class="added"';
		html += '><td class="item-num">' + num + '</td>' + id + name + type + value + '</td></tr>';

		if (false === added)
			table.find('tbody').append(html);
		else if (false !== added)
			table.find('tbody').prepend(html);
	};

	$.fn.changeSavingWhatItem = function(table) {
		var item_name			= $(this).attr('name');
		var item_value			= $(this).val();
		var item_type			= '';
		var item_id				= '';

		if ("undefined" !== typeof $(this).attr('id') && false !== $(this).attr('id'))
			item_id 			= '#' + $(this).attr('id');

		if ("undefined" !== typeof $(this).attr('type') && false !== $(this).attr('type'))
			item_type			= $(this).attr('type');
		else if ($(this).is('select'))
			item_type			= 'select';
		else if ($(this).is('textarea'))
			item_type			= 'textarea';

		var found = false;
		table.find('tbody tr').each(function() {
			if (
				$(this).find('td.item-name').html() 	== item_name && 
				$(this).find('td.item-type').html() 	== item_type && 
				$(this).find('td.item-id').html()		== item_id
			) {

				var i 			= $(this).find('td.item-num').html();
				var num			= '<td class="item-num">' + i + '</td>';
				var id 			= '<td class="item-id code">' + item_id + '</td>';
				var name		= '<td class="item-name code">' + item_name + '</td>';
				var type 		= '<td class="item-type code">' + item_type + '</td>';
				var value		= '<td class="item-value">' + item_value + '<input type="text" value="' + item_value + '" readonly="readonly" /></td>';

				$(this).remove();
				table.find('tbody').prepend('<tr class="updated" id="form-item-' + parseInt(i) + '">' + num + id + name + type + value + '</td></tr>');
				found = true;
				return false;
			}
		});
	};

	$(document).ready(function() {

		var form					= $("form#post");
		saving_what_item_count		= saving_what_items.length;
		var table					= $("table#saving-what-table");

		var w = table.width();
		table.find('thead').css('width',w + 'px').attr('data-scrolltop',table.find('thead').offset().top);

		var i = 0;
		form.find('*[name]:input').each(function() {
			i++;
			$(this).addSavingWhatItem(table,i,false);
		}).change(function() {
			$(this).changeSavingWhatItem(table);
		});

		table.find('thead td').wrapInner('<span title="sort this column"/>').each(function(){
            
            var th = $(this),
                thIndex = th.index(),
                inverse = false;
            
            th.click(function(){
                
                table.find('tbody td').filter(function(){
                    
                    table.addClass('sorted');
                    return $(this).index() === thIndex;
                    
                }).sortElements(function(a, b){

                    return $.text([a]) > $.text([b]) ?
                        inverse ? -1 : 1
                        : inverse ? 1 : -1;
                    
                }, function(){
                    
                    // parentNode is the element we want to move
                    return this.parentNode; 
                    
                });
                
                inverse = !inverse;
                    
            });
                
        });

	});

	$(window).scroll(function() {
		var thead = $("table#saving-what-table thead");
		var tfoot = $("table#saving-what-table tfoot");
		if (!thead.hasClass('fixed')) {
			thead.attr('data-scrolltop',thead.offset().top - 32);
			if ($(window).scrollTop() >= thead.attr('data-scrolltop')) {
				$("table#saving-what-table").css('margin-top','32px');
				thead.addClass('fixed');
			}
		} else {
			if ($(window).scrollTop() < thead.attr('data-scrolltop')) {
				$("table#saving-what-table").css('margin-top','');
				thead.removeClass('fixed');
			} else if ($(window).scrollTop() > (tfoot.offset().top - 65)) {
				thead.addClass('bottom');
			} else {
				thead.removeClass('bottom');
			}
		}
	});
	
});