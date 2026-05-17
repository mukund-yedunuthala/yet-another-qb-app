import { getQuestions, getQuestionsBySubject, deleteQuestion, markAsLearnt, getSubjects } from '../js/appwrite.js';
import { updatePageLinks, router } from '../js/router.js';
import { escHtml, showError } from '../js/utils.js';

const optionLabels = ['A', 'B', 'C', 'D'];
let currentFilterSubject = null;
let allQuestions = [];

export async function renderQuestions(filterSubject = null) {
    const content = document.getElementById('app-content');
    currentFilterSubject = filterSubject;

    content.innerHTML = '<div class="loading">Loading questions...</div>';

    try {
        const allSubjects = await getSubjects();
        allQuestions = filterSubject
            ? await getQuestionsBySubject(filterSubject)
            : await getQuestions();

        if (allQuestions.length === 0) {
            content.innerHTML = `
                <h1>Questions</h1>
                <p>No questions found. <a href="/create" data-navigo>Create your first question</a>.</p>
            `;
            updatePageLinks();
            return;
        }

        content.innerHTML = `
            <h1>Questions ${filterSubject ? `- ${escHtml(filterSubject)}` : ''}</h1>

            <div class="filter-bar">
                <label>
                    Filter by subject:
                    <select id="subject-filter" onchange="filterBySubject(this.value)">
                        <option value="">All Subjects</option>
                        ${allSubjects.map(subject =>
                            `<option value="${escHtml(subject)}" ${subject === filterSubject ? 'selected' : ''}>${escHtml(subject)}</option>`
                        ).join('')}
                    </select>
                </label>
                <label>
                    Search:
                    <input type="search" id="question-search" placeholder="Search questions..." oninput="filterBySearch(this.value)">
                </label>
                <span id="question-count">Total: ${allQuestions.length} questions</span>
            </div>
            <div id="question-cards"></div>
        `;

        renderCards(allQuestions);
        updatePageLinks();

    } catch (error) {
        content.innerHTML = `
            <h1>Error</h1>
            <p>Failed to load questions. Please check your Appwrite configuration.</p>
            <p><small>${escHtml(error.message)}</small></p>
        `;
        updatePageLinks();
    }
}

function renderCards(questions) {
    const container = document.getElementById('question-cards');
    const countEl = document.getElementById('question-count');
    if (!container) return;

    if (countEl) countEl.textContent = `Total: ${questions.length} questions`;

    if (questions.length === 0) {
        container.innerHTML = '<p>No questions match your search.</p>';
        return;
    }

    let html = '';
    questions.forEach(q => {
        const options = [q.optionA, q.optionB, q.optionC, q.optionD];
        html += `
            <div class="question-card ${q.learnt ? 'learnt' : ''}">
                <h3>${escHtml(q.question)}</h3>
                <ul class="options-list">
                    ${options.map((option, index) => {
                        const isCorrect = index === parseInt(q.correctAnswer);
                        return `
                            <li class="${isCorrect ? 'correct' : ''}">
                                <strong>${optionLabels[index]}.</strong> ${escHtml(option)}
                                ${isCorrect ? ' ✓' : ''}
                            </li>
                        `;
                    }).join('')}
                </ul>
                ${q.explanation ? `
                    <div class="explanation">
                        <strong>Explanation:</strong> ${escHtml(q.explanation)}
                    </div>
                ` : ''}

                <div class="question-actions">
                    <button onclick="toggleLearnt('${q.$id}', ${!q.learnt})" class="${q.learnt ? 'outline' : ''}">
                        ${q.learnt ? 'Mark as Not Learnt' : 'Mark as Learnt'}
                    </button>
                    <button class="outline" onclick="editQuestion('${q.$id}')">Edit</button>
                    <button class="outline" onclick="deleteQuestionHandler('${q.$id}')">Delete</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}


window.filterBySubject = function(subject) {
    if (subject) {
        router.navigate(`/questions/${encodeURIComponent(subject)}`);
    } else {
        router.navigate('/questions');
    }
};

window.filterBySearch = function(text) {
    const lower = text.toLowerCase();
    const filtered = lower
        ? allQuestions.filter(q => q.question.toLowerCase().includes(lower))
        : allQuestions;
    renderCards(filtered);
};

window.toggleLearnt = async function(id, learnt) {
    try {
        await markAsLearnt(id, learnt);
        renderQuestions(currentFilterSubject);
    } catch (error) {
        showError('Error updating question: ' + error.message);
    }
};

window.editQuestion = function(id) {
    router.navigate('/edit/' + id);
};

window.deleteQuestionHandler = async function(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        try {
            await deleteQuestion(id);
            renderQuestions(currentFilterSubject);
        } catch (error) {
            showError('Error deleting question: ' + error.message);
        }
    }
};
