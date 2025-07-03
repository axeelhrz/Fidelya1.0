const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

class VisualTester {
    constructor() {
        this.browser = null;
        this.testResults = [];
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async testResponsiveDesign(htmlFile, cssFile) {
        console.log(chalk.blue(`📱 Testing responsive design...`));
        
        const page = await this.browser.newPage();
        
        // Dispositivos de prueba para StarFlex
        const devices = [
            { name: 'iPhone 12', width: 390, height: 844, deviceScaleFactor: 3 },
            { name: 'iPhone SE', width: 375, height: 667, deviceScaleFactor: 2 },
            { name: 'Samsung Galaxy S21', width: 360, height: 800, deviceScaleFactor: 3 },
            { name: 'iPad', width: 768, height: 1024, deviceScaleFactor: 2 },
            { name: 'Desktop 1920', width: 1920, height: 1080, deviceScaleFactor: 1 },
            { name: 'Desktop 1366', width: 1366, height: 768, deviceScaleFactor: 1 }
        ];
        
        await fs.ensureDir('reports/screenshots');
        
        for (const device of devices) {
            await page.setViewport({
                width: device.width,
                height: device.height,
                deviceScaleFactor: device.deviceScaleFactor
            });
            
            await page.goto(`file://${path.resolve(htmlFile)}`, {
                waitUntil: 'networkidle0'
            });
            
            // Esperar a que las animaciones terminen
            await page.waitForTimeout(2000);
            
            const screenshot = await page.screenshot({
                fullPage: true,
                type: 'png'
            });
            
            const fileName = `${device.name.replace(/\s+/g, '_')}.png`;
            await fs.writeFile(`reports/screenshots/${fileName}`, screenshot);
            
            console.log(chalk.gray(`  📸 Screenshot: ${fileName}`));
        }
        
        await page.close();
    }

    async testPerformance(htmlFile) {
        console.log(chalk.blue(`⚡ Testing performance...`));
        
        const page = await this.browser.newPage();
        
        // Simular conexión 3G para testing móvil
        await page.emulateNetworkConditions({
            offline: false,
            downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
            uploadThroughput: 750 * 1024 / 8, // 750 Kbps
            latency: 40 // 40ms
        });
        
        await page.goto(`file://${path.resolve(htmlFile)}`, {
            waitUntil: 'networkidle0'
        });
        
        // Medir métricas de rendimiento
        const metrics = await page.metrics();
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
            };
        });
        
        const result = {
            jsHeapUsedSize: Math.round(metrics.JSHeapUsedSize / 1024 / 1024 * 100) / 100,
            jsHeapTotalSize: Math.round(metrics.JSHeapTotalSize / 1024 / 1024 * 100) / 100,
            domContentLoaded: Math.round(performanceMetrics.domContentLoaded),
            loadComplete: Math.round(performanceMetrics.loadComplete),
            firstPaint: Math.round(performanceMetrics.firstPaint),
            firstContentfulPaint: Math.round(performanceMetrics.firstContentfulPaint)
        };
        
        console.log(chalk.cyan(`  Memory: ${result.jsHeapUsedSize}MB / ${result.jsHeapTotalSize}MB`));
        console.log(chalk.cyan(`  DOM Content Loaded: ${result.domContentLoaded}ms`));
        console.log(chalk.cyan(`  Load Complete: ${result.loadComplete}ms`));
        console.log(chalk.cyan(`  First Paint: ${result.firstPaint}ms`));
        console.log(chalk.cyan(`  First Contentful Paint: ${result.firstContentfulPaint}ms`));
        
        await page.close();
        return result;
    }

    async testAccessibility(htmlFile) {
        console.log(chalk.blue(`♿ Testing accessibility...`));
        
        const page = await this.browser.newPage();
        await page.goto(`file://${path.resolve(htmlFile)}`, {
            waitUntil: 'networkidle0'
        });
        
        // Test básico de accesibilidad
        const accessibilityIssues = await page.evaluate(() => {
            const issues = [];
            
            // Verificar imágenes sin alt
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
                if (!img.alt && !img.getAttribute('aria-label')) {
                    issues.push(`Imagen sin texto alternativo: índice ${index}`);
                }
            });
            
            // Verificar botones sin texto accesible
            const buttons = document.querySelectorAll('button');
            buttons.forEach((button, index) => {
                const hasText = button.textContent.trim();
                const hasAriaLabel = button.getAttribute('aria-label');
                const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
                
                if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
                    issues.push(`Botón sin texto accesible: índice ${index}`);
                }
            });
            
            // Verificar enlaces sin texto
            const links = document.querySelectorAll('a');
            links.forEach((link, index) => {
                const hasText = link.textContent.trim();
                const hasAriaLabel = link.getAttribute('aria-label');
                
                if (!hasText && !hasAriaLabel) {
                    issues.push(`Enlace sin texto accesible: índice ${index}`);
                }
            });
            
            return issues;
        });
        
        if (accessibilityIssues.length > 0) {
            console.log(chalk.yellow(`  ⚠️  ${accessibilityIssues.length} problemas de accesibilidad encontrados:`));
            accessibilityIssues.forEach(issue => {
                console.log(chalk.yellow(`    • ${issue}`));
            });
        } else {
            console.log(chalk.green(`  ✅ No se encontraron problemas básicos de accesibilidad`));
        }
        
        await page.close();
        return accessibilityIssues;
    }

    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            results: this.testResults
        };
        
        await fs.writeJson('reports/visual-test-report.json', report, { spaces: 2 });
        console.log(chalk.green(`📄 Reporte guardado en: reports/visual-test-report.json`));
    }
}

// Ejecutar tests
async function main() {
    const tester = new VisualTester();
    
    try {
        console.log(chalk.bold.blue('🚀 Iniciando tests visuales de StarFlex...\n'));
        
        await tester.init();
        
        // Test responsive design
        await tester.testResponsiveDesign('index.html', 'css/style.css');
        
        // Test performance
        const performanceResults = await tester.testPerformance('index.html');
        
        // Test accessibility
        const accessibilityResults = await tester.testAccessibility('index.html');
        
        await tester.generateReport();
        
        console.log(chalk.bold.green('\n✅ Tests visuales completados!'));
        
    } catch (error) {
        console.error(chalk.red(`❌ Error durante los tests: ${error.message}`));
        process.exit(1);
    } finally {
        await tester.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = VisualTester;
