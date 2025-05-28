# Manual de Usuario - Sistema de Gestión de Tienda

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Funcionalidades del Sistema](#funcionalidades-del-sistema)
6. [Guía de Usuario](#guía-de-usuario)
7. [Base de Datos](#base-de-datos)
8. [Solución de Problemas](#solución-de-problemas)
9. [Ejemplos de Uso](#ejemplos-de-uso)
10. [Apéndices](#apéndices)

---

## 1. Introducción

### 1.1 Descripción General
El Sistema de Gestión de Tienda es una aplicación de consola desarrollada en Java que permite gestionar empleados, productos, pedidos y ofertas de una tienda. El sistema utiliza una base de datos MySQL para la persistencia de datos y está diseñado siguiendo principios de programación orientada a objetos.

### 1.2 Características Principales
- **Autenticación de empleados** con códigos de error personalizados
- **Gestión de productos** perecederos y no perecederos
- **Sistema de ofertas** (2x1, 3x2, descuentos por porcentaje)
- **Creación y gestión de pedidos** con actualización automática de stock
- **Cálculo de productividad** de empleados
- **Persistencia en base de datos MySQL** con patrón DAO
- **Manejo de transacciones** para garantizar integridad de datos

### 1.3 Tecnologías Utilizadas
- **Lenguaje**: Java 17+
- **Base de Datos**: MySQL 8.0+
- **Conector**: MySQL Connector/J
- **Patrón de Diseño**: DAO (Data Access Object)
- **IDE Recomendado**: Visual Studio Code

---

## 2. Requisitos del Sistema

### 2.1 Requisitos de Software
- Java Development Kit (JDK) 17 o superior
- MySQL Server 8.0 o superior
- MySQL Connector/J (driver JDBC)
- Terminal/Línea de comandos

### 2.2 Requisitos de Hardware
- Memoria RAM: Mínimo 512 MB
- Espacio en disco: 100 MB libres
- Procesador: Compatible con Java

### 2.3 Sistemas Operativos Compatibles
- Windows 10/11
- macOS 10.14 o superior
- Linux (Ubuntu, CentOS, etc.)

---

## 3. Instalación y Configuración

### 3.1 Instalación de Java
```bash
# Verificar instalación de Java
java -version

# Para macOS (usando Homebrew)
brew install openjdk@17

# Para Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# Para Windows
# Descargar desde: https://adoptium.net/
