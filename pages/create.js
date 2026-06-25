import { createQuestion, updateQuestion, getQuestion, getSubjects } from '../js/appwrite.js';
import { router, updatePageLinks } from '../js/router.js';
import { escHtml, showError } from '../js/utils.js';

export async function renderCreate(questionId = null) {
    const content = document.getElementById('app-content');
    
    let existingQuestion = null;
    let allSubjects = [];
    
    try {
        allSubjects = await getSubjects();
        
        if (questionId) {
            existingQuestion = await getQuestion(questionId);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    
    const isEdit = !!existingQuestion;
    
    content.innerHTML = `
        <h1>${isEdit ? 'Edit' : 'Create New'} Question</h1>

        <form id="question-form">
            <div class="form-group">
                <label for="question">Question *</label>
                <textarea id="question" name="question" rows="3" required maxlength="1000">${escHtml(existingQuestion?.question)}</textarea>
                <small>Max 1000 characters</small>
            </div>

            <div class="options-group">
                <div class="form-group">
                    <label for="optionA">Option A *</label>
                    <input type="text" id="optionA" name="optionA" required maxlength="500" value="${escHtml(existingQuestion?.optionA)}">
                </div>

                <div class="form-group">
                    <label for="optionB">Option B *</label>
                    <input type="text" id="optionB" name="optionB" required maxlength="500" value="${escHtml(existingQuestion?.optionB)}">
                </div>

                <div class="form-group">
                    <label for="optionC">Option C *</label>
                    <input type="text" id="optionC" name="optionC" required maxlength="500" value="${escHtml(existingQuestion?.optionC)}">
                </div>

                <div class="form-group">
                    <label for="optionD">Option D *</label>
                    <input type="text" id="optionD" name="optionD" required maxlength="500" value="${escHtml(existingQuestion?.optionD)}">
                </div>
            </div>

            <div class="form-group">
                <label for="correctAnswer">Correct Answer *</label>
                <select id="correctAnswer" name="correctAnswer" required>
                    <option value="">Select correct answer</option>
                    <option value="0" ${existingQuestion?.correctAnswer == 0 ? 'selected' : ''}>A</option>
                    <option value="1" ${existingQuestion?.correctAnswer == 1 ? 'selected' : ''}>B</option>
                    <option value="2" ${existingQuestion?.correctAnswer == 2 ? 'selected' : ''}>C</option>
                    <option value="3" ${existingQuestion?.correctAnswer == 3 ? 'selected' : ''}>D</option>
                </select>
            </div>

            <div class="form-group">
                <label for="subject">Subject *</label>
                <input type="text" id="subject" name="subject" list="subjects-list" required maxlength="100" value="${escHtml(existingQuestion?.subject)}">
                <datalist id="subjects-list">
                    ${allSubjects.map(subject => `<option value="${escHtml(subject)}">`).join('')}
                </datalist>
                <small>Type a new subject or select from existing ones</small>
            </div>

            <div class="form-group">
                <label for="explanation">Explanation (Optional)</label>
                <textarea id="explanation" name="explanation" rows="3" maxlength="2000">${escHtml(existingQuestion?.explanation)}</textarea>
                <small>Max 2000 characters</small>
            </div>
            
            ${isEdit ? `
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="learnt" name="learnt" ${existingQuestion?.learnt ? 'checked' : ''}>
                        Mark as learnt
                    </label>
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 1rem;">
                <button type="submit">${isEdit ? 'Update' : 'Create'} Question</button>
                <a href="/questions" data-navigo><button type="button" class="outline">Cancel</button></a>
            </div>
        </form>
    `;
    // Update links after content is loaded
    updatePageLinks();
    
    // Handle form submission
    document.getElementById('question-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Saving…';

        const data = new FormData(e.target);
        const formData = {
            question: data.get('question').trim(),
            optionA: data.get('optionA').trim(),
            optionB: data.get('optionB').trim(),
            optionC: data.get('optionC').trim(),
            optionD: data.get('optionD').trim(),
            correctAnswer: parseInt(data.get('correctAnswer')),
            subject: data.get('subject').trim(),
            explanation: data.get('explanation').trim(),
            learnt: isEdit ? data.has('learnt') : false
        };

        try {
            if (isEdit) {
                await updateQuestion(questionId, formData);
            } else {
                await createQuestion(formData);
            }
            router.navigate('/questions');
        } catch (error) {
            btn.disabled = false;
            btn.textContent = originalText;
            showError(`Error ${isEdit ? 'updating' : 'creating'} question: ${error.message}`);
        }
    });
}
