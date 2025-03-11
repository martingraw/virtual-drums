/**
 * Main Application for Virtual Drums Studio
 * 
 * This module handles:
 * - Initializing the application
 * - Creating the drum kit visualization
 * - Handling user interactions (keyboard, mouse)
 * - Managing UI controls
 */

// DOM Elements
let drumKitElement = document.getElementById('drum-kit');
let kitSelectElement = document.getElementById('kit-select');
let volumeControlElement = document.getElementById('volume-control');
let toggleShortcutsButton = document.getElementById('toggle-shortcuts');
let toggleMetronomeButton = document.getElementById('toggle-metronome');
let recordButton = document.getElementById('record-btn');
let playButton = document.getElementById('play-btn');
let stopButton = document.getElementById('stop-btn');
let exportMidiButton = document.getElementById('export-midi');
let tempoSlider = document.getElementById('tempo-slider');
let tempoValue = document.getElementById('tempo-value');
let keyboardShortcutsOverlay = document.getElementById('keyboard-shortcuts');
let closeShortcutsButton = document.getElementById('close-shortcuts');
let shortcutsGrid = document.querySelector('.shortcuts-grid');
let audioInitOverlay = document.getElementById('audio-init-overlay');

// State
let currentKit = 'standard';
let activeDrumElements = new Map();

/**
 * Initialize the application
 */
function initApp() {
    // Set up event listeners first
    setupEventListeners();
    
    // Load the default drum kit
    loadDrumKit(currentKit);
    
    // Initialize audio engine with default volume
    audioEngine.setVolume(volumeControlElement.value);
    
    // Set up audio initialization overlay
    setupAudioInit();
    
    console.log('Virtual Drums Studio initialized');
}

/**
 * Set up the audio initialization overlay
 */
function setupAudioInit() {
    // Add click event listener to the overlay
    audioInitOverlay.addEventListener('click', async () => {
        try {
            // Initialize the audio engine
            await audioEngine.initialize();
            
            // Hide the overlay
            audioInitOverlay.classList.add('hidden');
            
            console.log('Audio engine initialized successfully');
        } catch (error) {
            console.error('Failed to initialize audio engine:', error);
        }
    });
    
    // Show the overlay
    audioInitOverlay.classList.remove('hidden');
    
    // Special handling for embedded mode
    if (window.isEmbedded) {
        console.log("Running in embedded mode - adding special handling");
        
        // Add a message for embedded mode
        const embeddedMessage = document.createElement('p');
        embeddedMessage.textContent = "Click here to activate drums";
        embeddedMessage.style.fontWeight = "bold";
        embeddedMessage.style.marginTop = "10px";
        audioInitOverlay.querySelector('.audio-init-message').appendChild(embeddedMessage);
        
        // Try to auto-initialize after a short delay (some browsers allow this in iframes)
        setTimeout(async () => {
            try {
                // Try to initialize automatically
                await audioEngine.initialize();
                audioInitOverlay.classList.add('hidden');
                console.log('Auto-initialized audio in iframe');
            } catch (e) {
                console.log('Auto-initialization failed, user interaction required');
            }
        }, 1000);
        
        // Make sure the overlay is very visible in iframe context
        audioInitOverlay.style.zIndex = "9999";
    }
}

/**
 * Load a drum kit and create its visual representation
 * @param {string} kitId - The ID of the kit to load
 */
