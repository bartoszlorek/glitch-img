
require.config({
	paths: {
        glitchImg: 'glitch-img',
        aframe: 'http://cdn.rawgit.com/ubery/aframe/master/src/aframe'
    }
});

require( ['glitchImg', 'aframe'], function(GlitchImg, aframe) {

    var glitch1 = new GlitchImg('#glitch1'),
        glitch2 = new GlitchImg('#glitch2');

    // animate glitching by regular update
    aframe.setInterval(function() {
        glitch1.update();
    }, 100);


    /*var glitch = new GlitchImg();

    // add images after while
    aframe.setTimeout(function() {
        glitch
            .add('#glitch1')
            .add('#glitch2');
        console.log(glitch);
    }, 2000);

    aframe.setInterval(function() {
        glitch.update();
    }, 100);*/


});