export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/** Redimensiona uma imagem no navegador e retorna WebP (reduz uso do Storage gratuito). */
export async function resizeImage(file: File, maxSize: number, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Falha ao processar a imagem'))), 'image/webp', quality),
  )
}
