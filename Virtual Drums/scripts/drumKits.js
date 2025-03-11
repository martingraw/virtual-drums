/**
 * Drum Kits Configuration
 * 
 * This file defines the different drum kits available in the application,
 * including their sounds, visual positions, and keyboard mappings.
 */

const DRUM_KITS = {
    // Standard Kit (with WAV samples)
    standard: {
        name: "Standard Kit",
        pieces: [
            {
                id: "kick",
                name: "Kick Drum",
                type: "drum",
                key: "x",
                keyCode: 88,
                sample: "assets/samples/standard/kik.wav",
                position: { x: 400, y: 380 },
                size: { width: 180, height: 180 },
                color: "#e63946"
            },
            {
                id: "snare",
                name: "Snare",
                type: "drum",
                key: "s",
                keyCode: 83,
                sample: "assets/samples/standard/snare.wav",
                position: { x: 250, y: 280 },
                size: { width: 120, height: 120 },
                color: "#e63946"
            },
            {
                id: "hi-hat-closed",
                name: "Hi-Hat (Closed)",
                type: "cymbal",
                key: "h",
                keyCode: 72,
                sample: "assets/samples/standard/hihat-closed.wav",
                position: { x: 150, y: 250 },
                size: { width: 100, height: 100 },
                color: "#ffb703"
            },
            {
                id: "hi-hat-open",
                name: "Hi-Hat (Open)",
                type: "cymbal",
                key: "j",
                keyCode: 74,
                sample: "assets/samples/standard/hihat-open.wav",
                position: { x: 150, y: 180 },
                size: { width: 100, height: 100 },
                color: "#ffb703"
            },
            {
                id: "tom1",
                name: "Tom 1",
                type: "drum",
                key: "e",
                keyCode: 69,
                sample: "assets/samples/standard/tom1.wav",
                position: { x: 320, y: 200 },
                size: { width: 110, height: 110 },
                color: "#e63946"
            },
            {
                id: "tom2",
                name: "Tom 2",
                type: "drum",
                key: "r",
                keyCode: 82,
                sample: "assets/samples/standard/tom2.wav",
                position: { x: 450, y: 220 },
                size: { width: 120, height: 120 },
                color: "#e63946"
            },
            {
                id: "floor-tom",
                name: "Floor Tom",
                type: "drum",
                key: "f",
                keyCode: 70,
                sample: "assets/samples/standard/floor-tom.wav",
                position: { x: 580, y: 300 },
                size: { width: 140, height: 140 },
                color: "#e63946"
            },
            {
                id: "crash",
                name: "Crash",
                type: "cymbal",
                key: "c",
                keyCode: 67,
                sample: "assets/samples/standard/crash.wav",
                position: { x: 200, y: 120 },
                size: { width: 150, height: 150 },
                color: "#ffb703"
            },
            {
                id: "ride",
                name: "Ride",
                type: "cymbal",
                key: "u",
                keyCode: 85,
                sample: "assets/samples/standard/ride.wav",
                position: { x: 600, y: 150 },
                size: { width: 150, height: 150 },
                color: "#ffb703"
            }
        ]
    },
    
    // Acoustic Kit
    acoustic: {
        name: "Acoustic Kit",
        pieces: [
            {
                id: "kick",
                name: "Kick Drum",
                type: "drum",
                key: "x",
                keyCode: 88,
                sample: "assets/samples/acoustic/kick.mp3",
                position: { x: 400, y: 350 },
                size: { width: 150, height: 150 },
                color: "#e63946"
            },
            {
                id: "snare",
                name: "Snare",
                type: "drum",
                key: "s",
                keyCode: 83,
                sample: "assets/samples/acoustic/snare.mp3",
                position: { x: 250, y: 250 },
                size: { width: 100, height: 80 },
                color: "#e63946"
            },
            {
                id: "hi-hat-closed",
                name: "Hi-Hat (Closed)",
                type: "cymbal",
                key: "h",
                keyCode: 72,
                sample: "assets/samples/acoustic/hihat-closed.mp3",
                position: { x: 150, y: 200 },
                size: { width: 100, height: 20 },
                color: "#ffb703"
            },
            {
                id: "hi-hat-open",
                name: "Hi-Hat (Open)",
                type: "cymbal",
                key: "j",
                keyCode: 74,
                sample: "assets/samples/acoustic/hihat-open.mp3",
                position: { x: 150, y: 150 },
                size: { width: 100, height: 20 },
                color: "#ffb703"
            },
            {
                id: "tom1",
                name: "Tom 1",
                type: "drum",
                key: "e",
                keyCode: 69,
                sample: "assets/samples/acoustic/tom1.mp3",
                position: { x: 300, y: 180 },
                size: { width: 90, height: 70 },
                color: "#e63946"
            },
            {
                id: "tom2",
                name: "Tom 2",
                type: "drum",
                key: "r",
                keyCode: 82,
                sample: "assets/samples/acoustic/tom2.mp3",
                position: { x: 400, y: 180 },
                size: { width: 90, height: 70 },
                color: "#e63946"
            },
            {
                id: "floor-tom",
                name: "Floor Tom",
                type: "drum",
                key: "f",
                keyCode: 70,
                sample: "assets/samples/acoustic/floor-tom.mp3",
                position: { x: 500, y: 250 },
                size: { width: 110, height: 90 },
                color: "#e63946"
            },
            {
                id: "crash",
                name: "Crash",
                type: "cymbal",
                key: "c",
                keyCode: 67,
                sample: "assets/samples/acoustic/crash.mp3",
                position: { x: 200, y: 100 },
                size: { width: 120, height: 120 },
                color: "#ffb703"
            },
            {
                id: "ride",
                name: "Ride",
                type: "cymbal",
                key: "u",
                keyCode: 85,
                sample: "assets/samples/acoustic/ride.mp3",
                position: { x: 550, y: 150 },
                size: { width: 120, height: 120 },
                color: "#ffb703"
            }
        ]
    },
    
    // Electronic Kit
    electronic: {
        name: "Electronic Kit",
        pieces: [
            {
                id: "kick",
                name: "Kick",
                type: "drum",
                key: "x",
                keyCode: 88,
                sample: "assets/samples/electronic/kick.mp3",
                position: { x: 400, y: 350 },
                size: { width: 150, height: 150 },
                color: "#3a86ff"
            },
            {
                id: "snare",
                name: "Snare",
                type: "drum",
                key: "s",
                keyCode: 83,
                sample: "assets/samples/electronic/snare.mp3",
                position: { x: 250, y: 250 },
                size: { width: 100, height: 80 },
                color: "#3a86ff"
            },
            {
                id: "hi-hat-closed",
                name: "Hi-Hat (Closed)",
                type: "cymbal",
                key: "h",
                keyCode: 72,
                sample: "assets/samples/electronic/hihat-closed.mp3",
                position: { x: 150, y: 200 },
                size: { width: 100, height: 20 },
                color: "#8338ec"
            },
            {
                id: "hi-hat-open",
                name: "Hi-Hat (Open)",
                type: "cymbal",
                key: "j",
                keyCode: 74,
                sample: "assets/samples/electronic/hihat-open.mp3",
                position: { x: 150, y: 150 },
                size: { width: 100, height: 20 },
                color: "#8338ec"
            },
            {
                id: "clap",
                name: "Clap",
                type: "drum",
                key: "a",
                keyCode: 65,
                sample: "assets/samples/electronic/clap.mp3",
                position: { x: 300, y: 180 },
                size: { width: 90, height: 70 },
                color: "#3a86ff"
            },
            {
                id: "tom",
                name: "Tom",
                type: "drum",
                key: "t",
                keyCode: 84,
                sample: "assets/samples/electronic/tom.mp3",
                position: { x: 400, y: 180 },
                size: { width: 90, height: 70 },
                color: "#3a86ff"
            },
            {
                id: "crash",
                name: "Crash",
                type: "cymbal",
                key: "c",
                keyCode: 67,
                sample: "assets/samples/electronic/crash.mp3",
                position: { x: 200, y: 100 },
                size: { width: 120, height: 120 },
                color: "#8338ec"
            },
            {
                id: "fx",
                name: "FX",
                type: "cymbal",
                key: "z",
                keyCode: 90,
                sample: "assets/samples/electronic/fx.mp3",
                position: { x: 550, y: 150 },
                size: { width: 120, height: 120 },
                color: "#8338ec"
            }
        ]
    },
    
    // Rock Kit
    rock: {
        name: "Rock Kit",
        pieces: [
            {
                id: "kick",
                name: "Kick",
                type: "drum",
                key: "x",
                keyCode: 88,
                sample: "assets/samples/rock/kick.mp3",
                position: { x: 400, y: 350 },
                size: { width: 150, height: 150 },
                color: "#d62828"
            },
            {
                id: "snare",
                name: "Snare",
                type: "drum",
                key: "s",
                keyCode: 83,
                sample: "assets/samples/rock/snare.mp3",
                position: { x: 250, y: 250 },
                size: { width: 100, height: 80 },
                color: "#d62828"
            },
            {
                id: "hi-hat-closed",
                name: "Hi-Hat (Closed)",
                type: "cymbal",
                key: "h",
                keyCode: 72,
                sample: "assets/samples/rock/hihat-closed.mp3",
                position: { x: 150, y: 200 },
                size: { width: 100, height: 20 },
                color: "#fcbf49"
            },
            {
                id: "hi-hat-open",
                name: "Hi-Hat (Open)",
                type: "cymbal",
                key: "j",
                keyCode: 74,
                sample: "assets/samples/rock/hihat-open.mp3",
                position: { x: 150, y: 150 },
                size: { width: 100, height: 20 },
                color: "#fcbf49"
            },
            {
                id: "tom1",
                name: "Tom 1",
                type: "drum",
                key: "e",
                keyCode: 69,
                sample: "assets/samples/rock/tom1.mp3",
                position: { x: 300, y: 180 },
                size: { width: 90, height: 70 },
                color: "#d62828"
            },
            {
                id: "tom2",
                name: "Tom 2",
                type: "drum",
                key: "r",
                keyCode: 82,
                sample: "assets/samples/rock/tom2.mp3",
                position: { x: 400, y: 180 },
                size: { width: 90, height: 70 },
                color: "#d62828"
            },
            {
                id: "floor-tom",
                name: "Floor Tom",
                type: "drum",
                key: "f",
                keyCode: 70,
                sample: "assets/samples/rock/floor-tom.mp3",
                position: { x: 500, y: 250 },
                size: { width: 110, height: 90 },
                color: "#d62828"
            },
            {
                id: "crash",
                name: "Crash",
                type: "cymbal",
                key: "c",
                keyCode: 67,
                sample: "assets/samples/rock/crash.mp3",
                position: { x: 200, y: 100 },
                size: { width: 120, height: 120 },
                color: "#fcbf49"
            },
            {
                id: "ride",
                name: "Ride",
                type: "cymbal",
                key: "u",
                keyCode: 85,
                sample: "assets/samples/rock/ride.mp3",
                position: { x: 550, y: 150 },
                size: { width: 120, height: 120 },
                color: "#fcbf49"
            },
            {
                id: "china",
                name: "China",
                type: "cymbal",
                key: "y",
                keyCode: 89,
                sample: "assets/samples/rock/china.mp3",
                position: { x: 650, y: 100 },
                size: { width: 110, height: 110 },
                color: "#fcbf49"
            }
        ]
    },
    
    // Jazz Kit
    jazz: {
        name: "Jazz Kit",
        pieces: [
            {
                id: "kick",
                name: "Kick",
                type: "drum",
                key: "x",
                keyCode: 88,
                sample: "assets/samples/jazz/kick.mp3",
                position: { x: 400, y: 350 },
                size: { width: 150, height: 150 },
                color: "#457b9d"
            },
            {
                id: "snare",
                name: "Snare",
                type: "drum",
                key: "s",
                keyCode: 83,
                sample: "assets/samples/jazz/snare.mp3",
                position: { x: 250, y: 250 },
                size: { width: 100, height: 80 },
                color: "#457b9d"
            },
            {
                id: "hi-hat-closed",
                name: "Hi-Hat (Closed)",
                type: "cymbal",
                key: "h",
                keyCode: 72,
                sample: "assets/samples/jazz/hihat-closed.mp3",
                position: { x: 150, y: 200 },
                size: { width: 100, height: 20 },
                color: "#a8dadc"
            },
            {
                id: "hi-hat-open",
                name: "Hi-Hat (Open)",
                type: "cymbal",
                key: "j",
                keyCode: 74,
                sample: "assets/samples/jazz/hihat-open.mp3",
                position: { x: 150, y: 150 },
                size: { width: 100, height: 20 },
                color: "#a8dadc"
            },
            {
                id: "ride",
                name: "Ride",
                type: "cymbal",
                key: "u",
                keyCode: 85,
                sample: "assets/samples/jazz/ride.mp3",
                position: { x: 550, y: 150 },
                size: { width: 120, height: 120 },
                color: "#a8dadc"
            },
            {
                id: "ride-bell",
                name: "Ride Bell",
                type: "cymbal",
                key: "i",
                keyCode: 73,
                sample: "assets/samples/jazz/ride-bell.mp3",
                position: { x: 550, y: 100 },
                size: { width: 60, height: 60 },
                color: "#a8dadc"
            },
            {
                id: "crash",
                name: "Crash",
                type: "cymbal",
                key: "c",
                keyCode: 67,
                sample: "assets/samples/jazz/crash.mp3",
                position: { x: 200, y: 100 },
                size: { width: 120, height: 120 },
                color: "#a8dadc"
            },
            {
                id: "tom",
                name: "Tom",
                type: "drum",
                key: "t",
                keyCode: 84,
                sample: "assets/samples/jazz/tom.mp3",
                position: { x: 400, y: 180 },
                size: { width: 90, height: 70 },
                color: "#457b9d"
            },
            {
                id: "brush",
                name: "Brush",
                type: "drum",
                key: "b",
                keyCode: 66,
                sample: "assets/samples/jazz/brush.mp3",
                position: { x: 300, y: 180 },
                size: { width: 90, height: 70 },
                color: "#457b9d"
            }
        ]
    }
};

