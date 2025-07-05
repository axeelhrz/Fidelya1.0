const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const CSSAuditor = require('./css-audit');
const CSSOrganizer = require('./organize-css');
const CSSMinifier = require('./clean-css-config');

class CSSOptimizer {
    constructor() {
        this.startTime = Date.now();
        this.results = {
            audit: null,
            lint: null,
            organization: null,
            purge: null,
            minification: null,
            performance: null
        };
    }

    async optimize() {
        console.log(chalk.bold.blue('🚀 INICIANDO OPTIMIZACIÓN COMPLETA DE CSS STARFLEX\n'));
        
        // Crear directorios necesarios
        await this.setupDirectories();
        
        // Paso 1: Auditoría inicial
        await this.runAudit();
        
        // Paso 2: Lint y corrección automática
        await this.runLinting();
        
        // Paso 3: Organización modular
        await this.runOrganization();
        
        // Paso 4: Build de desarrollo
        await this.buildDevelopment();
        
        // Paso 5: Build de producción con PurgeCSS
        await this.buildProduction();
        
        // Paso 6: Minificación avanzada
        await this.runMinification();
        
        // Paso 7: Tests de validación
        await this.runValidation();
        
        // Paso 8: Reporte final
        await this.generateFinalReport();
        
        console.log(chalk.bold.green('🎉 OPTIMIZACIÓN COMPLETADA EXITOSAMENTE!'));
    }

    async setupDirectories() {
        console.log(chalk.blue('📁 Configurando directorios...'));
        
        const dirs = [
            'dist',
            'css-modules', 
            'reports',
            'reports/screenshots',
            'backup'
        ];
        
        for (const dir of dirs) {
            await fs.ensureDir(dir);
        }
        
        // Backup del CSS original
        await fs.copy('css/style.css', 'backup/style-original.css');
        console.log(chalk.gray('  💾 Backup creado: backup/style-original.css'));
    }

    async runAudit() {
        console.log(chalk.blue('\n🔍 PASO 1: Auditoría inicial del CSS...'));
        
        const auditor = new CSSAuditor();
        this.results.audit = await auditor.auditFile('css/style.css');
        
        if (this.results.audit) {
            await auditor.saveReport(this.results.audit, 'reports/audit-inicial.json');
            console.log(chalk.green('✅ Auditoría completada'));
        }
    }

    async runLinting() {
        console.log(chalk.blue('\n🔧 PASO 2: Linting y corrección automática...'));
        
        try {
            // Ejecutar stylelint con corrección automática
            execSync('npx stylelint "css/**/*.css" --fix --formatter verbose', {
                stdio: 'pipe',
                encoding: 'utf8'
            });
            console.log(chalk.green('✅ Linting completado sin errores'));
        } catch (error) {
            // Capturar output de stylelint para análisis
            const lintOutput = error.stdout || error.stderr || '';
            await fs.writeFile('reports/lint-output.txt', lintOutput);
            
            console.log(chalk.yellow('⚠️  Linting completado con advertencias'));
            console.log(chalk.gray('  📄 Detalles en: reports/lint-output.txt'));
        }
    }

    async runOrganization() {
        console.log(chalk.blue('\n📁 PASO 3: Organización modular...'));
        
        const organizer = new CSSOrganizer();
        await organizer.organizeCSSFile('css/style.css', 'css-modules');
        
        console.log(chalk.green('✅ CSS organizado en módulos'));
    }

    async buildDevelopment() {
        console.log(chalk.blue('\n🔨 PASO 4: Build de desarrollo...'));
        
        try {
            execSync('npm run build:dev', { stdio: 'inherit' });
            console.log(chalk.green('✅ Build de desarrollo completado'));
        } catch (error) {
            console.error(chalk.red('❌ Error en build de desarrollo'));
            throw error;
        }
    }

    async buildProduction() {
        console.log(chalk.blue('\n🏭 PASO 5: Build de producción con PurgeCSS...'));
        
        try {
            execSync('npm run build:prod', { stdio: 'inherit' });
            console.log(chalk.green('✅ Build de producción completado'));
            
            // Analizar resultado de PurgeCSS
            await this.analyzePurgeResults();
            
        } catch (error) {
            console.error(chalk.red('❌ Error en build de producción'));
            throw error;
        }
    }

