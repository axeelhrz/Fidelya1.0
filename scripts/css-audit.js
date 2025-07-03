const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { parse } = require('css-tree');

class CSSAuditor {
    constructor() {
        this.results = {
            totalLines: 0,
            totalRules: 0,
            totalDeclarations: 0,
            duplicateSelectors: [],
            duplicateDeclarations: [],
            longSelectors: [],
            importantUsage: [],
            obsoleteProperties: [],
            unusedPrefixes: [],
            performanceIssues: [],
            specificityIssues: [],
            mediaQueryIssues: []
        };
        
        this.obsoleteProps = [
            'filter', 'zoom', '-ms-filter', '-webkit-box-reflect',
            'behavior', 'expression', '-moz-binding'
        ];
        
        this.unnecessaryPrefixes = [
            '-webkit-border-radius', '-moz-border-radius',
            '-webkit-box-shadow', '-moz-box-shadow',
            '-webkit-transition', '-moz-transition', '-o-transition',
            '-webkit-transform', '-moz-transform', '-o-transform'
        ];
    }

    async auditFile(filePath) {
        console.log(chalk.blue(`🔍 Auditando: ${filePath}`));
        
        const cssContent = await fs.readFile(filePath, 'utf8');
        this.results.totalLines = cssContent.split('\n').length;
        
        try {
            const ast = parse(cssContent);
            this.analyzeAST(ast, cssContent);
            return this.generateReport();
        } catch (error) {
            console.error(chalk.red(`Error parseando CSS: ${error.message}`));
            return null;
        }
    }

    analyzeAST(ast, cssContent) {
        const selectors = new Map();
        const declarations = new Map();
        
        ast.children.forEach(node => {
            if (node.type === 'Rule') {
                this.results.totalRules++;
                this.analyzeRule(node, selectors, declarations);
            } else if (node.type === 'Atrule' && node.name === 'media') {
                this.analyzeMediaQuery(node);
            }
        });
        
        this.findDuplicates(selectors, declarations);
        this.analyzeImportantUsage(cssContent);
    }

    analyzeRule(rule, selectors, declarations) {
        // Analizar selectores
        const selectorText = this.getSelectorText(rule.prelude);
        
        if (selectors.has(selectorText)) {
            selectors.get(selectorText).count++;
        } else {
            selectors.set(selectorText, { count: 1, node: rule });
        }
        
        // Verificar longitud del selector
        if (selectorText.length > 100) {
            this.results.longSelectors.push({
                selector: selectorText,
                length: selectorText.length
            });
        }
        
        // Verificar especificidad
        const specificity = this.calculateSpecificity(selectorText);
        if (specificity > 100) {
            this.results.specificityIssues.push({
                selector: selectorText,
                specificity: specificity
            });
        }
        
        // Analizar declaraciones
        if (rule.block && rule.block.children) {
            rule.block.children.forEach(declaration => {
                if (declaration.type === 'Declaration') {
                    this.results.totalDeclarations++;
                    this.analyzeDeclaration(declaration, declarations);
                }
            });
        }
    }

    analyzeDeclaration(declaration, declarations) {
        const prop = declaration.property;
        const value = this.getValueText(declaration.value);
        const key = `${prop}:${value}`;
        
        if (declarations.has(key)) {
            declarations.get(key).count++;
        } else {
            declarations.set(key, { count: 1, property: prop, value: value });
        }
        
        // Verificar propiedades obsoletas
        if (this.obsoleteProps.includes(prop)) {
            this.results.obsoleteProperties.push({
                property: prop,
                value: value
            });
        }
        
        // Verificar prefijos innecesarios
        if (this.unnecessaryPrefixes.includes(prop)) {
            this.results.unusedPrefixes.push({
                property: prop,
                value: value
            });
        }
        
        // Verificar problemas de rendimiento
        if (this.isPerformanceIssue(prop, value)) {
            this.results.performanceIssues.push({
                property: prop,
                value: value,
                issue: this.getPerformanceIssue(prop, value)
            });
        }
    }

