// ui.js - All DOM manipulation and rendering functions

export function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.step-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested step
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Update progress bar
    updateProgressBar(stepId);
}

export function updateProgressBar(currentStepId) {
    const stepMap = {
        'step-mood': 1,
        'step-key-tempo': 2,
        'step-chords': 3,
        'step-drums': 4,
        'step-bass': 5,
        'step-melody': 6,
        'step-structure': 7,
        'step-arrangement': 8,
        'step-lyrics': 9,
        'step-export': 10
    };
    
    const currentStepNumber = stepMap[currentStepId] || 1;
    
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStepNumber) {
            step.classList.add('completed');
        } else if (stepNumber === currentStepNumber) {
            step.classList.add('active');
        }
    });
}

export function renderMoods(moods, container) {
    const moodContainer = document.getElementById(container);
    if (!moodContainer) return;
    
    moodContainer.innerHTML = '';
    
    moods.forEach(mood => {
        const moodCard = document.createElement('div');
        moodCard.className = 'option-card';
        moodCard.dataset.moodId = mood.id;
        
        moodCard.innerHTML = `
            <h4>${mood.name}</h4>
            <p>${mood.description}</p>
        `;
        
        moodCard.addEventListener('click', () => selectOption(moodCard, 'mood'));
        moodContainer.appendChild(moodCard);
    });
}

export function renderGenres(genres, container) {
    const genreContainer = document.getElementById(container);
    if (!genreContainer) return;
    
    genreContainer.innerHTML = '';
    
    genres.forEach(genre => {
        const genreCard = document.createElement('div');
        genreCard.className = 'option-card';
        genreCard.dataset.genreId = genre.id;
        
        genreCard.innerHTML = `
            <h4>${genre.name}</h4>
            <p>${genre.description}</p>
        `;
        
        genreCard.addEventListener('click', () => selectOption(genreCard, 'genre'));
        genreContainer.appendChild(genreCard);
    });
}

export function renderKeys(keys, container) {
    const keyContainer = document.getElementById(container);
    if (!keyContainer) return;
    
    keyContainer.innerHTML = '';
    
    keys.forEach(key => {
        const keyCard = document.createElement('div');
        keyCard.className = 'option-card';
        keyCard.dataset.key = key;
        
        keyCard.innerHTML = `
            <h4>${key}</h4>
            <p>Musical Key</p>
        `;
        
        keyCard.addEventListener('click', () => selectOption(keyCard, 'key'));
        keyContainer.appendChild(keyCard);
    });
}

export function renderScales(scales, container) {
    const scaleContainer = document.getElementById(container);
    if (!scaleContainer) return;
    
    scaleContainer.innerHTML = '';
    
    scales.forEach(scale => {
        const scaleCard = document.createElement('div');
        scaleCard.className = 'option-card';
        scaleCard.dataset.scale = scale.type;
        
        scaleCard.innerHTML = `
            <h4>${scale.name}</h4>
            <p>${scale.description}</p>
        `;
        
        scaleCard.addEventListener('click', () => selectOption(scaleCard, 'scale'));
        scaleContainer.appendChild(scaleCard);
    });
}

export function renderTempos(tempoRange, container) {
    const tempoContainer = document.getElementById(container);
    if (!tempoContainer) return;
    
    tempoContainer.innerHTML = '';
    
    const [minTempo, maxTempo] = tempoRange;
    const tempoOptions = [];
    
    // Generate tempo options in the range
    for (let tempo = minTempo; tempo <= maxTempo; tempo += 10) {
        tempoOptions.push(tempo);
    }
    
    // Ensure we have at least 3 options
    if (tempoOptions.length < 3) {
        tempoOptions.push(minTempo + 5, maxTempo - 5);
    }
    
    tempoOptions.sort((a, b) => a - b);
    
    tempoOptions.forEach(tempo => {
        const tempoCard = document.createElement('div');
        tempoCard.className = 'option-card';
        tempoCard.dataset.tempo = tempo;
        
        let description = 'Medium';
        if (tempo < 80) description = 'Slow';
        else if (tempo < 100) description = 'Relaxed';
        else if (tempo < 120) description = 'Moderate';
        else if (tempo < 140) description = 'Upbeat';
        else description = 'Fast';
        
        tempoCard.innerHTML = `
            <h4>${tempo} BPM</h4>
            <p>${description}</p>
        `;
        
        tempoCard.addEventListener('click', () => selectOption(tempoCard, 'tempo'));
        tempoContainer.appendChild(tempoCard);
    });
}