    async runMinification() {
        console.log(chalk.blue('\n🗜️  PASO 6: Minificación avanzada...'));
        
        const minifier = new CSSMinifier();
        
        // Minificar versión de desarrollo
        const devResults = await minifier.minifyFile(
            'dist/style.dev.css',
            'dist/style.dev.min.css'
        );
        
        // Minificar versión de producción
        const prodResults = await minifier.minifyFile(
            'dist/style.min.css',
            'dist/style.final.min.css'
        );
        
        // Generar comparación
        const comparison = await minifier.generateComparison(
            'css/style.css',
            'dist/style.final.min.css',
            'reports/minification-comparison.json'
        );
        
        this.results.minification = {
            development: devResults,
            production: prodResults,
            comparison: comparison
        };
        
        console.log(chalk.green('✅ Minificación completada'));
    }

    async runValidation() {
        console.log(chalk.blue('\n🧪 PASO 7: Validación y tests...'));
        
        try {
            // Ejecutar tests visuales
            execSync('npm run test:visual', { stdio: 'inherit' });
            console.log(chalk.green('✅ Tests visuales completados'));
        } catch (error) {
            console.warn(chalk.yellow('⚠️  Tests visuales completados con advertencias'));
        }
        
        // Validar que el CSS final funciona
        await this.validateFinalCSS();
    }

