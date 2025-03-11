/**
 * Audio Engine for Virtual Drums Studio
 * 
 * This module handles all audio-related functionality including:
 * - Playing drum sounds
 * - Managing volume and effects
 * - Handling the metronome
 */

class AudioEngine {
    constructor() {
        // Initialize Tone.js
        this.initialized = false;
        this.masterVolume = new Tone.Volume(-10).toDestination();
        this.currentKit = 'standard';
        this.metronome = null;
        this.metronomeActive = false;
        this.tempo = 120;
        
        // Cache for loaded samples
        this.samples = new Map();
        
        // Flag to track if samples are currently loading
        this.isLoadingSamples = false;
    }

    /**
     * Initialize the audio engine (must be called after user interaction)
     */
    async initialize() {
        if (this.initialized) return;
        
        try {
            // Special handling for iframe embedding
            if (window.isEmbedded) {
                console.log('Initializing audio engine in iframe context');
                
                // Create a silent buffer and play it to help initialize audio context
                const silentContext = new (window.AudioContext || window.webkitAudioContext)();
                const buffer = silentContext.createBuffer(1, 1, 22050);
                const source = silentContext.createBufferSource();
                source.buffer = buffer;
                source.connect(silentContext.destination);
                source.start(0);
                
                // Resume the context if possible
                if (silentContext.state !== 'running') {
                    await silentContext.resume();
                }
            }
            
            // Start Tone.js
            await Tone.start();
            
            // Set up metronome
            this.setupMetronome();
            
            // Mark as initialized
            this.initialized = true;
            console.log('Audio engine initialized');
            
            // Load the default kit
            await this.loadKit(this.currentKit);
        } catch (error) {
            console.error('Failed to initialize audio engine:', error);
            throw error; // Re-throw to allow caller to handle
        }
    }