export function renderChordProgressions(progressions, container) {
    const chordContainer = document.getElementById(container);
    if (!chordContainer) return;
    
    chordContainer.innerHTML = '';
    
    progressions.forEach(progression => {
        const chordCard = document.createElement('div');
        chordCard.className = 'chord-card';
        chordCard.dataset.progressionId = progression.id;
        
        chordCard.innerHTML = `
            <h4>${progression.name}</h4>
            <p>${progression.description}</p>
            <div class="chord-preview">${progression.numerals.join(' - ')}</div>
        `;
        
        chordCard.addEventListener('click', () => {
            selectOption(chordCard, 'chord-progression');
            displayChords(progression);
        });
        
        chordContainer.appendChild(chordCard);
    });
}

export function displayChords(chordProgression) {
    const chordDisplay = document.getElementById('chord-display');
    if (!chordDisplay || !chordProgression) return;
    
    chordDisplay.innerHTML = `
        <div class="chord-progression">
            <h5>${chordProgression.name}</h5>
            <div class="chords">${chordProgression.chords.join(' - ')}</div>
            <div class="numerals">${chordProgression.numerals.join(' - ')}</div>
        </div>
    `;
}

export function renderDrumPatterns(patterns, container) {
    const drumContainer = document.getElementById(container);
    if (!drumContainer) return;
    
    drumContainer.innerHTML = '';
    
    patterns.forEach(pattern => {
        const drumCard = document.createElement('div');
        drumCard.className = 'drum-card';
        drumCard.dataset.patternId = pattern.id;
        
        drumCard.innerHTML = `
            <h4>${pattern.name}</h4>
            <p>${pattern.description}</p>
            <div class="pattern-preview">${pattern.pattern}</div>
        `;
        
        drumCard.addEventListener('click', () => {
            selectOption(drumCard, 'drum-pattern');
            displayDrumPattern(pattern);
        });
        
        drumContainer.appendChild(drumCard);
    });
}

export function displayDrumPattern(drumPattern) {
    const drumDisplay = document.getElementById('drum-display');
    if (!drumDisplay || !drumPattern) return;
    
    let gridHTML = '<div class="drum-grid-display">';
    drumPattern.grid.forEach(track => {
        gridHTML += `<div class="drum-track">`;
        gridHTML += `<span class="track-name">${track[0]}</span>`;
        for (let i = 1; i < track.length; i++) {
            gridHTML += `<span class="beat ${track[i] === 'x' ? 'active' : ''}">${track[i]}</span>`;
        }
        gridHTML += `</div>`;
    });
    gridHTML += '</div>';
    
    drumDisplay.innerHTML = `
        <div class="drum-pattern-display">
            <h5>${drumPattern.name}</h5>
            ${gridHTML}
        </div>
    `;
}

export function renderBassOptions(bassLines, container) {
    const bassContainer = document.getElementById(container);
    if (!bassContainer) return;
    
    bassContainer.innerHTML = '';
    
    const complexityOptions = ['Simple', 'Walking'];
    
    complexityOptions.forEach(complexity => {
        const bassCard = document.createElement('div');
        bassCard.className = 'bass-card';
        bassCard.dataset.complexity = complexity.toLowerCase();
        
        bassCard.innerHTML = `
            <h4>${complexity} Bass</h4>
            <p>${complexity === 'Simple' ? 'Root notes following chord changes' : 'Walking bass line with passing tones'}</p>
        `;
        
        bassCard.addEventListener('click', () => selectOption(bassCard, 'bass-complexity'));
        bassContainer.appendChild(bassCard);
    });
}

