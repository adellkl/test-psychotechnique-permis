/**
 * Système de notification sonore pour les admins
 */

export class NotificationSound {
  private static audioContext: AudioContext | null = null
  private static isEnabled: boolean = true

  /**
   * Initialise le contexte audio
   */
  private static getAudioContext(): AudioContext {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext!
  }

  /**
   * Joue un son de notification (bip agréable)
   */
  static playNotificationSound(): void {
    if (!this.isEnabled || typeof window === 'undefined') return

    try {
      const context = this.getAudioContext()
      
      // Créer un oscillateur pour le son
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      // Connecter les nœuds
      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Configuration du son (double bip agréable)
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(800, context.currentTime) // Fréquence agréable
      
      // Enveloppe du volume (fade in/out)
      gainNode.gain.setValueAtTime(0, context.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05)
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.15)

      // Jouer le son
      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.15)

      // Deuxième bip après une courte pause
      setTimeout(() => {
        const oscillator2 = context.createOscillator()
        const gainNode2 = context.createGain()

        oscillator2.connect(gainNode2)
        gainNode2.connect(context.destination)

        oscillator2.type = 'sine'
        oscillator2.frequency.setValueAtTime(1000, context.currentTime)
        
        gainNode2.gain.setValueAtTime(0, context.currentTime)
        gainNode2.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05)
        gainNode2.gain.linearRampToValueAtTime(0, context.currentTime + 0.15)

        oscillator2.start(context.currentTime)
        oscillator2.stop(context.currentTime + 0.15)
      }, 200)

    } catch (error) {
      console.error('Erreur lors de la lecture du son:', error)
    }
  }

  /**
   * Joue un son d'alerte (pour notifications urgentes)
   */
  static playAlertSound(): void {
    if (!this.isEnabled || typeof window === 'undefined') return

    try {
      const context = this.getAudioContext()
      
      // Triple bip plus insistant
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = context.createOscillator()
          const gainNode = context.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(context.destination)

          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(600, context.currentTime)
          
          gainNode.gain.setValueAtTime(0, context.currentTime)
          gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.05)
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1)

          oscillator.start(context.currentTime)
          oscillator.stop(context.currentTime + 0.1)
        }, i * 150)
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du son d\'alerte:', error)
    }
  }

  /**
   * Active/désactive les sons
   */
  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationSoundEnabled', enabled.toString())
    }
  }

  /**
   * Vérifie si les sons sont activés
   */
  static isNotificationSoundEnabled(): boolean {
    if (typeof window === 'undefined') return true
    
    const stored = localStorage.getItem('notificationSoundEnabled')
    return stored === null ? true : stored === 'true'
  }

  /**
   * Initialise les préférences depuis le localStorage
   */
  static init(): void {
    if (typeof window !== 'undefined') {
      this.isEnabled = this.isNotificationSoundEnabled()
    }
  }
}
