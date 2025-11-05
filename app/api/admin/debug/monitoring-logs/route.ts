import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const logsDir = join(process.cwd(), 'monitoring', 'logs')
    
    // Lire tous les fichiers de logs
    const files = await readdir(logsDir).catch(() => [])
    
    // Filtrer uniquement les fichiers JSON de monitoring
    const monitoringFiles = files.filter(f => f.startsWith('monitoring-') && f.endsWith('.json'))
    
    if (monitoringFiles.length === 0) {
      return NextResponse.json({ logs: [] })
    }
    
    // Lire le fichier le plus récent
    const latestFile = monitoringFiles.sort().reverse()[0]
    const filePath = join(logsDir, latestFile)
    
    const content = await readFile(filePath, 'utf-8')
    const logs = JSON.parse(content)
    
    return NextResponse.json({ logs: logs.slice(-50) }) // Derniers 50 logs
  } catch (error: any) {
    return NextResponse.json({ 
      logs: [],
      error: error.message 
    })
  }
}