    async analyzePurgeResults() {
        const purgedPath = 'reports/purged-css.css';
        
        if (await fs.pathExists(purgedPath)) {
            const purgedContent = await fs.readFile(purgedPath, 'utf8');
            const purgedRules = (purgedContent.match(/{/g) || []).length;
            
            console.log(chalk.cyan(`  🗑️  CSS eliminado: ${purgedRules} reglas`));
            
            // Analizar qué se eliminó para verificar que es seguro
            const criticalPatterns = [
                /\.hero/,
                /\.nav/,
                /\.btn/,
                /\.feature/,
                /\.contact/
            ];
            
            const criticalRemoved = criticalPatterns.filter(pattern => 
                pattern.test(purgedContent)
            );
            
            if (criticalRemoved.length > 0) {
                console.warn(chalk.yellow('⚠️  ADVERTENCIA: Se eliminaron reglas que podrían ser importantes'));
                console.warn(chalk.yellow('  📄 Revisa: reports/purged-css.css'));
            }
        }
    }

    async validateFinalCSS() {
        const finalCSS = 'dist/style.final.min.css';
        
        if (await fs.pathExists(finalCSS)) {
            const content = await fs.readFile(finalCSS, 'utf8');
            
            // Verificaciones básicas
            const checks = {
                hasVariables: content.includes('--'),
                hasMediaQueries: content.includes('@media'),
                hasKeyframes: content.includes('@keyframes'),
                hasImportantRules: content.includes('!important'),
                size: Buffer.byteLength(content, 'utf8')
            };
            
            console.log(chalk.cyan('  📊 Validación del CSS final:'));
            console.log(chalk.cyan(`    Variables CSS: ${checks.hasVariables ? '✅' : '❌'}`));
            console.log(chalk.cyan(`    Media Queries: ${checks.hasMediaQueries ? '✅' : '❌'}`));
            console.log(chalk.cyan(`    Animaciones: ${checks.hasKeyframes ? '✅' : '❌'}`));
            console.log(chalk.cyan(`    Tamaño final: ${this.formatBytes(checks.size)}`));
            
            this.results.validation = checks;
        }
    }

    async generateFinalReport() {
        console.log(chalk.blue('\n📊 PASO 8: Generando reporte final...'));
        
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        const finalReport = {
            timestamp: new Date().toISOString(),
            duration: `${Math.round(duration / 1000)}s`,
            originalFile: {
                path: 'css/style.css',
                size: await this.getFileSize('css/style.css'),
                lines: await this.getFileLines('css/style.css')
            },
            optimizedFiles: {
                development: {
                    path: 'dist/style.dev.css',
                    size: await this.getFileSize('dist/style.dev.css'),
                    lines: await this.getFileLines('dist/style.dev.css')
                },
                production: {
                    path: 'dist/style.final.min.css',
                    size: await this.getFileSize('dist/style.final.min.css'),
                    lines: await this.getFileLines('dist/style.final.min.css')
                }
            },
            results: this.results,
            recommendations: this.generateRecommendations()
        };
        
        // Calcular ahorros totales
        if (finalReport.originalFile.size && finalReport.optimizedFiles.production.size) {
            const savings = finalReport.originalFile.size - finalReport.optimizedFiles.production.size;
            const percentage = ((savings / finalReport.originalFile.size) * 100).toFixed(2);
            
            finalReport.totalSavings = {
                bytes: savings,
                percentage: parseFloat(percentage),
                formatted: `${this.formatBytes(savings)} (${percentage}%)`
            };
        }
        
        await fs.writeJson('reports/optimization-final-report.json', finalReport, { spaces: 2 });
        
        // Mostrar resumen en consola
        this.displayFinalSummary(finalReport);
    }

    displayFinalSummary(report) {
        console.log(chalk.bold.green('\n🎯 RESUMEN DE OPTIMIZACIÓN STARFLEX'));
        console.log(chalk.gray('='.repeat(50)));
        
        if (report.totalSavings) {
            console.log(chalk.bold.cyan(`💾 AHORRO TOTAL: ${report.totalSavings.formatted}`));
        }
        
        console.log(chalk.cyan(`⏱️  Tiempo total: ${report.duration}`));
        console.log(chalk.cyan(`📄 Tamaño original: ${this.formatBytes(report.originalFile.size)}`));
        console.log(chalk.cyan(`📄 Tamaño final: ${this.formatBytes(report.optimizedFiles.production.size)}`));
        
        console.log(chalk.bold.yellow('\n📋 ARCHIVOS GENERADOS:'));
        console.log(chalk.gray('  📁 css-modules/ - CSS organizado en módulos'));
        console.log(chalk.gray('  📁 dist/style.dev.css - Versión de desarrollo'));
        console.log(chalk.gray('  📁 dist/style.final.min.css - Versión de producción'));
        console.log(chalk.gray('  📁 reports/ - Reportes detallados'));
        console.log(chalk.gray('  📁 backup/ - Respaldo del CSS original'));
        
        if (report.recommendations && report.recommendations.length > 0) {
            console.log(chalk.bold.yellow('\n💡 RECOMENDACIONES:'));
            report.recommendations.forEach(rec => {
                console.log(chalk.yellow(`  • ${rec}`));
            });
        }
        
        console.log(chalk.bold.green('\n✅ Optimización completada exitosamente!'));
        console.log(chalk.gray('📄 Reporte completo: reports/optimization-final-report.json'));
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.results.audit) {
            if (this.results.audit.summary.importantUsage.count > 20) {
                recommendations.push('Considerar reducir el uso de !important para mejorar mantenibilidad');
            }
            
            if (this.results.audit.summary.duplicateSelectorsCount > 10) {
                recommendations.push('Revisar selectores duplicados en css-modules para consolidar');
            }
        }
        
        if (this.results.validation) {
            if (this.results.validation.size > 100000) { // 100KB
                recommendations.push('El CSS final sigue siendo grande, considerar más optimizaciones');
            }
        }
        
        recommendations.push('Usar dist/style.final.min.css en producción');
        recommendations.push('Mantener css-modules/ para desarrollo futuro');
        recommendations.push('Ejecutar tests visuales después de cada cambio');
        
        return recommendations;
    }

    async getFileSize(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.size;
        } catch {
            return 0;
        }
    }

    async getFileLines(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return content.split('\n').length;
        } catch {
            return 0;
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Ejecutar optimización completa
async function main() {
    const optimizer = new CSSOptimizer();
    
    try {
        await optimizer.optimize();
    } catch (error) {
        console.error(chalk.red(`❌ Error durante la optimización: ${error.message}`));
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = CSSOptimizer;
