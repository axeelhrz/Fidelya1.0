import { NextResponse } from 'next/server';
import { getDatabaseAPI } from '../../../lib/database';

export async function GET() {
  try {
    const DatabaseAPI = await getDatabaseAPI();
    const info = await DatabaseAPI.utils.getInfo();
    
    const health = {
      status: info.dbExists ? 'healthy' : 'unhealthy',
      database: 'dbType' in info ? info.dbType : 'unknown',
      timestamp: new Date().toISOString(),
      details: info
    };
    
    return NextResponse.json(health, {
      status: info.dbExists ? 200 : 503
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}