(function ($) {
    $.extend($.fn, {
        magnifyIt: function (options) {
            var settings = $.extend({
                // zoomedImagelocation: 'left'
                //...   other options 
            }, options);
            var updateLensPosition = function (mouseLeft, mouseTop, $wrapper) {

                var lensLeft = (mouseLeft - ($wrapper.find('[data-zoomer-role="lensBx"]').width() / 2));
                var lensTop = (mouseTop - ($wrapper.find('[data-zoomer-role="lensBx"]').height() / 2))
                lensLeft = Math.max(lensLeft, 0);
                lensTop = Math.max(lensTop, 0);

                lensLeft = Math.min(
                    lensLeft,
                    ($wrapper.width() - $wrapper.find('[data-zoomer-role="lensBx"]').outerWidth())
                    );
                lensTop = Math.min(
                    lensTop,
                    ($wrapper.height() - $wrapper.find('[data-zoomer-role="lensBx"]').outerHeight())
                    );

                $wrapper.find('[data-zoomer-role="lensBx"]').css({
                    left: (lensLeft + "px"),
                    top: (lensTop + "px")
                });




                $wrapper.find('[data-zoomer-role="lensBxImage"]').css({
                    left: (-1 * (lensLeft + 5) + "px"),
                    top: (-1 * (lensTop + 5) + "px")
                });
            };
            var showSideZoomedArea = function (mouseLeft, mouseTop, $wrapper) {

                var $sideArea;
                if ($('[data-zoomer-role="sideArea"]').length != 0) {
                    $sideArea = $('[data-zoomer-role="sideArea"]');
                } else {
                    $sideArea = $('<div data-zoomer-role="sideArea"> </div>');
                }
                $sideArea.css({
                    left: $wrapper.find('[data-zoomer-role="image"]').width() + 30 + 'px' //$wrapper.offset().left + $wrapper.find('[data-zoomer-role="image"]').width() + 10 + 'px'
                   , top: 5 + 'px'// $wrapper.offset().top + 5 + 'px'
                   , position: 'absolute'
                    , overflow: 'hidden'
                   , opacity: 1
                    , border: '2px solid #888'
                    , boxShadow: '-0px -0px 10px rgba(0,0,0,0.40)'
                    , zIndex: '999'
                    , width: $wrapper.find('[data-zoomer-role="image"]').width() / (1.2)
                    , height: $wrapper.find('[data-zoomer-role="image"]').height() / (1.2)
                }).insertAfter($wrapper);
            }
            var Magnify = function (lensLeft, lensTop, $wrapper) {
                var imgData = $wrapper.find('[data-zoomer-role="image"]').data();

                imgData.width =
                    ($wrapper.find('[data-zoomer-role="image"]').width() * 2.5);

                imgData.height =
                    ($wrapper.find('[data-zoomer-role="image"]').height() * 2.5);

                $('[data-zoomer-role="sideArea"]').empty();
                var $zoomedResult = $wrapper.find('[data-zoomer-role="image"]').clone();
                $zoomedResult.appendTo($('[data-zoomer-role="sideArea"]'))
                $zoomedResult.css(
                    {
                        width: imgData.width,
                        height: imgData.height,
                        left: ((imgData.left - lensLeft) * 2.5),
                        top: ((imgData.top - lensTop) * 2.5)
                    }
                );



            };
            var clearLens = function ($wrapper) {
                var imgData = $wrapper.find('[data-zoomer-role="image"]').data();
                imgData.zoom = 1;
                imgData.top = 0;
                imgData.left = 0;
                imgData.width = imgData.originalWidth;
                imgData.height = imgData.originalHeight;
                $wrapper.find('[data-zoomer-role="image"]').animate(
                    {
                        width: imgData.width,
                        height: imgData.height,
                        left: imgData.left,
                        top: imgData.top
                    },
                    300
                );
            };
            var initializeCtrls = function ($ctrl) {
                
                var $wrapper = $('<div  data-zoomer-role="wrapper"  style="border: 1px solid #333333; overflow: hidden; position: relative;float:left; "></div>');
                var $blanker = $('<div  data-zoomer-role="blanker" style=" opacity: 0.45; display: none; background-color: rgb(255, 255, 255);"></div>');
                var $lensBx = $('<div  data-zoomer-role="lensBx" style="display: block;overflow: hidden;position: absolute;display: none; z-index: 100; border: 5px solid #888; box-shadow: -0px -0px 10px rgba(0,0,0,0.40);cursor: cell;"> </div>');
                var $lensBxImage = $('<img data-zoomer-role="lensBxImage" style="position: absolute;" />');


                $wrapper.width($ctrl[0].width).height($ctrl[0].height);
                $ctrl.css({ position: 'absolute', display: 'block', 'max-width': 'none' }).attr('data-zoomer-role', 'image').wrap($wrapper);

                $ctrl.width($wrapper.width()).height($wrapper.height());


                $lensBx.width(Math.floor($ctrl.width() / 3)).height(Math.floor($ctrl.height() / 3));

                $lensBxImage.width($ctrl.width()).height($ctrl.height()).attr('src', $ctrl.attr('src')).css({
                    left: (-1 * ($lensBx.offset().left + 5) + "px"),
                    top: (-1 * ($lensBx.offset().top + 5) + "px")
                }).appendTo($lensBx);

                $ctrl.data({
                    zoomFactor: ($wrapper.width() / $lensBx.width()),
                    zoom: 1,
                    top: 0,
                    left: 0,
                    width: $ctrl.width(),
                    height: $ctrl.height(),
                    originalWidth: $ctrl.width(),
                    originalHeight: $ctrl.height()
                });


                $blanker.css({
                    left: ($ctrl.offset().left + "px"),
                    top: ($ctrl.offset().top + "px")
                }).width($ctrl.width()).height($ctrl.height()).insertAfter($ctrl);
                $lensBx.insertAfter($ctrl);
                registerCtrlEvents($wrapper);

            }
            var registerCtrlEvents = function () {

                $('[data-zoomer-role="wrapper"]').find('[data-zoomer-role="lensBx"]').mousemove(
                   function (event) {

                       event.preventDefault();
                       Magnify(
                           $(this).position().left,
                           $(this).position().top
                       , $(this).parent());
                   }
               );

                $('[data-zoomer-role="wrapper"]').hover(
                    function (event) {
                        $(this).find('[data-zoomer-role="lensBx"]').show();
                        $(this).find('[data-zoomer-role="blanker"]').show();
                    },
                    function (event) {
                        $(this).find('[data-zoomer-role="lensBx"]').hide();
                        $(this).find('[data-zoomer-role="blanker"]').hide();
                        $('[data-zoomer-role="sideArea"]').remove();
                    }
                );



                $('[data-zoomer-role="wrapper"]').mousemove(
                    function (event) {

                        var wScrollTop = $(window).scrollTop();
                        var wScrollLeft = $(window).scrollLeft();
                        var mouseLeft = Math.floor(event.clientX - $(this).offset().left + wScrollLeft);
                        var mouseTop = Math.floor(event.clientY - $(this).offset().top + wScrollTop);
                        updateLensPosition(mouseLeft, mouseTop, $(this));

                        showSideZoomedArea(mouseLeft, mouseTop, $(this));
                    }
                );

                $('[data-zoomer-role="wrapper"]').mouseout(function () {

                    clearLens($(this));
                })

            }
            return this.each(function () {
                initializeCtrls($(this));

            });




        }
    });
})(jQuery);