    analyzeMediaQuery(mediaRule) {
        const mediaText = this.getMediaText(mediaRule.prelude);
        
        // Verificar media queries problemáticas
        if (mediaText.includes('max-device-width') || mediaText.includes('min-device-width')) {
            this.results.mediaQueryIssues.push({
                query: mediaText,
                issue: 'Uso de device-width obsoleto, usar width en su lugar'
            });
        }
    }

    findDuplicates(selectors, declarations) {
        // Encontrar selectores duplicados
        selectors.forEach((data, selector) => {
            if (data.count > 1) {
                this.results.duplicateSelectors.push({
                    selector: selector,
                    count: data.count
                });
            }
        });
        
        // Encontrar declaraciones duplicadas
        declarations.forEach((data, key) => {
            if (data.count > 3) { // Más de 3 usos puede indicar que debería ser una utility class
                this.results.duplicateDeclarations.push({
                    property: data.property,
                    value: data.value,
                    count: data.count
                });
            }
        });
    }

    analyzeImportantUsage(cssContent) {
        const importantMatches = cssContent.match(/!important/g);
        if (importantMatches) {
            this.results.importantUsage = [{
                count: importantMatches.length,
                percentage: ((importantMatches.length / this.results.totalDeclarations) * 100).toFixed(2)
            }];
        }
    }

    getSelectorText(prelude) {
        // Simplificado - en un caso real usarías css-tree para esto
        return prelude.children.map(child => {
            if (child.type === 'TypeSelector') return child.name;
            if (child.type === 'ClassSelector') return '.' + child.name;
            if (child.type === 'IdSelector') return '#' + child.name;
            return '';
        }).join('');
    }

    getValueText(value) {
        // Simplificado - extraer texto del valor
        if (value.type === 'Raw') return value.value;
        return value.children ? value.children.map(child => child.value || '').join(' ') : '';
    }

    getMediaText(prelude) {
        return prelude.children.map(child => child.value || '').join(' ');
    }

