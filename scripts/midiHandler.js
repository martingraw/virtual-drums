/**
 * MIDI Handler for Virtual Drums Studio
 * 
 * This module handles all MIDI-related functionality including:
 * - Recording drum hits as MIDI events
 * - Playing back recorded MIDI sequences
 * - Exporting MIDI files
 */

class RecordingManager {
    constructor() {
        this.isRecording = false;
        this.recordedEvents = [];
        this.startTime = 0;
        this.currentPlayback = null;
        this.midiParts = [];
    }

    /**
     * Start recording MIDI events
     */
    startRecording() {
        if (this.isRecording) return;
        
        this.isRecording = true;
        this.recordedEvents = [];
        this.startTime = Tone.now();
        
        // Start the transport if it's not already running
        if (Tone.Transport.state !== 'started') {
            Tone.Transport.start();
        }
        
        console.log('Recording started');
    }

    /**
     * Stop recording MIDI events
     */
    stopRecording() {
        if (!this.isRecording) return;
        
        this.isRecording = false;
        
        // Stop the transport if metronome is not active
        if (!audioEngine.metronomeActive) {
            Tone.Transport.stop();
        }
        
        console.log('Recording stopped');
        console.log('Recorded events:', this.recordedEvents);
        
        // Enable playback and export buttons
        document.getElementById('play-btn').disabled = false;
        document.getElementById('stop-btn').disabled = false;
        document.getElementById('export-midi').disabled = false;
    }

    /**
     * Record a drum hit as a MIDI event
     * @param {string} pieceId - The ID of the drum piece
     * @param {number} velocity - The velocity of the hit (0-1)
     */
    recordHit(pieceId, velocity) {
        if (!this.isRecording) return;
        
        const time = Tone.now() - this.startTime;
        
        this.recordedEvents.push({
            time,
            note: pieceId,
            velocity
        });
    }

    /**
     * Play back the recorded MIDI sequence
     */
    playRecording() {
        if (this.isRecording || this.recordedEvents.length === 0) return;
        
        // Stop any existing playback
        this.stopPlayback();
        
        // Make sure the audio engine is initialized
        if (!audioEngine.initialized) {
            audioEngine.initialize().then(() => this.playRecording());
            return;
        }
        
        // Create a new Part for playback
        const part = new Tone.Part((time, event) => {
            // Schedule the sound to play at the specified time
            Tone.Draw.schedule(() => {
                // Play the drum sound
                audioEngine.playSound(event.note, event.velocity);
                
                // Highlight the corresponding drum element
                const drumElement = document.querySelector(`[data-piece-id="${event.note}"]`);
                if (drumElement) {
                    drumElement.classList.add('active');
                    setTimeout(() => {
                        drumElement.classList.remove('active');
                    }, 100);
                }
            }, time);
        }, this.recordedEvents.map(event => [event.time, event]));
        
        // Start the part
        part.start(0);
        this.midiParts.push(part);
        
        // Start the transport
        Tone.Transport.start();
        
        console.log('Playback started');
    }

    /**
     * Stop playback of the recorded MIDI sequence
     */
    stopPlayback() {
        // Stop and dispose all parts
        this.midiParts.forEach(part => {
            part.stop();
            part.dispose();
        });
        this.midiParts = [];
        
        // Stop the transport if metronome is not active
        if (!audioEngine.metronomeActive) {
            Tone.Transport.stop();
        }
        
        console.log('Playback stopped');
    }

    /**
     * Export the recorded MIDI sequence as a MIDI file
     */
    exportMIDI() {
        if (this.recordedEvents.length === 0) {
            console.warn('No events to export');
            return;
        }
        
        try {
            // Create a new MIDI file
            const midi = this.createMIDIFile();
            
            // Convert to binary data
            const midiData = midi.toArray();
            const byteArray = new Uint8Array(midiData);
            const blob = new Blob([byteArray], { type: 'audio/midi' });
            
            // Create a download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `virtual-drums-${new Date().toISOString().slice(0, 10)}.mid`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('MIDI file exported');
        } catch (error) {
            console.error('Failed to export MIDI file:', error);
        }
    }

