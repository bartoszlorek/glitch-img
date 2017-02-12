
require.config({
	paths: {
        glitchImg: 'glitch-img',
        aframe: 'http://cdn.rawgit.com/ubery/aframe/master/src/aframe'
    }
});

require( ['glitchImg', 'aframe'], function(glitchImg, aframe) {

    var glitch1 = new glitchImg('#glitch1'),
        glitch2 = new glitchImg('#glitch2');

    // animate glitching by regular update
    aframe.setInterval(function() {
        glitch1.update();
    }, 100);

    // add another image after while
    /*aframe.setTimeout(function() {
        glitch1.add('#glitch2');
        console.log( glitch1 );
    }, 2000);*/

    // add image from second to first glitch
    aframe.setTimeout(function() {
        glitch1.add('#glitch2');
    }, 2000);

});