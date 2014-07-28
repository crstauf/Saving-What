<?php
/*
Plugin Name: Saving What
Plugin URI: 
Description: Shows all post fields and data that will be saved on post Update/Publish
Version: 0.0.1
Author: Caleb Stauffer
Author URI: http://develop.calebstauffer.com
*/

if (!is_admin()) return;

new css_saving_what;

class css_saving_what {

	private static $title = 'Saving What';

	function __construct() {

		add_action('admin_enqueue_scripts',	array(__CLASS__,'scripts'));
		add_action('add_meta_boxes',		array(__CLASS__,'add_meta_box'));
		add_action('admin_footer-post.php',	array(__CLASS__,'heartbeat_footer_js'),20);
		//add_action('heartbeat_received',	array(__CLASS__,'heartbeat_received'),10,3);

	}

	public static function scripts() {
		global $current_screen;
		if ('post' != $current_screen->base) return;
		wp_enqueue_script('sortElements',plugin_dir_url(__FILE__) . 'jQuery.sortElements.js',array('jquery'));
		wp_enqueue_script('saving-what',plugin_dir_url(__FILE__) . 'admin.js',array('jquery','heartbeat','sortElements'));
		wp_enqueue_style('saving-what',plugin_dir_url(__FILE__) . 'admin.css');
	}

	public static function add_meta_box() {
		add_meta_box('saving-what',self::$title,array(__CLASS__,'metabox'),'','normal');
	}

	public static function metabox($post) {
		?>

		<table id="saving-what-table">
			<thead>
				<tr>
					<td class="item-num">#</td>
					<td class="item-id">Element ID</td>
					<td class="item-name">$_POST Name</td>
					<td class="item-type">Input Type</td>
					<td class="item-value">$_POST Value</td>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>

		<?php
	}

	public static function heartbeat_footer_js() {
		?>

		<script>
			(function($) {
				$(document).on('heartbeat-tick',function(e,data) {
					saving_what_items = $('form#post').find('*[name]:input');
					console.log('tick ' + $.now() + ': ' + saving_what_items.length);
					if (saving_what_items.length != saving_what_item_count) {
						var i = saving_what_item_count;
						saving_what_item_count = saving_what_items.length;
						saving_what_items.not('.saving-what-item').each(function() {
							alert($(this).val());
							i++;
							$(this).addSavingWhatItem($("table#saving-what-table"),i,true);
						}).change(function() {
							$(this).changeSavingWhatItem($("table#saving-what-table"));
						});
					}
				});
			}(jQuery));
		</script>

		<?php
	}

}

?>