document.addEventListener( 'DOMContentLoaded', function () {

	// ── Star field (3-layer scrolling + mouse parallax) ─────────────────────
	var starLayerCfg = [
		{ id: 'star-layer-1', count: 280, size: 1,   dur: 120 },
		{ id: 'star-layer-2', count: 80,  size: 1.5, dur: 200 },
		{ id: 'star-layer-3', count: 35,  size: 2,   dur: 300 },
	];

	function makeStarShadow( count, size ) {
		var parts = [];
		for ( var i = 0; i < count; i++ ) {
			var x = Math.floor( Math.random() * 2000 );
			var y = Math.floor( Math.random() * 2000 );
			parts.push( x + 'px ' + y + 'px 0 ' + ( size / 2 ) + 'px rgba(224,238,255,0.9)' );
		}
		return parts.join( ',' );
	}

	starLayerCfg.forEach( function ( cfg ) {
		var layer = document.getElementById( cfg.id );
		if ( ! layer ) { return; }

		var shadow = makeStarShadow( cfg.count, cfg.size );

		// Two copies of the star field stacked so the scroll loops seamlessly.
		[ 0, 2000 ].forEach( function ( offsetY ) {
			var dot = document.createElement( 'div' );
			dot.className = 'star-dot';
			dot.style.cssText =
				'width:'      + cfg.size + 'px;' +
				'height:'     + cfg.size + 'px;' +
				'top:'        + offsetY  + 'px;' +
				'box-shadow:' + shadow   + ';';
			layer.appendChild( dot );
		} );

		layer.style.setProperty( '--star-dur', cfg.dur + 's' );
	} );

	// ── Mouse parallax with spring smoothing ────────────────────────────────
	var starsWrap = document.getElementById( 'stars-bg' );
	var heroEl    = document.querySelector( '.hero' );

	if ( starsWrap && heroEl ) {
		var spX = 0, spY = 0, tX = 0, tY = 0;
		var factor = 0.04;

		heroEl.addEventListener( 'mousemove', function ( e ) {
			tX = -( e.clientX - window.innerWidth  / 2 ) * factor;
			tY = -( e.clientY - window.innerHeight / 2 ) * factor;
		} );

		( function tick() {
			spX += ( tX - spX ) * 0.06;
			spY += ( tY - spY ) * 0.06;
			starsWrap.style.transform = 'translate(' + spX.toFixed(2) + 'px,' + spY.toFixed(2) + 'px)';
			requestAnimationFrame( tick );
		}() );
	}

	// ── Scroll reveal ───────────────────────────────────────────────────────
	var obs = new IntersectionObserver( function ( entries ) {
		entries.forEach( function ( e ) {
			if ( e.isIntersecting ) {
				e.target.classList.add( 'visible' );
				obs.unobserve( e.target );
			}
		} );
	}, { threshold: 0.1 } );

	document.querySelectorAll( '.reveal' ).forEach( function ( r ) {
		obs.observe( r );
	} );

	// ── Hamburger toggle ────────────────────────────────────────────────────
	var hamburger = document.querySelector( '.hamburger' );
	var navUl     = document.querySelector( 'nav ul' );

	if ( hamburger && navUl ) {
		hamburger.addEventListener( 'click', function () {
			navUl.classList.toggle( 'nav-open' );
		} );

		// Support keyboard activation (Enter / Space).
		hamburger.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				navUl.classList.toggle( 'nav-open' );
			}
		} );

		// Close the mobile menu when any nav link is clicked.
		navUl.querySelectorAll( 'a' ).forEach( function ( a ) {
			a.addEventListener( 'click', function () {
				navUl.classList.remove( 'nav-open' );
			} );
		} );
	}

	// ── Formspree async submit ──────────────────────────────────────────────
	// Exposed on window so the form's onsubmit="handleSubmit(event)" can reach it.
	window.handleSubmit = async function ( e ) {
		e.preventDefault();
		var form = e.target;
		var btn  = form.querySelector( 'button[type="submit"]' );
		btn.textContent = 'Sending\u2026';
		btn.disabled    = true;

		try {
			var res = await fetch( 'https://formspree.io/f/xzdaqwlo', {
				method:  'POST',
				headers: { 'Accept': 'application/json' },
				body:    new FormData( form ),
			} );

			if ( res.ok ) {
				form.style.display = 'none';
				var successEl = document.getElementById( 'form-success' );
				if ( successEl ) {
					successEl.style.display = 'block';
				}
			} else {
				btn.textContent = 'Send Message';
				btn.disabled    = false;
				alert( 'Something went wrong. Please try again or email us directly.' );
			}
		} catch ( err ) {
			btn.textContent = 'Send Message';
			btn.disabled    = false;
			alert( 'Something went wrong. Please check your connection and try again.' );
		}
	};

} );
