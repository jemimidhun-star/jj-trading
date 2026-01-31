/*
	Landed by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch mode.
		if (browser.mobile)
			$body.addClass('is-touch');

	// Scrolly links.
		$('.scrolly').scrolly({
			speed: 2000
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			alignment: 'right',
			hideDelay: 350
		});

	// Nav.

		// Title Bar.
			$(
				'<div id="titleBar">' +
					'<a href="#navPanel" class="toggle"></a>' +
					'<span class="title">' + $('#logo').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

	// Parallax.
	// Disabled on IE (choppy scrolling) and mobile platforms (poor performance).
		if (browser.name == 'ie'
		||	browser.mobile) {

			$.fn._parallax = function() {

				return $(this);

			};

		}
		else {

			$.fn._parallax = function() {

				$(this).each(function() {

					var $this = $(this),
						on, off;

					on = function() {

						$this
							.css('background-position', 'center 0px');

						$window
							.on('scroll._parallax', function() {

								var pos = parseInt($window.scrollTop()) - parseInt($this.position().top);

								$this.css('background-position', 'center ' + (pos * -0.15) + 'px');

							});

					};

					off = function() {

						$this
							.css('background-position', '');

						$window
							.off('scroll._parallax');

					};

					breakpoints.on('<=medium', off);
					breakpoints.on('>medium', on);

				});

				return $(this);

			};

			$window
				.on('load resize', function() {
					$window.trigger('scroll');
				});

		}

	// Spotlights.
		var $spotlights = $('.spotlight');

		$spotlights
			._parallax()
			.each(function() {

				var $this = $(this),
					on, off;

				on = function() {

					var top, bottom, mode;

					// Use main <img>'s src as this spotlight's background.
						$this.css('background-image', 'url("' + $this.find('.image.main > img').attr('src') + '")');

					// Side-specific scrollex tweaks.
						if ($this.hasClass('top')) {

							mode = 'top';
							top = '-20%';
							bottom = 0;

						}
						else if ($this.hasClass('bottom')) {

							mode = 'bottom-only';
							top = 0;
							bottom = '20%';

						}
						else {

							mode = 'middle';
							top = 0;
							bottom = 0;

						}

					// Add scrollex.
						$this.scrollex({
							mode:		mode,
							top:		top,
							bottom:		bottom,
							initialize:	function(t) { $this.addClass('inactive'); },
							terminate:	function(t) { $this.removeClass('inactive'); },
							enter:		function(t) { $this.removeClass('inactive'); },

							// Uncomment the line below to "rewind" when this spotlight scrolls out of view.

							//leave:	function(t) { $this.addClass('inactive'); },

						});

				};

				off = function() {

					// Clear spotlight's background.
						$this.css('background-image', '');

					// Remove scrollex.
						$this.unscrollex();

				};

				breakpoints.on('<=medium', off);
				breakpoints.on('>medium', on);

			});

	// Wrappers.
		var $wrappers = $('.wrapper');

		$wrappers
			.each(function() {

				var $this = $(this),
					on, off;

				on = function() {

					$this.scrollex({
						top:		250,
						bottom:		0,
						initialize:	function(t) { $this.addClass('inactive'); },
						terminate:	function(t) { $this.removeClass('inactive'); },
						enter:		function(t) { $this.removeClass('inactive'); },

						// Uncomment the line below to "rewind" when this wrapper scrolls out of view.

						//leave:	function(t) { $this.addClass('inactive'); },

					});

				};

				off = function() {
					$this.unscrollex();
				};

				breakpoints.on('<=medium', off);
				breakpoints.on('>medium', on);

			});

	// Banner.
		var $banner = $('#banner');

		$banner
			._parallax();

})(jQuery);

const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let items = Array.from(document.querySelectorAll('.item'));

let index = 0;
let startX = 0;
let currentTranslate = 0;
let isDragging = false;

function itemsPerView() {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  if (window.innerWidth <= 1024) return 3;
  return 4;
}

/* ---------- INFINITE CLONE SETUP ---------- */
function setupInfinite() {
  const perView = itemsPerView();
  const cloneStart = items.slice(0, perView).map(el => el.cloneNode(true));
  const cloneEnd = items.slice(-perView).map(el => el.cloneNode(true));

  cloneStart.forEach(clone => track.appendChild(clone));
  cloneEnd.forEach(clone => track.insertBefore(clone, track.firstChild));

  items = Array.from(document.querySelectorAll('.item'));
  index = perView;

  updatePosition(false);
}

function updatePosition(animate = true) {
  const itemWidth = items[0].getBoundingClientRect().width;
  track.style.transition = animate ? 'transform 0.6s ease' : 'none';
  track.style.transform = `translateX(-${index * itemWidth}px)`;
}

/* ---------- BUTTON NAV ---------- */
nextBtn.onclick = () => {
  index++;
  updatePosition();

  checkInfinite();
};

prevBtn.onclick = () => {
  index--;
  updatePosition();

  checkInfinite();
};

function checkInfinite() {
  const perView = itemsPerView();
  const totalItems = items.length;

  setTimeout(() => {
    if (index >= totalItems - perView) {
      index = perView;
      updatePosition(false);
    }

    if (index <= 0) {
      index = totalItems - perView * 2;
      updatePosition(false);
    }
  }, 600);
}

/* ---------- TOUCH / SWIPE ---------- */
track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

track.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const diff = startX - e.touches[0].clientX;
  track.style.transform = `translateX(-${index * items[0].offsetWidth + diff}px)`;
});

track.addEventListener('touchend', e => {
  isDragging = false;
  const diff = startX - e.changedTouches[0].clientX;

  if (diff > 50) nextBtn.click();
  else if (diff < -50) prevBtn.click();
  else updatePosition();
});

/* ---------- INIT ---------- */
setupInfinite();
window.addEventListener('resize', () => {
  track.innerHTML = '';
  items.forEach(item => track.appendChild(item));
  setupInfinite();
});