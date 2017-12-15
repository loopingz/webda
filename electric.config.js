'use strict';
var marble = require('marble');

module.exports = {
  metalComponents: ['electric-marble-components'],
  sassOptions: {
    includePaths: ['node_modules', marble.src]
  },
  envOptions: {
    website: {
      basePath: '/'
    },
    ghpages: {
      basePath: '/webda',
      deployOptions: {
        branch: 'gh-pages',
        repo: 'https://' + process.env['GH_TOKEN'] + '@github.com/loopingz/webda.git'
      }
    }
  },
  vendorSrc: ['node_modules/marble/build/fonts/**']
};
