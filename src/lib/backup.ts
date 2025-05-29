export const createBackup = async (): Promise<string> => {
  const DatabaseAPI = await getDatabaseAPI();
  const data = await DatabaseAPI.utils.exportToJSON();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.json`;
  
  // En producción, guardar en S3 o similar
  return data;
};