    calculateSpecificity(selector) {
        // Cálculo simplificado de especificidad
        const ids = (selector.match(/#/g) || []).length * 100;
        const classes = (selector.match(/\./g) || []).length * 10;
        const elements = (selector.match(/[a-z]/g) || []).length;
        return ids + classes + elements;
    }

    isPerformanceIssue(prop, value) {
        const performanceProps = ['box-shadow', 'filter', 'transform'];
        const expensiveValues = ['blur(', 'drop-shadow(', 'matrix3d('];
        
        return performanceProps.includes(prop) || 
               expensiveValues.some(expensive => value.includes(expensive));
    }

    getPerformanceIssue(prop, value) {
        if (prop === 'box-shadow' && value.includes('inset')) {
            return 'Múltiples box-shadows inset pueden afectar el rendimiento';
        }
        if (prop === 'filter' && value.includes('blur')) {
            return 'Filtros blur pueden ser costosos en dispositivos móviles';
        }
        return 'Propiedad que puede afectar el rendimiento';
    }

    generateReport() {
        const report = {
            summary: {
                totalLines: this.results.totalLines,
                totalRules: this.results.totalRules,
                totalDeclarations: this.results.totalDeclarations,
                duplicateSelectorsCount: this.results.duplicateSelectors.length,
                duplicateDeclarationsCount: this.results.duplicateDeclarations.length,
                importantUsage: this.results.importantUsage[0] || { count: 0, percentage: '0' }
            },
            issues: {
                critical: [],
                warning: [],
                info: []
            },
            recommendations: []
        };

        // Clasificar issues por severidad
        if (this.results.duplicateSelectors.length > 10) {
            report.issues.critical.push(`${this.results.duplicateSelectors.length} selectores duplicados encontrados`);
        }

        if (this.results.importantUsage[0] && this.results.importantUsage[0].count > 50) {
            report.issues.critical.push(`Uso excesivo de !important: ${this.results.importantUsage[0].count} veces`);
        }

        if (this.results.obsoleteProperties.length > 0) {
            report.issues.warning.push(`${this.results.obsoleteProperties.length} propiedades obsoletas encontradas`);
        }

        if (this.results.performanceIssues.length > 0) {
            report.issues.warning.push(`${this.results.performanceIssues.length} posibles problemas de rendimiento`);
        }

        // Generar recomendaciones
        report.recommendations = this.generateRecommendations();

        return report;
    }

    generateRecommendations() {
        const recommendations = [];

        if (this.results.duplicateSelectors.length > 0) {
            recommendations.push('Consolidar selectores duplicados para reducir el tamaño del CSS');
        }

        if (this.results.duplicateDeclarations.length > 0) {
            recommendations.push('Crear utility classes para declaraciones repetidas');
        }

        if (this.results.importantUsage[0] && this.results.importantUsage[0].count > 20) {
            recommendations.push('Reducir el uso de !important mejorando la especificidad');
        }

        if (this.results.obsoleteProperties.length > 0) {
            recommendations.push('Eliminar propiedades obsoletas y usar alternativas modernas');
        }

        if (this.results.performanceIssues.length > 0) {
            recommendations.push('Optimizar propiedades que afectan el rendimiento');
        }

        return recommendations;
    }

    async saveReport(report, outputPath) {
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeJson(outputPath, report, { spaces: 2 });
        
        // También generar reporte en texto plano
        const textReport = this.generateTextReport(report);
        await fs.writeFile(outputPath.replace('.json', '.txt'), textReport);
    }

    generateTextReport(report) {
        let text = chalk.bold.blue('📊 REPORTE DE AUDITORÍA CSS - STARFLEX\n');
        text += chalk.gray('='.repeat(50)) + '\n\n';
        
        text += chalk.bold.green('📈 RESUMEN:\n');
        text += `• Total de líneas: ${report.summary.totalLines}\n`;
        text += `• Total de reglas: ${report.summary.totalRules}\n`;
        text += `• Total de declaraciones: ${report.summary.totalDeclarations}\n`;
        text += `• Selectores duplicados: ${report.summary.duplicateSelectorsCount}\n`;
        text += `• Declaraciones duplicadas: ${report.summary.duplicateDeclarationsCount}\n`;
        text += `• Uso de !important: ${report.summary.importantUsage.count} (${report.summary.importantUsage.percentage}%)\n\n`;
        
        if (report.issues.critical.length > 0) {
            text += chalk.bold.red('🚨 ISSUES CRÍTICOS:\n');
            report.issues.critical.forEach(issue => {
                text += chalk.red(`• ${issue}\n`);
            });
            text += '\n';
        }
        
        if (report.issues.warning.length > 0) {
            text += chalk.bold.yellow('⚠️  ADVERTENCIAS:\n');
            report.issues.warning.forEach(issue => {
                text += chalk.yellow(`• ${issue}\n`);
            });
            text += '\n';
        }
        
        if (report.recommendations.length > 0) {
            text += chalk.bold.cyan('💡 RECOMENDACIONES:\n');
            report.recommendations.forEach(rec => {
                text += chalk.cyan(`• ${rec}\n`);
            });
            text += '\n';
        }
        
        return text;
    }
}

// Ejecutar auditoría
async function main() {
    const auditor = new CSSAuditor();
    
    try {
        console.log(chalk.bold.blue('🚀 Iniciando auditoría CSS de StarFlex...\n'));
        
        const report = await auditor.auditFile('css/style.css');
        
        if (report) {
            await auditor.saveReport(report, 'reports/css-audit.json');
            console.log(auditor.generateTextReport(report));
            console.log(chalk.bold.green('✅ Auditoría completada. Reporte guardado en reports/css-audit.json'));
        }
        
    } catch (error) {
        console.error(chalk.red(`❌ Error durante la auditoría: ${error.message}`));
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = CSSAuditor;
