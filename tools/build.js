({
    baseUrl: '../',
    paths: {
        GlitchImg: 'src/glitch-img'
    },
    include: ['tools/almond', 'GlitchImg'],
    out: '../dist/glitch-img.min.js',
    wrap: {
        startFile: 'wrap.start',
        endFile: 'wrap.end'
    }
})
