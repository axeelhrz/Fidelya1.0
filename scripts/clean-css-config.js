const CleanCSS = require('clean-css');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class CSSMinifier {
    constructor() {
        this.cleanCSS = new CleanCSS({
            level: {
                1: {
                    // Nivel 1: Optimizaciones básicas
                    cleanupCharsets: true,
                    normalizeUrls: true,
                    optimizeBackground: true,
                    optimizeBorderRadius: true,
                    optimizeFilter: true,
                    optimizeFont: true,
                    optimizeFontWeight: true,
                    optimizeOutline: true,
                    removeEmpty: true,
                    removeNegativePaddings: true,
                    removeQuotes: true,
                    removeWhitespace: true,
                    replaceMultipleZeros: true,
                    replaceTimeUnits: true,
                    replaceZeroUnits: true,
                    roundingPrecision: 3,
                    selectorsSortingMethod: 'standard',
                    specialComments: 0,
                    tidyAtRules: true,
                    tidyBlockScopes: true,
                    tidySelectors: true,
                    transform: function (propertyName, propertyValue) {
                        // Transformaciones personalizadas para StarFlex
                        if (propertyName === 'background-image' && propertyValue.includes('linear-gradient')) {
                            // Optimizar gradientes lineales
                            return propertyValue.replace(/\s+/g, ' ');
                        }
                        return propertyValue;
                    }
                },
                2: {
                    // Nivel 2: Optimizaciones estructurales
                    mergeAdjacentRules: true,
                    mergeIntoShorthands: true,
                    mergeMedia: true,
                    mergeNonAdjacentRules: true,
                    mergeSemantically: false, // Mantener semántica para debugging
                    overrideProperties: true,
                    removeEmpty: true,
                    reduceNonAdjacentRules: true,
                    removeDuplicateFontRules: true,
                    removeDuplicateMediaBlocks: true,
                    removeDuplicateRules: true,
                    removeUnusedAtRules: false, // Mantener @keyframes aunque no se usen directamente
                    restructureRules: true,
                    skipProperties: [
                        // Propiedades que no deben ser optimizadas para mantener compatibilidad móvil
                        '-webkit-overflow-scrolling',
                        '-webkit-tap-highlight-color',
                        '-webkit-touch-callout',
                        'touch-action'
                    ]
                }
            },
            format: {
                breaks: {
                    afterAtRule: false,
                    afterBlockBegins: false,
                    afterBlockEnds: false,
                    afterComment: false,
                    afterProperty: false,
                    afterRuleBegins: false,
                    afterRuleEnds: false,
                    beforeBlockEnds: false,
                    betweenSelectors: false
                },
                breakWith: '',
                indentBy: 0,
                indentWith: '',
                spaces: {
                    aroundSelectorRelation: false,
                    beforeBlockBegins: false,
                    beforeValue: false
                },
                wrapAt: false
            },
            inline: false,
            rebase: false,
            returnPromise: false,
            sourceMap: false,
            sourceMapInlineSources: false
        });
    }

    async minifyFile(inputPath, outputPath) {
        console.log(chalk.blue(`🗜️  Minificando: ${inputPath}`));
        
        const cssContent = await fs.readFile(inputPath, 'utf8');
        const originalSize = Buffer.byteLength(cssContent, 'utf8');
        
        const result = this.cleanCSS.minify(cssContent);
        
        if (result.errors.length > 0) {
            console.error(chalk.red('❌ Errores durante la minificación:'));
            result.errors.forEach(error => {
                console.error(chalk.red(`  • ${error}`));
            });
            throw new Error('Errores en la minificación');
        }
        
        if (result.warnings.length > 0) {
            console.warn(chalk.yellow('⚠️  Advertencias durante la minificación:'));
            result.warnings.forEach(warning => {
                console.warn(chalk.yellow(`  • ${warning}`));
            });
        }
        
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, result.styles);
        
        const minifiedSize = Buffer.byteLength(result.styles, 'utf8');
        const savings = originalSize - minifiedSize;
        const percentage = ((savings / originalSize) * 100).toFixed(2);
        
        console.log(chalk.green(`✅ Minificación completada:`));
        console.log(chalk.cyan(`  📏 Tamaño original: ${this.formatBytes(originalSize)}`));
        console.log(chalk.cyan(`  📏 Tamaño minificado: ${this.formatBytes(minifiedSize)}`));
        console.log(chalk.cyan(`  💾 Ahorro: ${this.formatBytes(savings)} (${percentage}%)`));
        
        return {
            originalSize,
            minifiedSize,
            savings,
            percentage: parseFloat(percentage),
            stats: result.stats
        };
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async generateComparison(originalPath, minifiedPath, outputPath) {
        const original = await fs.readFile(originalPath, 'utf8');
        const minified = await fs.readFile(minifiedPath, 'utf8');
        
        const comparison = {
            timestamp: new Date().toISOString(),
            files: {
                original: {
                    path: originalPath,
                    size: Buffer.byteLength(original, 'utf8'),
                    lines: original.split('\n').length,
                    rules: (original.match(/{/g) || []).length
                },
                minified: {
                    path: minifiedPath,
                    size: Buffer.byteLength(minified, 'utf8'),
                    lines: minified.split('\n').length,
                    rules: (minified.match(/{/g) || []).length
                }
            },
            savings: {
                bytes: 0,
                percentage: 0,
                lines: 0,
                linesPercentage: 0
            }
        };
        
        comparison.savings.bytes = comparison.files.original.size - comparison.files.minified.size;
        comparison.savings.percentage = ((comparison.savings.bytes / comparison.files.original.size) * 100).toFixed(2);
        comparison.savings.lines = comparison.files.original.lines - comparison.files.minified.lines;
        comparison.savings.linesPercentage = ((comparison.savings.lines / comparison.files.original.lines) * 100).toFixed(2);
        
        await fs.writeJson(outputPath, comparison, { spaces: 2 });
        
        return comparison;
    }
}

module.exports = CSSMinifier;