    /**
     * Create a MIDI file from the recorded events
     * @returns {MIDIFile} The created MIDI file
     */
    createMIDIFile() {
        // We'll use a simple implementation here
        // In a real application, you would use a library like midi-writer-js
        
        // This is a simplified MIDI file structure
        const header = [
            0x4D, 0x54, 0x68, 0x64, // MThd
            0x00, 0x00, 0x00, 0x06, // Header size (6 bytes)
            0x00, 0x01, // Format (1 = multiple tracks)
            0x00, 0x02, // Number of tracks (2: tempo track + drum track)
            0x01, 0x80  // Division (480 ticks per quarter note)
        ];
        
        // Tempo track
        const tempoTrack = [
            0x4D, 0x54, 0x72, 0x6B, // MTrk
            0x00, 0x00, 0x00, 0x14, // Track length (20 bytes)
            // Set tempo (120 BPM = 500,000 microseconds per quarter note)
            0x00, 0xFF, 0x51, 0x03, 0x07, 0xA1, 0x20,
            // End of track
            0x83, 0x60, 0xFF, 0x2F, 0x00
        ];
        
        // Convert our events to MIDI format
        const drumEvents = [];
        const drumTrackHeader = [0x4D, 0x54, 0x72, 0x6B]; // MTrk
        
        // Add each drum hit as a MIDI note
        this.recordedEvents.forEach(event => {
            // Convert time to ticks (assuming 480 ticks per quarter note)
            const ticks = Math.round(event.time * 480 * (audioEngine.tempo / 60));
            
            // Get MIDI note number for the drum piece
            const noteNumber = this.getDrumMIDINote(event.note);
            
            // Note on event (delta time, 0x99 = note on channel 10, note, velocity)
            drumEvents.push(this.variableLengthQuantity(ticks));
            drumEvents.push(0x99); // Note on, channel 10 (drums)
            drumEvents.push(noteNumber);
            drumEvents.push(Math.round(event.velocity * 127));
            
            // Note off event (delta time 0, 0x89 = note off channel 10, note, velocity)
            drumEvents.push(0x00);
            drumEvents.push(0x89); // Note off, channel 10
            drumEvents.push(noteNumber);
            drumEvents.push(0x00);
        });
        
        // Add end of track
        drumEvents.push(0x00);
        drumEvents.push(0xFF);
        drumEvents.push(0x2F);
        drumEvents.push(0x00);
        
        // Calculate drum track length
        const drumTrackLength = drumEvents.length;
        const drumTrackLengthBytes = [
            (drumTrackLength >> 24) & 0xFF,
            (drumTrackLength >> 16) & 0xFF,
            (drumTrackLength >> 8) & 0xFF,
            drumTrackLength & 0xFF
        ];
        
        // Combine all parts
        const midiFile = [
            ...header,
            ...tempoTrack,
            ...drumTrackHeader,
            ...drumTrackLengthBytes,
            ...drumEvents
        ];
        
        return {
            toArray: () => midiFile
        };
    }

    /**
     * Convert a number to variable-length quantity format used in MIDI
     * @param {number} value - The number to convert
     * @returns {Array} The VLQ bytes
     */
    variableLengthQuantity(value) {
        if (value < 0) value = 0;
        
        const bytes = [];
        let v = value;
        
        if (v === 0) return [0];
        
        while (v > 0) {
            let b = v & 0x7F;
            v >>= 7;
            if (v > 0) b |= 0x80;
            bytes.push(b);
        }
        
        return bytes.reverse();
    }

    /**
     * Get the MIDI note number for a drum piece
     * @param {string} pieceId - The ID of the drum piece
     * @returns {number} The MIDI note number
     */
    getDrumMIDINote(pieceId) {
        // General MIDI drum map
        const drumMap = {
            'kick': 36,            // Bass Drum 1
            'snare': 38,           // Acoustic Snare
            'hi-hat-closed': 42,   // Closed Hi-Hat
            'hi-hat-open': 46,     // Open Hi-Hat
            'tom1': 48,            // High-Mid Tom
            'tom2': 47,            // Low-Mid Tom
            'floor-tom': 43,       // High Floor Tom
            'crash': 49,           // Crash Cymbal 1
            'ride': 51,            // Ride Cymbal 1
            'china': 52,           // Chinese Cymbal
            'clap': 39,            // Hand Clap
            'fx': 55,              // Splash Cymbal
            'ride-bell': 53,       // Ride Bell
            'brush': 40            // Electric Snare
        };
        
        return drumMap[pieceId] || 38; // Default to snare if not found
    }
}

// Create a global instance of the recording manager
const recordingManager = new RecordingManager();