// Default drum samples for development (will be replaced with actual samples)
const DEFAULT_SAMPLES = {
    kick: "https://cdn.freesound.org/previews/171/171104_2394245-lq.mp3",
    snare: "https://cdn.freesound.org/previews/387/387186_7255534-lq.mp3",
    "hi-hat-closed": "https://cdn.freesound.org/previews/317/317750_5220765-lq.mp3",
    "hi-hat-open": "https://cdn.freesound.org/previews/317/317749_5220765-lq.mp3",
    tom1: "https://cdn.freesound.org/previews/131/131347_2398403-lq.mp3",
    tom2: "https://cdn.freesound.org/previews/131/131346_2398403-lq.mp3",
    "floor-tom": "https://cdn.freesound.org/previews/131/131345_2398403-lq.mp3",
    crash: "https://cdn.freesound.org/previews/317/317747_5220765-lq.mp3",
    ride: "https://cdn.freesound.org/previews/317/317746_5220765-lq.mp3",
    china: "https://cdn.freesound.org/previews/467/467685_9494420-lq.mp3",
    clap: "https://cdn.freesound.org/previews/387/387187_7255534-lq.mp3",
    fx: "https://cdn.freesound.org/previews/352/352661_43603-lq.mp3",
    "ride-bell": "https://cdn.freesound.org/previews/411/411748_5121236-lq.mp3",
    brush: "https://cdn.freesound.org/previews/350/350908_43603-lq.mp3"
};

// Function to get the default sample URL for a drum piece
function getDefaultSample(id) {
    return DEFAULT_SAMPLES[id] || DEFAULT_SAMPLES.kick;
}
