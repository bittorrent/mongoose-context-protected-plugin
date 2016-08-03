'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.initConfig({
        mochaTest: {
            files: ['test/**/*.js'],
            options: {
                run: true
            }
        },
        jshint: {
            options: {
                node: false,
                browser: false,
                esnext: true,
                bitwise: true,
                camelcase: false,
                curly: true,
                eqeqeq: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: 'single',
                regexp: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                smarttabs: false,
                globalstrict: true,
                globals: {
                    require: false,
                    before: false,
                    after: false,
                    beforeEach: false,
                    afterEach: false,
                    it: false,
                    describe: false,
                    define: true,
                    module: false,
                    exports: false,
                    process: false,
                    setImmediate: false,
                    setTimeout: false,
                    setInterval: false,
                    clearTimeout: false,
                    clearInterval: false,
                    escape: false,
                    unescape: false,
                    __dirname: false,
                    Buffer: false
                }
            },
            files: ['**/*.js', '!node_modules/**/*']
        }
    });

    grunt.registerTask('default', ['jshint', 'mochaTest']);
};
