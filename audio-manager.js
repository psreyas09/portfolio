const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const AudioManager = {
    playStartupSound: () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const t = audioCtx.currentTime;

        // Helper to create oscillator
        const playTone = (freq, type, startTime, duration, vol = 0.1) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(vol, startTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        // Simulating the orchestral swell (simplified)
        // String swell
        playTone(261.63, 'sine', t, 4, 0.1); // C4
        playTone(329.63, 'sine', t, 4, 0.1); // E4
        playTone(392.00, 'sine', t, 4, 0.1); // G4

        // Melody (approximate)
        setTimeout(() => playTone(523.25, 'triangle', t + 0.5, 2, 0.15), 0); // C5
        setTimeout(() => playTone(392.00, 'triangle', t + 1.0, 2, 0.15), 0); // G4
        setTimeout(() => playTone(659.25, 'triangle', t + 1.5, 2.5, 0.15), 0); // E5
        setTimeout(() => playTone(523.25, 'triangle', t + 2.0, 3, 0.2), 0); // C5
    },

    playShutdownSound: () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const t = audioCtx.currentTime;

        const playChime = (freq, startTime) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(startTime);
            osc.stop(startTime + 1.5);
        };

        // Descending chimes (Gb, Eb, Bb, Gb) - Approximate XP shutdown
        playChime(739.99, t);       // F#5/Gb5
        playChime(622.25, t + 0.4); // D#5/Eb5
        playChime(466.16, t + 0.8); // A#4/Bb4
        playChime(369.99, t + 1.2); // F#4/Gb4
    }
};

// Expose to window
window.AudioManager = AudioManager;
