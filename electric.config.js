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
        branch: 'gh-pages'
      }
    }
  },
	vendorSrc: ['node_modules/marble/build/fonts/**']
};
