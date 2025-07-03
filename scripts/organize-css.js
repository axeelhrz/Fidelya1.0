const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class CSSOrganizer {
    constructor() {
        this.modules = {
            'reset': {
                patterns: [
                    /\*\s*,\s*\*::before\s*,\s*\*::after/,
                    /html\s*{/,
                    /body\s*{/,
                    /^(h[1-6]|p|ul|ol|li|a|img|button|input|textarea|select)\s*{/
                ],
                content: []
            },
            'variables': {
                patterns: [
                    /:root\s*{/,
                    /--[a-zA-Z-]+:/
                ],
                content: []
            },
            'base': {
                patterns: [
                    /\.bg-canvas/,
                    /\.image-optimized/,
                    /\.mobile-only/,
                    /\.desktop-only/
                ],
                content: []
            },
            'layout': {
                patterns: [
                    /\.header/,
                    /\.nav/,
                    /\.hero__container/,
                    /\.features__grid/,
                    /\.contact__grid/
                ],
                content: []
            },
            'components': {
                patterns: [
                    /\.btn/,
                    /\.nav__/,
                    /\.hero__/,
                    /\.feature/,
                    /\.videos__/,
                    /\.faq__/,
                    /\.contact__/,
                    /\.language-switcher/,
                    /\.floating-widget/,
                    /\.phone/,
                    /\.download-btn/
                ],
                content: []
            },
            'utilities': {
                patterns: [
                    /\.sr-only/,
                    /\.visually-hidden/,
                    /\.no-scroll/,
                    /\.loading/,
                    /\.loaded/,
                    /\.error/
                ],
                content: []
            },
            'animations': {
                patterns: [
                    /@keyframes/,
                    /animation:/,
                    /transition:/,
                    /transform:/
                ],
                content: []
            },
            'responsive': {
                patterns: [
                    /@media/
                ],
                content: []
            }
        };
    }

    async organizeCSSFile(inputPath, outputDir) {
        console.log(chalk.blue(`📁 Organizando CSS: ${inputPath}`));
        
        const cssContent = await fs.readFile(inputPath, 'utf8');
        const rules = this.parseCSS(cssContent);
        
        // Clasificar reglas en módulos
        this.classifyRules(rules);
        
        // Crear directorio de salida
        await fs.ensureDir(outputDir);
        
        // Generar archivos modulares
        await this.generateModuleFiles(outputDir);
        
        // Generar archivo principal que importa todos los módulos
        await this.generateMainFile(outputDir);
        
        console.log(chalk.green(`✅ CSS organizado en módulos en: ${outputDir}`));
    }

    parseCSS(cssContent) {
        // Parser simple para dividir el CSS en reglas
        const rules = [];
        let currentRule = '';
        let braceCount = 0;
        let inComment = false;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < cssContent.length; i++) {
            const char = cssContent[i];
            const nextChar = cssContent[i + 1];
            
            // Manejar comentarios
            if (!inString && char === '/' && nextChar === '*') {
                inComment = true;
                currentRule += char;
                continue;
            }
            
            if (inComment && char === '*' && nextChar === '/') {
                inComment = false;
                currentRule += char;
                continue;
            }
            
            // Manejar strings
            if (!inComment && (char === '"' || char === "'")) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
            }
            
            currentRule += char;
            
            // Contar llaves solo fuera de comentarios y strings
            if (!inComment && !inString) {
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                    
                    if (braceCount === 0) {
                        // Fin de regla
                        rules.push(currentRule.trim());
                        currentRule = '';
                    }
                }
            }
        }
        
        // Agregar cualquier contenido restante
        if (currentRule.trim()) {
            rules.push(currentRule.trim());
        }
        
        return rules;
    }

    classifyRules(rules) {
        rules.forEach(rule => {
            let classified = false;
            
            // Intentar clasificar en cada módulo
            for (const [moduleName, moduleData] of Object.entries(this.modules)) {
                if (this.ruleMatchesModule(rule, moduleData.patterns)) {
                    moduleData.content.push(rule);
                    classified = true;
                    break;
                }
            }
            
            // Si no se clasificó, ponerlo en components por defecto
            if (!classified) {
                this.modules.components.content.push(rule);
            }
        });
    }

    ruleMatchesModule(rule, patterns) {
        return patterns.some(pattern => pattern.test(rule));
    }

    async generateModuleFiles(outputDir) {
        for (const [moduleName, moduleData] of Object.entries(this.modules)) {
            if (moduleData.content.length > 0) {
                const fileName = `_${moduleName}.css`;
                const filePath = path.join(outputDir, fileName);
                
                let content = `/* ===== ${moduleName.toUpperCase()} MODULE ===== */\n\n`;
                content += moduleData.content.join('\n\n');
                content += '\n';
                
                await fs.writeFile(filePath, content);
                console.log(chalk.gray(`  📄 Creado: ${fileName} (${moduleData.content.length} reglas)`));
            }
        }
    }

    async generateMainFile(outputDir) {
        const mainFilePath = path.join(outputDir, 'style.css');
        
        let content = `/* ===== STARFLEX CSS MODULAR ===== */\n`;
        content += `/* Generado automáticamente - No editar directamente */\n\n`;
        
        // Orden específico de importación para StarFlex
        const importOrder = [
            'variables',
            'reset', 
            'base',
            'layout',
            'components',
            'utilities',
            'animations',
            'responsive'
        ];
        
        importOrder.forEach(moduleName => {
            const fileName = `_${moduleName}.css`;
            const filePath = path.join(outputDir, fileName);
            
            if (fs.existsSync(filePath)) {
                content += `@import './${fileName}';\n`;
            }
        });
        
        await fs.writeFile(mainFilePath, content);
        console.log(chalk.green(`  📄 Archivo principal creado: style.css`));
    }

    generateReport() {
        console.log(chalk.bold.blue('\n📊 REPORTE DE ORGANIZACIÓN:\n'));
        
        let totalRules = 0;
        Object.entries(this.modules).forEach(([moduleName, moduleData]) => {
            const count = moduleData.content.length;
            totalRules += count;
            
            if (count > 0) {
                console.log(chalk.cyan(`  ${moduleName.padEnd(12)}: ${count} reglas`));
            }
        });
        
        console.log(chalk.gray(`  ${''.padEnd(12)}: ────────────`));
        console.log(chalk.bold.green(`  ${'Total'.padEnd(12)}: ${totalRules} reglas`));
    }
}

// Ejecutar organización
async function main() {
    const organizer = new CSSOrganizer();
    
    try {
        console.log(chalk.bold.blue('🚀 Iniciando organización modular del CSS...\n'));
        
        await organizer.organizeCSSFile('css/style.css', 'css-modules');
        organizer.generateReport();
        
        console.log(chalk.bold.green('\n✅ Organización completada exitosamente!'));
        console.log(chalk.gray('💡 Revisa los archivos en css-modules/ antes de usar en producción'));
        
    } catch (error) {
        console.error(chalk.red(`❌ Error durante la organización: ${error.message}`));
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = CSSOrganizer;