    /**
     * Load a drum kit's samples
     * @param {string} kitId - The ID of the kit to load
     */
    async loadKit(kitId) {
        if (!this.initialized) await this.initialize();
        
        // Prevent multiple simultaneous loading operations
        if (this.isLoadingSamples) {
            console.warn('Already loading samples, please wait...');
            return;
        }
        
        this.isLoadingSamples = true;
        this.currentKit = kitId;
        console.log(`Loading kit: ${kitId}`);
        
        // Get the kit configuration
        const kit = DRUM_KITS[kitId];
        if (!kit) {
            console.error(`Kit ${kitId} not found`);
            this.isLoadingSamples = false;
            return;
        }
        
        // Dispose of previous players to free up resources
        for (const player of this.samples.values()) {
            if (player && player.dispose) {
                player.dispose();
            }
        }
        
        // Clear previous samples for this kit
        this.samples.clear();
        
        try {
            // Load each sample
            const loadPromises = kit.pieces.map(async (piece) => {
                try {
                    // Create a player for this sample
                    const player = new Tone.Player({
                        url: piece.sample,
                        onload: () => console.log(`Loaded sample for ${piece.id}`),
                        onerror: (e) => {
                            console.error(`Error loading sample for ${piece.id}:`, e);
                            
                            // Create a fallback synth based on the drum piece type
                            let fallbackSynth;
                            
                            switch (piece.id) {
                                case 'kick':
                                    fallbackSynth = new Tone.MembraneSynth({
                                        pitchDecay: 0.05,
                                        octaves: 5,
                                        oscillator: { type: 'sine' },
                                        envelope: {
                                            attack: 0.001,
                                            decay: 0.4,
                                            sustain: 0.01,
                                            release: 1.4,
                                            attackCurve: 'exponential'
                                        }
                                    }).connect(this.masterVolume);
                                    break;
                                    
                                case 'snare':
                                    fallbackSynth = new Tone.NoiseSynth({
                                        noise: { type: 'white' },
                                        envelope: {
                                            attack: 0.001,
                                            decay: 0.2,
                                            sustain: 0,
                                            release: 0.2
                                        }
                                    }).connect(this.masterVolume);
                                    break;
                                    
                                case 'hi-hat-closed':
                                case 'hi-hat-open':
                                    fallbackSynth = new Tone.MetalSynth({
                                        frequency: 200,
                                        envelope: {
                                            attack: 0.001,
                                            decay: piece.id === 'hi-hat-closed' ? 0.1 : 0.5,
                                            release: 0.1
                                        },
                                        harmonicity: 5.1,
                                        modulationIndex: 32,
                                        resonance: 4000,
                                        octaves: 1.5
                                    }).connect(this.masterVolume);
                                    break;
                                    
                                case 'crash':
                                case 'ride':
                                case 'china':
                                case 'ride-bell':
                                    fallbackSynth = new Tone.MetalSynth({
                                        frequency: 300,
                                        envelope: {
                                            attack: 0.001,
                                            decay: 1,
                                            release: 3
                                        },
                                        harmonicity: 3.1,
                                        modulationIndex: 16,
                                        resonance: 4000,
                                        octaves: 1.5
                                    }).connect(this.masterVolume);
                                    break;
                                    
                                case 'tom1':
                                case 'tom2':
                                case 'tom':
                                case 'floor-tom':
                                    fallbackSynth = new Tone.MembraneSynth({
                                        pitchDecay: 0.05,
                                        octaves: 1,
                                        oscillator: { type: 'sine' },
                                        envelope: {
                                            attack: 0.001,
                                            decay: 0.2,
                                            sustain: 0.01,
                                            release: 0.4,
                                            attackCurve: 'exponential'
                                        }
                                    }).connect(this.masterVolume);
                                    break;
                                    
                                case 'clap':
                                    fallbackSynth = new Tone.NoiseSynth({
                                        noise: { type: 'pink' },
                                        envelope: {
                                            attack: 0.001,
                                            decay: 0.2,
                                            sustain: 0,
                                            release: 0.2
                                        }
                                    }).connect(this.masterVolume);
                                    break;
                                    
                                case 'fx':
                                case 'brush':
                                    fallbackSynth = new Tone.NoiseSynth({
                                        noise: { type: 'brown' },
                                        envelope: {
                                            attack: 0.001,
                                            decay: 0.3,
                                            sustain: 0,
                                            release: 0.3
                                        }
                                    }).connect(this.masterVolume);
                                    break;
                                    
                                default:
                                    // Default to a simple membrane synth
                                    fallbackSynth = new Tone.MembraneSynth().connect(this.masterVolume);
                                    break;
                            }
                            
                            // Store the fallback synth in the samples map
                            this.samples.set(piece.id, {
                                isFallbackSynth: true,
                                synth: fallbackSynth,
                                type: piece.id
                            });
                        }
                    }).connect(this.masterVolume);
                    
                    // Store in the samples map
                    this.samples.set(piece.id, player);
                } catch (error) {
                    console.error(`Failed to load sample for ${piece.id}:`, error);
                }
            });
            
            // Wait for all samples to load
            await Promise.all(loadPromises);
            console.log(`Loaded kit: ${kitId}`);
        } catch (error) {
            console.error(`Error loading kit ${kitId}:`, error);
        } finally {
            this.isLoadingSamples = false;
        }
    }

