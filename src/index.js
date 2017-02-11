
require.config({
	paths: {
        glitchSVG: 'glitch-svg'
    }
});

require( ['glitchSVG'], function(glitchSVG) {

    var glitch = new glitchSVG().add('glitch');

});
