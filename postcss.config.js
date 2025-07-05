const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');

module.exports = (ctx) => {
  const isProduction = ctx.env === 'production';
  
  return {
    map: !isProduction ? { inline: false } : false,
    plugins: [
      // Autoprefixer para compatibilidad cross-browser
      autoprefixer({
        overrideBrowserslist: [
          '> 1%',
          'last 2 versions',
          'iOS >= 12',
          'Android >= 8',
          'Safari >= 12',
          'Chrome >= 80',
          'Firefox >= 75',
          'Edge >= 80',
          'not dead'
        ],
        grid: 'autoplace',
        flexbox: 'no-2009',
        remove: true // Remover prefijos obsoletos
      }),
      
      // PurgeCSS solo en producción
      ...(isProduction ? [
        purgecss({
          content: [
            './index.html',
            './js/**/*.js',
            './scripts/**/*.js'
          ],
          defaultExtractor: content => {
            // Extractor personalizado para capturar clases dinámicas
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
            const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
            return broadMatches.concat(innerMatches);
          },
          safelist: {
            // Clases que siempre deben mantenerse
            standard: [
              'active',
              'loading',
              'loaded',
              'error',
              'visible',
              'hidden',
              'open',
              'closed',
              'expanded',
              'collapsed',
              'in-view',
              'no-scroll',
              'nav-menu-open',
              'mobile-only',
              'desktop-only'
            ],
            // Patrones de clases dinámicas
            deep: [
              /^nav__/,
              /^hero__/,
              /^features__/,
              /^feature__/,
              /^videos__/,
              /^faq__/,
              /^contact__/,
              /^btn/,
              /^language-/,
              /^floating-/,
              /^phone/,
              /^download-/,
              /^image-optimized/
            ],
            // Clases con modificadores BEM
            greedy: [
              /^.*--.*$/,
              /^.*__.*$/,
              /^data-/,
              /^aria-/
            ]
          },
          // Variables CSS que deben mantenerse
          variables: true,
          keyframes: true,
          fontFace: true
        })
      ] : []),
      
      // Minificación solo en producción
      ...(isProduction ? [
        cssnano({
          preset: ['advanced', {
            discardComments: {
              removeAll: true
            },
            reduceIdents: false, // Mantener nombres de animaciones
            zindex: false, // No optimizar z-index
            autoprefixer: false, // Ya lo manejamos arriba
            cssDeclarationSorter: false, // Mantener orden de Stylelint
            normalizeWhitespace: true,
            colormin: true,
            convertValues: {
              length: false // Mantener unidades específicas para móvil
            },
            calc: {
              precision: 3
            },
            mergeLonghand: false, // Mantener propiedades específicas para debugging
            mergeRules: true,
            minifyFontValues: true,
            minifyGradients: true,
            minifyParams: true,
            minifySelectors: true,
            normalizeCharset: true,
            normalizeDisplayValues: true,
            normalizePositions: true,
            normalizeRepeatStyle: true,
            normalizeString: true,
            normalizeTimingFunctions: true,
            normalizeUnicode: true,
            normalizeUrl: true,
            orderedValues: true,
            reduceInitial: true,
            reduceTransforms: true,
            svgo: true,
            uniqueSelectors: true
          }]
        })
      ] : [])
    ]
  };
};
