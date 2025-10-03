export default function InfoBar() {
    const infoText = "🏢 Situé à Clichy dans le 92 • ☎️ 07 65 56 53 79 • 📧 contact@test-psychotechnique-permis.com • ⏰ Du lundi au samedi 9h00 - 19h00"
    
    return (
        <div className="py-3 overflow-hidden relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-md">
            <div className="flex animate-marquee whitespace-nowrap">
                {/* Répéter le texte plusieurs fois pour assurer une boucle continue */}
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="inline-flex items-center mx-6 text-sm md:text-base">
                        {infoText}
                    </span>
                ))}
            </div>
        </div>
    )
}
