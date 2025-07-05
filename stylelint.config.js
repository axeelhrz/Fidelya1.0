module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order'
  ],
  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-high-performance-animation'
  ],
  rules: {
    // Reglas para prevenir duplicados y mejorar mantenibilidad
    'no-duplicate-selectors': true,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values']
      }
    ],
    
    // Reglas de especificidad
    'selector-max-specificity': '0,4,0',
    'selector-max-id': 1,
    'selector-max-class': 4,
    'selector-max-compound-selectors': 4,
    
    // Reglas para !important
    'declaration-no-important': null, // Permitir pero reportar
    'keyframe-declaration-no-important': true,
    
    // Reglas de rendimiento
    'plugin/declaration-block-no-ignored-properties': true,
    'plugin/no-low-performance-animation-properties': [
      true,
      {
        ignore: ['transform', 'opacity']
      }
    ],
    
    // Reglas para propiedades obsoletas
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          // Permitir propiedades CSS personalizadas
          '/^--/',
          // Permitir propiedades específicas de webkit temporalmente
          '-webkit-overflow-scrolling',
          '-webkit-tap-highlight-color',
          '-webkit-touch-callout'
        ]
      }
    ],
    
    // Reglas para valores
    'color-no-invalid-hex': true,
    'function-calc-no-invalid': true,
    'unit-no-unknown': true,
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: ['box', 'inline-box']
      }
    ],
    
    // Reglas para selectores
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements']
      }
    ],
    
    // Reglas para media queries
    'media-feature-name-no-unknown': true,
    'media-feature-name-no-vendor-prefix': true,
    
    // Reglas de formato y consistencia
    'indentation': 2,
    'max-line-length': 120,
    'no-eol-whitespace': true,
    'no-missing-end-of-source-newline': true,
    
    // Reglas para comentarios
    'comment-no-empty': true,
    'comment-whitespace-inside': 'always',
    
    // Reglas específicas para mobile-first
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'supports',
          'media',
          'keyframes',
          'import',
          'charset'
        ]
      }
    ],
    
    // Reglas para optimización
    'shorthand-property-no-redundant-values': true,
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['flex', 'grid']
      }
    ],
    
    // Reglas para accesibilidad
    'color-contrast': null, // Deshabilitado por ahora, requiere configuración adicional
    
    // Reglas personalizadas para StarFlex
    'custom-property-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(__[a-z0-9]+)*(--[a-z0-9]+)*$',
      {
        message: 'Usar metodología BEM para nombres de clases'
      }
    ],
    
    // Reglas para variables CSS
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block']
      }
    ]
  },
  
  // Ignorar archivos específicos
  ignoreFiles: [
    'dist/**/*.css',
    'node_modules/**/*.css',
    'css-modules/**/*.css'
  ],
  
  // Configuración para diferentes tipos de archivos
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss'
    }
  ]
};
