// Script pour nettoyer le cache et forcer la reconnexion
console.log('🧹 Nettoyage du cache de connexion...')

// Supprimer toutes les données de session/localStorage liées à l'admin
localStorage.removeItem('adminToken')
localStorage.removeItem('adminData')
localStorage.removeItem('admin')
sessionStorage.removeItem('adminToken')
sessionStorage.removeItem('adminData')
sessionStorage.removeItem('admin')

// Supprimer tous les cookies liés à l'admin
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log('✅ Cache nettoyé - Rechargez la page et reconnectez-vous')

// Recharger la page après 1 seconde
setTimeout(() => {
  window.location.reload()
}, 1000)
