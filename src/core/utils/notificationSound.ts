

class NotificationSound {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  
  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  
  async playNotificationSound() {
    if (!this.isEnabled) return;

    try {
      this.initAudioContext();

      if (!this.audioContext) {
        console.warn('Audio context not available');
        return;
      }

      const context = this.audioContext;
      const now = context.currentTime;

      
      const oscillator1 = context.createOscillator();
      const oscillator2 = context.createOscillator();

      
      const gainNode1 = context.createGain();
      const gainNode2 = context.createGain();
      const masterGain = context.createGain();

      
      oscillator1.frequency.setValueAtTime(523.25, now); 
      oscillator2.frequency.setValueAtTime(659.25, now); 

      
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';

      
      const volume = 0.3; 
      const attackTime = 0.01;
      const decayTime = 0.1;
      const sustainLevel = 0.2;
      const releaseTime = 0.1;

      
      gainNode1.gain.setValueAtTime(0, now);
      gainNode1.gain.linearRampToValueAtTime(volume, now + attackTime);
      gainNode1.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode1.gain.linearRampToValueAtTime(0, now + 0.15);

      
      gainNode2.gain.setValueAtTime(0, now + 0.05);
      gainNode2.gain.linearRampToValueAtTime(volume, now + 0.05 + attackTime);
      gainNode2.gain.linearRampToValueAtTime(sustainLevel, now + 0.05 + attackTime + decayTime);
      gainNode2.gain.linearRampToValueAtTime(0, now + 0.25);

      
      masterGain.gain.setValueAtTime(1, now);

      
      oscillator1.connect(gainNode1);
      oscillator2.connect(gainNode2);
      gainNode1.connect(masterGain);
      gainNode2.connect(masterGain);
      masterGain.connect(context.destination);

      
      oscillator1.start(now);
      oscillator2.start(now + 0.05);

      
      oscillator1.stop(now + 0.25);
      oscillator2.stop(now + 0.35);

    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  
  enable() {
    this.isEnabled = true;
  }

  
  disable() {
    this.isEnabled = false;
  }

  
  toggle() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  
  isNotificationSoundEnabled() {
    return this.isEnabled;
  }

  
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}


export const notificationSound = new NotificationSound();
