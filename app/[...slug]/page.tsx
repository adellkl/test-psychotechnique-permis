import { notFound } from 'next/navigation'

export default function CatchAllPage() {
  // Redirige automatiquement vers la page 404
  notFound()
}
