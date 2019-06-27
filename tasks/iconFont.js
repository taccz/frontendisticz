const config = require('./helpers/getConfig.js');

const {src, dest} = require('gulp');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const rename = require('gulp-rename');


module.exports = function iconFont(callback) {
	var isEmpty = true;

	src([
		'*.svg',
		'!_no-delete.svg',
	], {
		cwd: config.src.icons,
	})
		.pipe(iconfont({
			fontName: 'icons',
			formats: ['ttf', 'eot', 'woff'],
		}))
		.on('glyphs', function(glyphs, options) {
			isEmpty = false;

			src(config.src.styles + 'tpl/icons.css.tpl')
				.pipe(consolidate('lodash', {
					glyphs: glyphs.map(function(glyph) {
						return {
							name: glyph.name,
							code: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase(),
						};
					}),
					fontName: options.fontName,
					fontPath: config.assets.fonts,
					className: 'icon',
				}))
				.pipe(rename('icons.scss'))
				.pipe(dest(config.src.styles + 'core/generated/'))
				.on('end', callback);
		})
		.on('end', function() {
			if (isEmpty) {
				callback();
			}
		})
		.pipe(dest(config.dest.fonts));
};