    /**
     * Play a drum sound
     * @param {string} pieceId - The ID of the drum piece to play
     * @param {number} velocity - The velocity (volume) of the hit (0-1)
     */
    playSound(pieceId, velocity = 0.7) {
        if (!this.initialized) {
            this.initialize().then(() => this.playSound(pieceId, velocity));
            return;
        }
        
        try {
            // Get the player or synth for this piece
            const sound = this.samples.get(pieceId);
            
            if (sound) {
                if (sound.isFallbackSynth) {
                    // It's a fallback synth
                    const { synth, type } = sound;
                    
                    // Use immediate scheduling for better responsiveness
                    const now = Tone.now();
                    
                    if (type === 'kick') {
                        synth.triggerAttackRelease('C1', '8n', now, velocity);
                    } else if (type === 'snare' || type === 'clap') {
                        synth.triggerAttackRelease('16n', now, velocity);
                    } else if (type === 'hi-hat-closed' || type === 'hi-hat-open') {
                        synth.triggerAttackRelease('32n', now, velocity);
                    } else if (type === 'crash' || type === 'ride' || type === 'china' || type === 'ride-bell') {
                        synth.triggerAttackRelease('8n', now, velocity);
                    } else if (type === 'tom1' || type === 'tom2' || type === 'tom' || type === 'floor-tom') {
                        // Different pitches for different toms
                        let note = 'C3';
                        if (type === 'tom1') note = 'A3';
                        if (type === 'tom2') note = 'G3';
                        if (type === 'floor-tom') note = 'E2';
                        
                        synth.triggerAttackRelease(note, '8n', now, velocity);
                    } else if (type === 'fx' || type === 'brush') {
                        synth.triggerAttackRelease('8n', now, velocity);
                    } else {
                        synth.triggerAttackRelease('C2', '8n', now, velocity);
                    }
                    
                    console.log(`Played fallback synth for ${pieceId}`);
                } else {
                    // It's a sample player
                    // Check if the player is loaded and ready
                    if (sound.loaded) {
                        // Set the volume based on velocity
                        sound.volume.value = Tone.gainToDb(velocity);
                        
                        // Stop any currently playing instance of this sample
                        // This allows for rapid triggering of the same sound
                        sound.stop();
                        
                        // Play the sample immediately
                        sound.start(Tone.now());
                        console.log(`Played sample for ${pieceId}`);
                    } else {
                        console.warn(`Sample for ${pieceId} not loaded yet`);
                    }
                }
            } else {
                console.warn(`No sample loaded for ${pieceId}`);
                
                // Try to load the sample on-demand
                const kit = DRUM_KITS[this.currentKit];
                if (kit) {
                    const piece = kit.pieces.find(p => p.id === pieceId);
                    if (piece) {
                        console.log(`Attempting to load sample for ${pieceId} on-demand`);
                        
                        // Create a player for this sample with faster loading options
                        const newPlayer = new Tone.Player({
                            url: piece.sample,
                            onload: () => {
                                console.log(`Loaded sample for ${pieceId}`);
                                newPlayer.volume.value = Tone.gainToDb(velocity);
                                newPlayer.start(Tone.now());
                            },
                            onerror: (e) => {
                                console.error(`Error loading sample for ${pieceId}:`, e);
                                
                                // Create a fallback synth
                                this.createFallbackSynth(pieceId, velocity);
                            }
                        }).connect(this.masterVolume);
                        
                        // Store in the samples map
                        this.samples.set(pieceId, newPlayer);
                    }
                }
            }
        } catch (error) {
            console.error(`Error playing sound for ${pieceId}:`, error);
            
            // Create a fallback synth as a last resort
            this.createFallbackSynth(pieceId, velocity);
        }
    }
    
