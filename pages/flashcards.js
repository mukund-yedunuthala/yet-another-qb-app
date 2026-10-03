import { getQuestions, markAsLearnt } from '../js/appwrite.js';
import { updatePageLinks, router } from '../js/router.js';
import { escHtml, showError } from '../js/utils.js';

const optionLabels = ['A', 'B', 'C', 'D'];
let currentQuestions = [];
let currentIndex = 0;
let showingAnswer = false;
let currentSubject = null;

export async function renderFlashcards(filterSubject = null) {
    const content = document.getElementById('app-content');
    
    content.innerHTML = '<div class="loading">Loading flashcards...</div>';
    
    try {
        const fetched = await getQuestions();
        const allSubjects = [...new Set(fetched.map(q => q.subject))].sort();
        currentSubject = filterSubject;
        currentQuestions = filterSubject
            ? fetched.filter(q => q.subject === filterSubject)
            : fetched;
        
        if (currentQuestions.length === 0) {
            content.innerHTML = `
                <h1>Flashcards</h1>
                <p>No questions available for flashcards. <a href="/create" data-navigo>Create your first question</a>.</p>
            `;
            updatePageLinks();
            return;
        }
        
        currentQuestions = shuffleArray(currentQuestions);
        currentIndex = 0;
        showingAnswer = false;
        
        let html = `
            <h1>Flashcard Mode ${filterSubject ? `- ${escHtml(filterSubject)}` : ''}</h1>

            <div class="filter-bar">
                <label>
                    <span>Filter by subject:</span>
                    <select id="subject-filter" onchange="filterFlashcardsBySubject(this.value)">
                        <option value="">All Subjects</option>
                        ${allSubjects.map(subject =>
                            `<option value="${escHtml(subject)}" ${subject === filterSubject ? 'selected' : ''}>${escHtml(subject)}</option>`
                        ).join('')}
                    </select>
                </label>
                <button class="outline" onclick="shuffleFlashcards()">Shuffle Cards</button>
            </div>
            
            <div id="flashcard-container"></div>
        `;
        
        content.innerHTML = html;
        updatePageLinks();
        renderCurrentFlashcard();
        
    } catch (error) {
        content.innerHTML = `
            <h1>Flashcards</h1>
            <p>Error loading flashcards: ${escHtml(error.message)}</p>
        `;
        updatePageLinks();
    }
}

function renderCurrentFlashcard() {
    const container = document.getElementById('flashcard-container');
    if (!container || currentQuestions.length === 0) return;
    
    const question = currentQuestions[currentIndex];
    const progress = Math.round(((currentIndex + 1) / currentQuestions.length) * 100);
    
    if (!showingAnswer) {
        container.innerHTML = `
            <div class="flashcard-progress">
                <p>Card ${currentIndex + 1} of ${currentQuestions.length} (${progress}%)</p>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>

            <div class="flashcard active" onclick="flipFlashcard()">
                <div class="flashcard-content">
                    <div class="flashcard-label">Question</div>
                    <h2>${escHtml(question.question)}</h2>
                    <div class="flashcard-meta">
                        <span><strong>Subject:</strong> ${escHtml(question.subject)}</span>
                    </div>
                    <div class="flashcard-hint">
                        <p><em>Click to reveal answer</em></p>
                    </div>
                </div>
            </div>
            
            <div class="flashcard-nav">
                <button onclick="previousCard()" ${currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
                <button onclick="flipFlashcard()">Reveal Answer</button>
                <button onclick="nextCard()" ${currentIndex === currentQuestions.length - 1 ? 'disabled' : ''}>Next →</button>
            </div>
        `;
    } else {
        const options = [question.optionA, question.optionB, question.optionC, question.optionD];
        
        container.innerHTML = `
            <div class="flashcard-progress">
                <p>Card ${currentIndex + 1} of ${currentQuestions.length} (${progress}%)</p>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
            
            <div class="flashcard active answer-side" onclick="flipFlashcard()">
                <div class="flashcard-content">
                    <div class="flashcard-label">Answer</div>
                    <h3>${escHtml(question.question)}</h3>
                    <div class="flashcard-options">
                        ${options.map((option, index) => {
                            const isCorrect = index === parseInt(question.correctAnswer);
                            return `
                                <div class="flashcard-option ${isCorrect ? 'correct' : ''}">
                                    <strong>${optionLabels[index]}.</strong> ${escHtml(option)}
                                    ${isCorrect ? ' ✓' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    ${question.explanation ? `
                        <div class="flashcard-explanation">
                            <strong>Explanation:</strong> ${escHtml(question.explanation)}
                        </div>
                    ` : ''}
                    
                    <div class="flashcard-hint">
                        <p><em>Click to see question again</em></p>
                    </div>
                </div>
            </div>
            
            <div class="flashcard-nav">
                <button onclick="previousCard()" ${currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
                <button onclick="toggleLearntFlashcard(${!question.learnt})" class="${question.learnt ? 'outline' : ''}">
                    ${question.learnt ? '✓ Learnt' : 'Mark as Learnt'}
                </button>
                <button onclick="nextCard()" ${currentIndex === currentQuestions.length - 1 ? 'disabled' : ''}>Next →</button>
            </div>
            
            ${currentIndex === currentQuestions.length - 1 ? `
                <div style="text-align: center; margin-top: 2rem;">
                    <p><strong>You've reached the end!</strong></p>
                    <button onclick="restartFlashcards()">Restart from Beginning</button>
                    <a href="/" data-navigo><button class="outline">Back to Home</button></a>
                </div>
            ` : ''}
        `;
    }
    
    // Set via CSSOM rather than an inline style attribute, which the strict
    // Content-Security-Policy blocks (style-src omits 'unsafe-inline').
    const fill = container.querySelector('.progress-fill');
    if (fill) fill.style.width = `${progress}%`;
    
    updatePageLinks();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

window.flipFlashcard = function() {
    showingAnswer = !showingAnswer;
    renderCurrentFlashcard();
};

window.nextCard = function() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        showingAnswer = false;
        renderCurrentFlashcard();
    }
};

window.previousCard = function() {
    if (currentIndex > 0) {
        currentIndex--;
        showingAnswer = false;
        renderCurrentFlashcard();
    }
};

window.shuffleFlashcards = function() {
    currentQuestions = shuffleArray(currentQuestions);
    currentIndex = 0;
    showingAnswer = false;
    renderCurrentFlashcard();
};

window.restartFlashcards = function() {
    currentIndex = 0;
    showingAnswer = false;
    renderCurrentFlashcard();
};

window.filterFlashcardsBySubject = function(subject) {
    if (subject) {
        router.navigate(`/flashcards/${encodeURIComponent(subject)}`);
    } else {
        router.navigate('/flashcards');
    }
};

window.toggleLearntFlashcard = async function(learnt) {
    try {
        const question = currentQuestions[currentIndex];
        await markAsLearnt(question.$id, learnt);
        currentQuestions[currentIndex].learnt = learnt;
        renderCurrentFlashcard();
    } catch (error) {
        showError('Error updating question: ' + error.message);
    }
};
