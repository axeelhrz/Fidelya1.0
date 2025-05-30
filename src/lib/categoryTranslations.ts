// Traducciones de categorías de productos
export const categoryTranslations: Record<string, string> = {
  // Categorías principales
  'APPETIZER': 'Entradas',
  'MAIN_COURSE': 'Platos Principales', 
  'DESSERT': 'Postres',
  'BEVERAGE': 'Bebidas',
  'SIDE_DISH': 'Acompañamientos',
  'COCKTAIL': 'Cócteles',
  'WINE': 'Vinos',
  'BEER': 'Cervezas',
  'COFFEE': 'Cafetería',
  'NON_ALCOHOLIC': 'Sin Alcohol',
  'SNACK': 'Snacks',

  // Variaciones comunes
  'appetizer': 'Entradas',
  'main_course': 'Platos Principales',
  'dessert': 'Postres',
  'beverage': 'Bebidas',
  'side_dish': 'Acompañamientos',
  'cocktail': 'Cócteles',
  'wine': 'Vinos',
  'beer': 'Cervezas',
  'coffee': 'Cafetería',
  'non_alcoholic': 'Sin Alcohol',
  'snack': 'Snacks',

  // Categorías adicionales en español (por si ya están traducidas)
  'Entradas': 'Entradas',
  'Platos Principales': 'Platos Principales',
  'Postres': 'Postres',
  'Bebidas': 'Bebidas',
  'Acompañamientos': 'Acompañamientos',
  'Cócteles': 'Cócteles',
  'Vinos': 'Vinos',
  'Cervezas': 'Cervezas',
  'Cafetería': 'Cafetería',
  'Sin Alcohol': 'Sin Alcohol',
  'Snacks': 'Snacks',

  // Categorías genéricas
  'General': 'General',
  'Especiales': 'Especiales',
  'Temporada': 'Temporada',
  'Promociones': 'Promociones',
};

/**
 * Traduce una categoría del inglés al español
 * @param category - La categoría a traducir
 * @returns La categoría traducida al español
 */
export function translateCategory(category: string): string {
  // Si la categoría ya está en el mapa de traducciones, la devolvemos
  if (categoryTranslations[category]) {
    return categoryTranslations[category];
  }

  // Si no está en el mapa, intentamos con variaciones comunes
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '_');
  if (categoryTranslations[normalizedCategory]) {
    return categoryTranslations[normalizedCategory];
  }

  // Si no encontramos traducción, devolvemos la categoría original formateada
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Obtiene todas las traducciones de categorías disponibles
 * @returns Array de objetos con la categoría original y su traducción
 */
export function getAllCategoryTranslations(): Array<{ original: string; translated: string }> {
  return Object.entries(categoryTranslations)
    .filter(([key]) => key === key.toUpperCase()) // Solo las categorías principales en mayúsculas
    .map(([original, translated]) => ({ original, translated }));
}

/**
 * Verifica si una categoría tiene traducción disponible
 * @param category - La categoría a verificar
 * @returns true si tiene traducción, false en caso contrario
 */
export function hasTranslation(category: string): boolean {
  return Boolean(categoryTranslations[category] || categoryTranslations[category.toLowerCase().replace(/\s+/g, '_')]);
}