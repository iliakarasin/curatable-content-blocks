window.wp = window.wp || {};

(function($){
	var frame,
		$body = $('body');

	// Sortable blocks
	$( '.sortable' ).sortable({
    	handle: '.handle',
    	forcePlaceholderSize: true,
    	items: "> div"
    });

    $body.on( 'click', '.content-block-adder .toggle', function(e){
    	e.preventDefault();
    	$(this).toggleClass( 'open' ).siblings( '.content-block-select' ).slideToggle( 'fast' );
    })

	var cache = {};
	$body.on( 'click', '.add-content-block', function(e){
		var $this = $(this),
			$adder = $this.closest('.content-block-adder'),
			area = $adder.data('tenupArea'),
			row = $this.parents( '.row' ).index(),
			column = $this.parents( '.block' ).data( 'tenupColumn' ),
			iterator = $adder.data('tenupIterator'),
			$toggle = $adder.find('.toggle'),
			type = $this.siblings('[name=new_content_block]').val(),
			template;

			if ( type in cache ) {
				template = cache[type];
			} else {
				template = cache[type] = $('#tmpl-tenup-cb-' + type).html()
			}

		// Hard-coded instance of area support
		template = template.replace( /\{{{area}}}/g, area );
		template = template.replace( /\{{{row}}}/g, row );
		template = template.replace( /\{{{column}}}/g, column );
		template = template.replace( /\{{{iterator}}}/g, iterator );
		$adder.data('tenupIterator', iterator + 1);

		$added = $( template ).insertBefore($adder);

		// Example of initializing a JS widget on add
		$added.find('.post-finder').postFinder();

		$toggle.click();

		e.preventDefault();
	});

	$body.on('click', '.content-block-header', function(e){
		$(this).parent('.content-block').toggleClass('collapsed');
	});

	$body.on('click', '.delete-content-block', function(e){
		$(this).closest('.content-block').remove();
		e.preventDefault();
	});

	$body.on( 'click', '.delete-row', function( e ) {
		$( this ).closest( '.row' ).remove();
		e.preventDefault();
	});

	// currently unused, but here as an example for putting the title in the content block title live
	$body.on('keyup', '.block-title', function(){
		$this = $(this);
		$this.closest('.interior').siblings('.content-block-header').find('.block-label').html( ': ' + $this.val() );
	});

	// Manual override switcher
	$body.on( 'change', '.toggle-manual input', function(e){
		e.preventDefault();
		var $this = $( this ),
		$toggle = $this.closest( '.toggle-manual' );

		$toggle.siblings( '.non-manual' ).slideToggle( 'fast' );
		$toggle.siblings( '.manual' ).slideToggle( 'fast' );
	});

	// Media uploader
	$body.on( 'click', '.select-image', function(e) {
		var $this = $(this),
			$image = $this.siblings('img');
			$field = $this.siblings('.image-id-input');

		e.preventDefault();

		// If the media frame already exists, reopen it.
		if ( frame ) {
			frame.open();
			return;
		}

		// Create the media frame.
		frame = wp.media.frames.chooseImage = wp.media({
			// Set the title of the modal.
			title: 'Choose an Image',

			// Tell the modal to show only images.
			library: {
				type: 'image'
			},

			// Customize the submit button.
			button: {
				// Set the text of the button.
				text: 'Select Image'
			}
		});

		// When an image is selected, run a callback.
		frame.on( 'select', function() {
			// Grab the selected attachment.
			var attachment = frame.state().get('selection').first(),
				sizes = attachment.get('sizes'),
				imageUrl = attachment.get('url');

			// Use thumbnail size if abailable for preview
			if ( "undefined" !== typeof sizes.thumbnail ) {
				imageUrl = sizes.thumbnail.url;
			}

			// set the hidden input's value
			$field.attr('value', attachment.id);

			// Show the image in the placeholder
			$image.attr('src', imageUrl);
		});

		frame.open();
	});

	$body.on( 'click', '.remove-image', function(e) {
		var $this = $(this),
			$image = $this.siblings('img'),
			$field = $this.siblings('.image-id-input');

		e.preventDefault();

		$image.attr('src', '');
		$field.attr('value', '');
	});

	$body.on( 'click', '.new h3', function( e ) {
		var p = $( this ).parent( '.postbox' );
		p.toggleClass( 'closed' );
	});

	$( '.ccb-choose-row a' ).on( 'click', onClickAddNewRow );
	$( '.delete-row' ).on( 'click', onClickRemoveRow );

	function onClickAddNewRow( e ) {
		e.preventDefault();

		var $target = $( '.ccb-add' ),
			$this = $( e.currentTarget ),
			type = $this.data( 'type' ),
			template;

		if ( type in cache ) {
			template = cache[type];
		} else {
			template = cache[type] = $( '#tmpl-tenup-cb-' + type ).html();
		}

		$target.before( template );
	}

	function onClickRemoveRow( e ) {
		e.preventDefault();
		$( this ).closest( '.row' ).remove();
	}

	$(document).ready(function() { $( '.select2' ).select2({ width: 200 }); });

})(jQuery);
