
require.config({
	paths: {
        glitchImg: 'glitch-img'
    }
});

require( ['glitchImg'], function(glitchImg) {

    var glitch1 = new glitchImg('#glitch1'),
        glitch2 = new glitchImg('#glitch2');

});
