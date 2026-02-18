import { getQuestions, getQuestionsBySubject, deleteQuestion, markAsLearnt, getSubjects } from '../js/appwrite.js';
import { updatePageLinks, router } from '../js/router.js'; 

const optionLabels = ['A', 'B', 'C', 'D'];

export async function renderQuestions(filterSubject = null) {
    const content = document.getElementById('app-content');
    
    content.innerHTML = '<div class="loading">Loading questions...</div>';
    
    try {
        const allSubjects = await getSubjects();
        const questions = filterSubject 
            ? await getQuestionsBySubject(filterSubject)
            : await getQuestions();
        
        if (questions.length === 0) {
            content.innerHTML = `
                <h1>Questions</h1>
                <p>No questions found. <a href="/create" data-navigo>Create your first question</a>.</p>
            `;
            updatePageLinks();
            return;
        }
        
        let html = `
            <h1>Questions ${filterSubject ? `- ${filterSubject}` : ''}</h1>
            
            <div class="filter-bar">
                <label>
                    Filter by subject:
                    <select id="subject-filter" onchange="filterBySubject(this.value)">
                        <option value="">All Subjects</option>
                        ${allSubjects.map(subject => 
                            `<option value="${subject}" ${subject === filterSubject ? 'selected' : ''}>${subject}</option>`
                        ).join('')}
                    </select>
                </label>
                <span>Total: ${questions.length} questions</span>
            </div>
        `;
        
        questions.forEach(q => {
            const options = [q.optionA, q.optionB, q.optionC, q.optionD];
                    html += `
                        <div class="question-card ${q.learnt ? 'learnt' : ''}">
                            <h3>${q.question}</h3>
                            <ul class="options-list">
                                ${options.map((option, index) => {
                                    const isCorrect = index === parseInt(q.correctAnswer);
                                    return `
                                        <li class="${isCorrect ? 'correct' : ''}">
                                            <strong>${optionLabels[index]}.</strong> ${option}
                                            ${isCorrect ? ' ✓' : ''}
                                        </li>
                                    `;
                                }).join('')}
                            </ul>
                    ${q.explanation ? `
                        <div class="explanation">
                            <strong>Explanation:</strong> ${q.explanation}
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
        
        content.innerHTML = html;
        updatePageLinks();
        
    } catch (error) {
        content.innerHTML = `
            <h1>Error</h1>
            <p>Failed to load questions. Please check your Appwrite configuration.</p>
            <p><small>${error.message}</small></p>
        `;
        updatePageLinks();
    }
}


window.filterBySubject = function(subject) {
    if (subject) {
        // Use router.navigate with proper encoding
        router.navigate(`/questions/${encodeURIComponent(subject)}`);
    } else {
        router.navigate('/questions');
    }
};

window.toggleLearnt = async function(id, learnt) {
    try {
        await markAsLearnt(id, learnt);
        // Refresh current view
        const currentSubject = window.location.hash.includes('/questions/') 
            ? window.location.hash.split('/questions/')[1] 
            : null;
        renderQuestions(currentSubject);
    } catch (error) {
        alert('Error updating question: ' + error.message);
    }
};

window.editQuestion = function(id) {
    window.location.hash = `/edit/${id}`;
};

window.deleteQuestionHandler = async function(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        try {
            await deleteQuestion(id);
            // Refresh current view
            const currentSubject = window.location.hash.includes('/questions/') 
                ? window.location.hash.split('/questions/')[1] 
                : null;
            renderQuestions(currentSubject);
        } catch (error) {
            alert('Error deleting question: ' + error.message);
        }
    }
};
