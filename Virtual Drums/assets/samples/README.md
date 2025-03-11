# Drum Samples for Virtual Drums Studio

This directory is where you can add your own drum samples to customize the sound of the virtual drums.

## Directory Structure

The samples should be organized in subdirectories by kit type:

```
assets/samples/
├── acoustic/
│   ├── kick.mp3
│   ├── snare.mp3
│   ├── hihat-closed.mp3
│   ├── hihat-open.mp3
│   ├── tom1.mp3
│   ├── tom2.mp3
│   ├── floor-tom.mp3
│   ├── crash.mp3
│   └── ride.mp3
├── electronic/
│   ├── kick.mp3
│   ├── snare.mp3
│   ├── hihat-closed.mp3
│   ├── hihat-open.mp3
│   ├── clap.mp3
│   ├── tom.mp3
│   ├── crash.mp3
│   └── fx.mp3
├── rock/
│   └── ...
└── jazz/
    └── ...
```

## File Format

- Recommended format: MP3 (44.1kHz, 128-320kbps)
- Other supported formats: WAV, OGG

## Sample Sources

You can obtain drum samples from various sources:

1. Commercial sample packs
2. Free sample websites like Freesound.org
3. Recording your own drums

## Default Samples

The application currently uses default samples from Freesound.org for development purposes. When you add your own samples, update the file paths in the `drumKits.js` file to point to your local samples instead of the default URLs.

## License Considerations

If you're using samples from external sources, make sure you have the appropriate licenses to use them in your project.