export function displayBassLine(bassLine) {
    const bassDisplay = document.getElementById('bass-display');
    if (!bassDisplay || !bassLine) return;
    
    const bassNotes = bassLine.map(note => note.note).join(' - ');
    
    bassDisplay.innerHTML = `
        <div class="bass-line-display">
            <h5>Bass Line</h5>
            <div class="bass-notes">${bassNotes}</div>
        </div>
    `;
}

export function renderMelodyIdeas(melodyIdeas, container) {
    const melodyContainer = document.getElementById(container);
    if (!melodyContainer) return;
    
    melodyContainer.innerHTML = '';
    
    melodyIdeas.forEach((idea, index) => {
        const melodyCard = document.createElement('div');
        melodyCard.className = 'melody-card';
        melodyCard.dataset.melodyIndex = index;
        
        melodyCard.innerHTML = `
            <h4>${idea.name}</h4>
            <p>${idea.description}</p>
            <div class="melody-preview">${idea.pattern.join(' - ')}</div>
        `;
        
        melodyCard.addEventListener('click', () => {
            selectOption(melodyCard, 'melody-idea');
            displayMelody(idea);
        });
        
        melodyContainer.appendChild(melodyCard);
    });
}

export function displayMelody(melodyIdea) {
    const melodyDisplay = document.getElementById('melody-display');
    if (!melodyDisplay || !melodyIdea) return;
    
    melodyDisplay.innerHTML = `
        <div class="melody-display">
            <h5>${melodyIdea.name}</h5>
            <div class="melody-notes">${melodyIdea.pattern.join(' - ')}</div>
            <div class="rhythm-info">Rhythm: ${melodyIdea.rhythm} notes</div>
        </div>
    `;
}

export function renderSongStructure(structures, container) {
    const structureContainer = document.getElementById(container);
    if (!structureContainer) return;
    
    const templatesDiv = structureContainer.querySelector('.structure-templates');
    const editorDiv = structureContainer.querySelector('.structure-editor');
    
    if (!templatesDiv || !editorDiv) return;
    
    templatesDiv.innerHTML = '<h4>Choose a Template</h4>';
    editorDiv.innerHTML = '<h4>Your Song Structure</h4><div id="structure-sections"></div>';
    
    structures.forEach((structure, index) => {
        const structureCard = document.createElement('div');
        structureCard.className = 'option-card';
        structureCard.dataset.structureIndex = index;
        
        structureCard.innerHTML = `
            <h4>${structure.name}</h4>
            <p>${structure.sections.join(' → ')}</p>
        `;
        
        structureCard.addEventListener('click', () => {
            selectOption(structureCard, 'song-structure');
            displaySongStructure(structure);
        });
        
        templatesDiv.appendChild(structureCard);
    });
}

export function displaySongStructure(structure) {
    const sectionsContainer = document.getElementById('structure-sections');
    if (!sectionsContainer) return;
    
    sectionsContainer.innerHTML = '';
    
    structure.sections.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'structure-section';
        sectionDiv.innerHTML = `
            <span class="section-number">${index + 1}</span>
            <span class="section-name">${section}</span>
        `;
        sectionsContainer.appendChild(sectionDiv);
    });
}

export function renderArrangementTips(arrangementTips, container) {
    const arrangementContainer = document.getElementById(container);
    if (!arrangementContainer) return;
    
    arrangementContainer.innerHTML = '<h3>Arrangement Suggestions</h3>';
    
    Object.entries(arrangementTips).forEach(([section, tip]) => {
        const tipDiv = document.createElement('div');
        tipDiv.className = 'arrangement-tip';
        tipDiv.innerHTML = `
            <h4>${section}</h4>
            <p>${tip}</p>
        `;
        arrangementContainer.appendChild(tipDiv);
    });
}

