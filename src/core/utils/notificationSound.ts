/**
 * Notification Sound Utility
 * Plays a notification sound when new notifications arrive
 */

class NotificationSound {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  /**
   * Initialize the audio context (lazy initialization)
   */
  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Play a notification sound using Web Audio API
   * Creates a pleasant notification tone programmatically
   */
  async playNotificationSound() {
    console.log('Playing notification sound...');
    if (!this.isEnabled) return;

    try {
      this.initAudioContext();
      
      if (!this.audioContext) {
        console.warn('Audio context not available');
        return;
      }

      const context = this.audioContext;
      const now = context.currentTime;

      // Create oscillators for a pleasant two-tone notification sound
      const oscillator1 = context.createOscillator();
      const oscillator2 = context.createOscillator();
      
      // Create gain nodes for volume control and fade out
      const gainNode1 = context.createGain();
      const gainNode2 = context.createGain();
      const masterGain = context.createGain();

      // Set frequencies (pleasant notification tones - C and E notes)
      oscillator1.frequency.setValueAtTime(523.25, now); // C5
      oscillator2.frequency.setValueAtTime(659.25, now); // E5

      // Use sine wave for smooth sound
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';

      // Configure volume envelope for natural sound
      const volume = 0.3; // Not too loud
      const attackTime = 0.01;
      const decayTime = 0.1;
      const sustainLevel = 0.2;
      const releaseTime = 0.1;

      // First tone
      gainNode1.gain.setValueAtTime(0, now);
      gainNode1.gain.linearRampToValueAtTime(volume, now + attackTime);
      gainNode1.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode1.gain.linearRampToValueAtTime(0, now + 0.15);

      // Second tone (slightly delayed for pleasant effect)
      gainNode2.gain.setValueAtTime(0, now + 0.05);
      gainNode2.gain.linearRampToValueAtTime(volume, now + 0.05 + attackTime);
      gainNode2.gain.linearRampToValueAtTime(sustainLevel, now + 0.05 + attackTime + decayTime);
      gainNode2.gain.linearRampToValueAtTime(0, now + 0.25);

      // Master gain
      masterGain.gain.setValueAtTime(1, now);

      // Connect audio nodes
      oscillator1.connect(gainNode1);
      oscillator2.connect(gainNode2);
      gainNode1.connect(masterGain);
      gainNode2.connect(masterGain);
      masterGain.connect(context.destination);

      // Play the sound
      oscillator1.start(now);
      oscillator2.start(now + 0.05);
      
      // Stop after duration
      oscillator1.stop(now + 0.25);
      oscillator2.stop(now + 0.35);

    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  /**
   * Enable notification sounds
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disable notification sounds
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * Toggle notification sounds
   */
  toggle() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  /**
   * Check if notification sounds are enabled
   */
  isNotificationSoundEnabled() {
    return this.isEnabled;
  }

  /**
   * Clean up audio context
   */
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Export singleton instance
export const notificationSound = new NotificationSound();