    /**
     * Create a fallback synth for a drum piece
     * @param {string} pieceId - The ID of the drum piece
     * @param {number} velocity - The velocity of the hit (0-1)
     */
    createFallbackSynth(pieceId, velocity) {
        try {
            // Create a synth based on the drum piece type
            let synth;
            
            switch (pieceId) {
                case 'kick':
                    synth = new Tone.MembraneSynth({
                        pitchDecay: 0.05,
                        octaves: 5,
                        oscillator: { type: 'sine' },
                        envelope: {
                            attack: 0.001,
                            decay: 0.4,
                            sustain: 0.01,
                            release: 1.4,
                            attackCurve: 'exponential'
                        }
                    }).connect(this.masterVolume);
                    synth.triggerAttackRelease('C1', '8n', undefined, velocity);
                    break;
                    
                case 'snare':
                    synth = new Tone.NoiseSynth({
                        noise: { type: 'white' },
                        envelope: {
                            attack: 0.001,
                            decay: 0.2,
                            sustain: 0,
                            release: 0.2
                        }
                    }).connect(this.masterVolume);
                    synth.triggerAttackRelease('16n', undefined, velocity);
                    break;
                    
                case 'hi-hat-closed':
                case 'hi-hat-open':
                    synth = new Tone.MetalSynth({
                        frequency: 200,
                        envelope: {
                            attack: 0.001,
                            decay: pieceId === 'hi-hat-closed' ? 0.1 : 0.5,
                            release: 0.1
                        },
                        harmonicity: 5.1,
                        modulationIndex: 32,
                        resonance: 4000,
                        octaves: 1.5
                    }).connect(this.masterVolume);
                    synth.triggerAttackRelease('32n', undefined, velocity);
                    break;
                    
                case 'crash':
                case 'ride':
                case 'china':
                case 'ride-bell':
                    synth = new Tone.MetalSynth({
                        frequency: 300,
                        envelope: {
                            attack: 0.001,
                            decay: 1,
                            release: 3
                        },
                        harmonicity: 3.1,
                        modulationIndex: 16,
                        resonance: 4000,
                        octaves: 1.5
                    }).connect(this.masterVolume);
                    synth.triggerAttackRelease('8n', undefined, velocity);
                    break;
                    
                case 'tom1':
                case 'tom2':
                case 'tom':
                case 'floor-tom':
                    synth = new Tone.MembraneSynth({
                        pitchDecay: 0.05,
                        octaves: 1,
                        oscillator: { type: 'sine' },
                        envelope: {
                            attack: 0.001,
                            decay: 0.2,
                            sustain: 0.01,
                            release: 0.4,
                            attackCurve: 'exponential'
                        }
                    }).connect(this.masterVolume);
                    
                    // Different pitches for different toms
                    let note = 'C3';
                    if (pieceId === 'tom1') note = 'A3';
                    if (pieceId === 'tom2') note = 'G3';
                    if (pieceId === 'floor-tom') note = 'E2';
                    
                    synth.triggerAttackRelease(note, '8n', undefined, velocity);
                    break;
                    
                case 'clap':
                    synth = new Tone.NoiseSynth({
                        noise: { type: 'pink' },
                        envelope: {
                            attack: 0.001,
                            decay: 0.2,
                            sustain: 0,
                            release: 0.2
                        }
                    }).connect(this.masterVolume);
                    synth.triggerAttackRelease('16n', undefined, velocity);
                    break;
                    
                case 'fx':
                case 'brush':
                    synth = new Tone.NoiseSynth({
                        noise: { type: 'brown' },
                        envelope: {
                            attack: 0.001,
                            decay: 0.3,
                            sustain: 0,
                            release: 0.3
                        }
                    }).connect(this.masterVolume);
                    synth.triggerAttackRelease('8n', undefined, velocity);
                    break;
                    
                default:
                    // Default to a simple membrane synth
                    synth = new Tone.MembraneSynth().connect(this.masterVolume);
                    synth.triggerAttackRelease('C2', '8n', undefined, velocity);
                    break;
            }
            
            // Store the fallback synth in the samples map
            this.samples.set(pieceId, {
                isFallbackSynth: true,
                synth: synth,
                type: pieceId
            });
            
            console.log(`Created fallback synth for ${pieceId}`);
        } catch (error) {
            console.error(`Error creating fallback synth for ${pieceId}:`, error);
        }
    }

    /**
     * Set the master volume
     * @param {number} value - Volume value (0-100)
     */
    setVolume(value) {
        const normalizedValue = value / 100;
        const dbValue = Tone.gainToDb(normalizedValue);
        this.masterVolume.volume.value = dbValue;
    }

    /**
     * Setup the metronome
     */
    setupMetronome() {
        // Create a synth for the metronome sound
        const metronomeSound = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: {
                type: 'sine'
            },
            envelope: {
                attack: 0.001,
                decay: 0.4,
                sustain: 0.01,
                release: 1.4,
                attackCurve: 'exponential'
            }
        }).connect(this.masterVolume);
        
        // Create a loop for the metronome
        this.metronome = new Tone.Loop(time => {
            metronomeSound.triggerAttackRelease('C2', '32n', time);
        }, '4n');
    }

    /**
     * Toggle the metronome on/off
     * @param {boolean} active - Whether the metronome should be active
     */
    toggleMetronome(active) {
        if (!this.initialized) {
            this.initialize().then(() => this.toggleMetronome(active));
            return;
        }
        
        this.metronomeActive = active;
        
        if (active) {
            Tone.Transport.bpm.value = this.tempo;
            this.metronome.start(0);
            Tone.Transport.start();
        } else {
            this.metronome.stop();
            // Only stop transport if we're not recording
            if (!recordingManager.isRecording) {
                Tone.Transport.stop();
            }
        }
    }

    /**
     * Set the tempo for the metronome and recording
     * @param {number} bpm - Beats per minute
     */
    setTempo(bpm) {
        this.tempo = bpm;
        Tone.Transport.bpm.value = bpm;
    }
}

// Create a global instance of the audio engine
const audioEngine = new AudioEngine();