export function renderThematicWords(words, container) {
    const wordsContainer = document.getElementById(container);
    if (!wordsContainer) return;
    
    wordsContainer.innerHTML = '';
    
    words.forEach(word => {
        const wordTag = document.createElement('span');
        wordTag.className = 'word-tag';
        wordTag.textContent = word;
        wordTag.addEventListener('click', () => addWordToLyrics(word));
        wordsContainer.appendChild(wordTag);
    });
}

function addWordToLyrics(word) {
    const lyricsTextarea = document.getElementById('lyrics-text');
    if (lyricsTextarea) {
        const currentText = lyricsTextarea.value;
        const caretPos = lyricsTextarea.selectionStart;
        const newText = currentText.substring(0, caretPos) + word + ' ' + currentText.substring(caretPos);
        lyricsTextarea.value = newText;
        lyricsTextarea.focus();
        lyricsTextarea.setSelectionRange(caretPos + word.length + 1, caretPos + word.length + 1);
    }
}

export function renderSongSummary(songData, container) {
    const summaryContainer = document.getElementById(container);
    if (!summaryContainer) return;
    
    summaryContainer.innerHTML = `
        <h3>Your Complete Song Plan</h3>
        <div class="summary-grid">
            <div class="summary-section">
                <h4>Foundation</h4>
                <p><strong>Mood:</strong> ${songData.mood?.name || 'Not set'}</p>
                <p><strong>Genre:</strong> ${songData.genre?.name || 'Not set'}</p>
                <p><strong>Key:</strong> ${songData.key || 'Not set'}</p>
                <p><strong>Scale:</strong> ${songData.scale || 'Not set'}</p>
                <p><strong>Tempo:</strong> ${songData.tempo || 'Not set'} BPM</p>
            </div>
            <div class="summary-section">
                <h4>Musical Elements</h4>
                <p><strong>Chords:</strong> ${songData.chordProgression?.chords.join(' - ') || 'Not set'}</p>
                <p><strong>Drum Pattern:</strong> ${songData.drumPattern?.name || 'Not set'}</p>
                <p><strong>Bass Line:</strong> ${songData.bassLine?.map(note => note.note).join(' - ') || 'Not set'}</p>
            </div>
            <div class="summary-section">
                <h4>Structure</h4>
                <p><strong>Song Structure:</strong> ${songData.songStructure?.join(' → ') || 'Not set'}</p>
                <p><strong>Melody:</strong> ${songData.melodyIdea?.name || 'Not set'}</p>
            </div>
        </div>
        ${songData.lyrics ? `<div class="lyrics-summary"><h4>Lyrics</h4><pre>${songData.lyrics}</pre></div>` : ''}
    `;
}

export function selectOption(cardElement, optionType) {
    // Remove selection from siblings
    const siblings = cardElement.parentNode.querySelectorAll('.option-card, .chord-card, .drum-card, .bass-card, .melody-card');
    siblings.forEach(sibling => sibling.classList.remove('selected'));
    
    // Add selection to clicked card
    cardElement.classList.add('selected');
    
    // Enable next button if available
    const currentSection = cardElement.closest('.step-section');
    const nextButton = currentSection?.querySelector('.next-button');
    if (nextButton) {
        nextButton.disabled = false;
    }
    
    // Trigger custom event for the main app to handle
    document.dispatchEvent(new CustomEvent('optionSelected', {
        detail: {
            type: optionType,
            element: cardElement
        }
    }));
}

export function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function enableButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = false;
    }
}

export function disableButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = true;
    }
}

export function showMessage(message, type = 'info') {
    // Create a simple toast message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    let backgroundColor = 'var(--primary-color)';
    if (type === 'error') backgroundColor = 'var(--error-color)';
    else if (type === 'success') backgroundColor = 'var(--success-color)';
    else if (type === 'warning') backgroundColor = 'var(--warning-color)';
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${backgroundColor};
        color: white;
        border-radius: var(--border-radius);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: var(--box-shadow-lg);
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}