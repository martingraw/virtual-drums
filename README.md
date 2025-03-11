# Virtual Drums Studio

An interactive virtual drum kit that can be played with keyboard or mouse and embedded on any website.

![Virtual Drums Studio](assets/images/screenshot-placeholder.txt)

## Features

- Multiple drum kits with high-quality samples
- Keyboard and mouse controls
- Visual feedback when playing drums
- Volume control
- Metronome with adjustable tempo
- MIDI recording and playback
- Responsive design

## How to Play

### Keyboard Controls

- **X**: Kick Drum
- **S**: Snare
- **H**: Hi-Hat (Closed)
- **J**: Hi-Hat (Open)
- **E**: Tom 1
- **R**: Tom 2
- **F**: Floor Tom
- **C**: Crash
- **U**: Ride

### Mouse Controls

Simply click on any drum or cymbal to play it.

## Embedding on Your Website

You can embed this drum kit on your website using an iframe:

```html
<iframe 
    src="https://yourusername.github.io/virtual-drums/" 
    width="900" 
    height="600" 
    frameborder="0" 
    scrolling="no" 
    allow="autoplay" 
    title="Virtual Drums Studio">
</iframe>
```

Replace `yourusername` with your actual GitHub username.

### Responsive Embed

For a responsive embed that adjusts to the container width:

```html
<div style="position: relative; padding-bottom: 66.67%; height: 0; overflow: hidden; max-width: 100%;">
    <iframe 
        src="https://yourusername.github.io/virtual-drums/" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
        frameborder="0" 
        scrolling="no" 
        allow="autoplay" 
        title="Virtual Drums Studio">
    </iframe>
</div>
```

## Development

This project uses:

- HTML5, CSS3, and JavaScript
- [Tone.js](https://tonejs.github.io/) for audio processing

## License

See the [LICENSE](LICENSE) file for details.

## Credits

Created by [jscalco.com](https://www.jscalco.com/)