function loadDrumKit(kitId) {
    console.log(`Loading drum kit: ${kitId}`);
    currentKit = kitId;
    
    // Clear existing drum elements
    drumKitElement.innerHTML = '';
    activeDrumElements.clear();
    
    // Get the kit configuration
    const kit = DRUM_KITS[kitId];
    if (!kit) {
        console.error(`Kit ${kitId} not found`);
        return;
    }
    
    // Create visual elements for each drum piece
    kit.pieces.forEach(piece => {
        const drumElement = document.createElement('div');
        drumElement.className = `drum-element ${piece.type}`;
        drumElement.dataset.pieceId = piece.id;
        drumElement.dataset.key = piece.key;
        
        // Set position and size
        drumElement.style.left = `${piece.position.x - piece.size.width / 2}px`;
        drumElement.style.top = `${piece.position.y - piece.size.height / 2}px`;
        drumElement.style.width = `${piece.size.width}px`;
        drumElement.style.height = `${piece.size.height}px`;
        
        // Set color if specified
        if (piece.color) {
            drumElement.style.backgroundColor = piece.color;
        }
        
        // Add key label
        const keyLabel = document.createElement('span');
        keyLabel.className = 'key-label';
        keyLabel.textContent = piece.key.toUpperCase();
        drumElement.appendChild(keyLabel);
        
        // Add click event listener
        drumElement.addEventListener('click', () => {
            playDrumPiece(piece.id);
        });
        
        // Add to the drum kit
        drumKitElement.appendChild(drumElement);
        
        // Store reference for keyboard events
        activeDrumElements.set(piece.key.toLowerCase(), {
            element: drumElement,
            pieceId: piece.id
        });
    });
    
    // Load audio samples
    audioEngine.loadKit(kitId);
    
    // Update shortcuts display
    updateShortcutsDisplay();
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // Kit selection
    kitSelectElement.addEventListener('change', (event) => {
        const newKit = event.target.value;
        console.log(`Kit selection changed to: ${newKit}`);
        loadDrumKit(newKit);
    });
    
    // Volume control
    volumeControlElement.addEventListener('input', () => {
        audioEngine.setVolume(volumeControlElement.value);
    });
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);
    
    // Shortcuts toggle
    toggleShortcutsButton.addEventListener('click', toggleShortcuts);
    closeShortcutsButton.addEventListener('click', () => {
        keyboardShortcutsOverlay.classList.add('hidden');
    });
    
    // Metronome toggle
    toggleMetronomeButton.addEventListener('click', () => {
        const isActive = toggleMetronomeButton.classList.toggle('active');
        toggleMetronomeButton.innerHTML = isActive ? 
            '<i class="fas fa-clock"></i> Stop Metronome' : 
            '<i class="fas fa-clock"></i> Metronome';
        audioEngine.toggleMetronome(isActive);
    });
    
    // Tempo control
    tempoSlider.addEventListener('input', () => {
        const tempo = parseInt(tempoSlider.value);
        tempoValue.textContent = tempo;
        audioEngine.setTempo(tempo);
    });
    
    // Recording controls
    recordButton.addEventListener('click', toggleRecording);
    playButton.addEventListener('click', () => recordingManager.playRecording());
    stopButton.addEventListener('click', () => recordingManager.stopPlayback());
    exportMidiButton.addEventListener('click', () => recordingManager.exportMIDI());
}

/**
 * Handle keyboard events
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyDown(event) {
    // Ignore if user is typing in an input field
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const key = event.key.toLowerCase();
    
    // Check if the key corresponds to a drum piece
    if (activeDrumElements.has(key)) {
        const { pieceId } = activeDrumElements.get(key);
        playDrumPiece(pieceId);
        event.preventDefault();
    }
}

/**
 * Play a drum piece and show visual feedback
 * @param {string} pieceId - The ID of the drum piece to play
 */
function playDrumPiece(pieceId) {
    // Check if audio is initialized
    if (!audioEngine.initialized) {
        // If not initialized, show the overlay if it's hidden
        if (audioInitOverlay.classList.contains('hidden')) {
            audioInitOverlay.classList.remove('hidden');
        }
        return;
    }
    
    // Find the drum element
    const drumElement = document.querySelector(`[data-piece-id="${pieceId}"]`);
    
    if (!drumElement) {
        console.warn(`No element found for piece ${pieceId}`);
        return;
    }
    
    // Calculate velocity based on random variation (for more natural sound)
    const velocity = 0.7 + (Math.random() * 0.3);
    
    // Play the sound
    audioEngine.playSound(pieceId, velocity);
    
    // Record the hit if recording is active
    if (recordingManager.isRecording) {
        recordingManager.recordHit(pieceId, velocity);
    }
    
    // Show visual feedback - use a shorter animation time for better responsiveness
    drumElement.classList.add('active');
    setTimeout(() => {
        drumElement.classList.remove('active');
    }, 50);
}

/**
 * Toggle the keyboard shortcuts overlay
 */
function toggleShortcuts() {
    keyboardShortcutsOverlay.classList.toggle('hidden');
    updateShortcutsDisplay();
}

/**
 * Update the shortcuts display with the current kit's keys
 */
function updateShortcutsDisplay() {
    // Clear existing shortcuts
    shortcutsGrid.innerHTML = '';
    
    // Get the current kit
    const kit = DRUM_KITS[currentKit];
    if (!kit) return;
    
    // Add each shortcut
    kit.pieces.forEach(piece => {
        const shortcutItem = document.createElement('div');
        shortcutItem.className = 'shortcut-item';
        
        const keyElement = document.createElement('div');
        keyElement.className = 'key';
        keyElement.textContent = piece.key.toUpperCase();
        
        const nameElement = document.createElement('div');
        nameElement.className = 'name';
        nameElement.textContent = piece.name;
        
        shortcutItem.appendChild(keyElement);
        shortcutItem.appendChild(nameElement);
        shortcutsGrid.appendChild(shortcutItem);
    });
}

/**
 * Toggle recording state
 */
function toggleRecording() {
    const isRecording = recordButton.classList.toggle('recording');
    
    if (isRecording) {
        // Start recording
        recordButton.innerHTML = '<i class="fas fa-circle"></i> Stop Recording';
        playButton.disabled = true;
        stopButton.disabled = true;
        exportMidiButton.disabled = true;
        recordingManager.startRecording();
    } else {
        // Stop recording
        recordButton.innerHTML = '<i class="fas fa-circle"></i> Record';
        recordingManager.stopRecording();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
