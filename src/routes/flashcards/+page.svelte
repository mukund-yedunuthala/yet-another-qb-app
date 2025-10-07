<script>
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  // Placeholder data - will be replaced with Appwrite data later
  let allQuestions = [
    {
      id: 1,
      subject: 'Mathematics',
      question: 'What is 2 + 2?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
      explanation: 'Addition is a basic arithmetic operation. When we add 2 and 2, we get 4.',
      learnt: false
    },
    {
      id: 2,
      subject: 'Science',
      question: 'What is the chemical symbol for water?',
      options: ['H2O', 'CO2', 'O2', 'NaCl'],
      correctAnswer: 0,
      explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.',
      learnt: false
    },
    {
      id: 3,
      subject: 'History',
      question: 'In which year did World War II end?',
      options: ['1943', '1944', '1945', '1946'],
      correctAnswer: 2,
      explanation: 'World War II ended in 1945 with Germany surrendering in May and Japan in August.',
      learnt: false
    },
    {
      id: 4,
      subject: 'Geography',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      explanation: 'Paris has been the capital of France since the 12th century.',
      learnt: false
    },
    {
      id: 5,
      subject: 'Literature',
      question: 'Who wrote "Romeo and Juliet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
      correctAnswer: 1,
      explanation: 'William Shakespeare wrote this famous tragedy in the early years of his career.',
      learnt: true
    }
  ];

  // Session state
  let sessionActive = false;
  let currentQuestion = null;
  let selectedAnswer = null;
  let answerSubmitted = false;
  let isCorrect = false;
  let sessionStats = {
    total: 0,
    correct: 0,
    incorrect: 0,
    learnt: 0
  };

  // Settings
  let skipLearnt = true;
  let showExplanations = true;

  // Get questions for the session
  $: availableQuestions = skipLearnt 
    ? allQuestions.filter(q => !q.learnt)
    : allQuestions;

  $: hasQuestions = availableQuestions.length > 0;

  // Start study session
  function startSession() {
    if (!hasQuestions) return;
    
    sessionActive = true;
    sessionStats = {
      total: 0,
      correct: 0,
      incorrect: 0,
      learnt: 0
    };
    loadNextQuestion();
  }

  // Load a random question
  function loadNextQuestion() {
    selectedAnswer = null;
    answerSubmitted = false;
    isCorrect = false;

    const unaskedQuestions = skipLearnt 
      ? availableQuestions.filter(q => !q.learnt)
      : availableQuestions;

    if (unaskedQuestions.length === 0) {
      endSession();
      return;
    }

    const randomIndex = Math.floor(Math.random() * unaskedQuestions.length);
    currentQuestion = unaskedQuestions[randomIndex];
  }

  // Handle answer selection
  function selectAnswer(index) {
    if (answerSubmitted) return;
    selectedAnswer = index;
  }

  // Submit answer
  function submitAnswer() {
    if (selectedAnswer === null) return;

    answerSubmitted = true;
    isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    sessionStats.total++;
    if (isCorrect) {
      sessionStats.correct++;
    } else {
      sessionStats.incorrect++;
    }
  }

  // Mark question as learnt
  function markAsLearnt() {
    const questionIndex = allQuestions.findIndex(q => q.id === currentQuestion.id);
    if (questionIndex !== -1) {
      allQuestions[questionIndex].learnt = true;
      allQuestions = allQuestions; // Trigger reactivity
      sessionStats.learnt++;
      
      // TODO: Update in Appwrite database
      console.log('Marked as learnt:', currentQuestion.id);
    }
  }

  // Continue to next question
  function nextQuestion() {
    loadNextQuestion();
  }

  // End session
  function endSession() {
    sessionActive = false;
    currentQuestion = null;
  }

  // Calculate accuracy
  $: accuracy = sessionStats.total > 0 
    ? Math.round((sessionStats.correct / sessionStats.total) * 100) 
    : 0;
</script>

<svelte:head>
  <title>Flashcards - QuizBank</title>
</svelte:head>

<div class="container">
  {#if !sessionActive}
    <!-- Start Screen -->
    <div class="start-screen" in:fade={{ duration: 300 }}>
      <div class="start-content">
        <div class="flashcard-icon">🎯</div>
        <h1 class="start-title">Flashcard Study Mode</h1>
        <p class="start-subtitle">Test your knowledge with interactive flashcards</p>

        <div class="session-stats">
          <div class="stat-item">
            <div class="stat-icon">📚</div>
            <div class="stat-text">
              <div class="stat-value">{allQuestions.length}</div>
              <div class="stat-label">Total Questions</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">✓</div>
            <div class="stat-text">
              <div class="stat-value">{allQuestions.filter(q => q.learnt).length}</div>
              <div class="stat-label">Marked as Learnt</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🎲</div>
            <div class="stat-text">
              <div class="stat-value">{availableQuestions.length}</div>
              <div class="stat-label">Available to Study</div>
            </div>
          </div>
        </div>

        <div class="settings">
          <h3 class="settings-title">Study Settings</h3>
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={skipLearnt} />
            <span>Skip questions marked as learnt</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={showExplanations} />
            <span>Show explanations after answering</span>
          </label>
        </div>

        {#if hasQuestions}
          <button class="btn-start" on:click={startSession}>
            Start Studying
          </button>
        {:else}
          <div class="no-questions">
            <p>No questions available for study.</p>
            {#if skipLearnt}
              <p class="hint">Try disabling "Skip learnt questions" or add more questions.</p>
            {/if}
            <a href="/add" class="btn-secondary">Add Questions</a>
          </div>
        {/if}
      </div>
    </div>
  {:else if currentQuestion}
    <!-- Active Study Session -->
    <div class="study-screen">
      <!-- Session Header -->
      <div class="session-header">
        <div class="session-info">
          <span class="subject-badge">{currentQuestion.subject}</span>
          <span class="question-number">Question #{currentQuestion.id}</span>
        </div>
        <div class="session-progress">
          <div class="progress-item correct">
            <span class="progress-icon">✓</span>
            <span class="progress-count">{sessionStats.correct}</span>
          </div>
          <div class="progress-item incorrect">
            <span class="progress-icon">✗</span>
            <span class="progress-count">{sessionStats.incorrect}</span>
          </div>
          <div class="progress-item accuracy">
            <span class="progress-label">Accuracy:</span>
            <span class="progress-count">{accuracy}%</span>
          </div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="flashcard" in:fly={{ y: 50, duration: 400, easing: cubicOut }}>
        <div class="flashcard-header">
          <h2 class="flashcard-question">{currentQuestion.question}</h2>
        </div>

        <div class="flashcard-options">
          {#each currentQuestion.options as option, index}
            <button
              class="flashcard-option"
              class:selected={selectedAnswer === index}
              class:correct={answerSubmitted && index === currentQuestion.correctAnswer}
              class:incorrect={answerSubmitted && selectedAnswer === index && !isCorrect}
              class:disabled={answerSubmitted}
              on:click={() => selectAnswer(index)}
              disabled={answerSubmitted}
            >
              <span class="option-letter">{String.fromCharCode(65 + index)}</span>
              <span class="option-text">{option}</span>
              {#if answerSubmitted && index === currentQuestion.correctAnswer}
                <span class="result-icon correct-icon" in:scale={{ duration: 300 }}>✓</span>
              {:else if answerSubmitted && selectedAnswer === index && !isCorrect}
                <span class="result-icon incorrect-icon" in:scale={{ duration: 300 }}>✗</span>
              {/if}
            </button>
          {/each}
        </div>

        {#if !answerSubmitted}
          <div class="flashcard-actions">
            <button class="btn-submit" on:click={submitAnswer} disabled={selectedAnswer === null}>
              Check Answer
            </button>
          </div>
        {/if}
      </div>

      <!-- Feedback Section -->
      {#if answerSubmitted}
        <div class="feedback-section" in:fly={{ y: 20, duration: 400, easing: cubicOut }}>
          <div class="feedback-result" class:correct={isCorrect} class:incorrect={!isCorrect}>
            <div class="feedback-icon">
              {isCorrect ? '🎉' : '📖'}
            </div>
            <div class="feedback-text">
              <h3 class="feedback-title">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              <p class="feedback-message">
                {isCorrect 
                  ? 'Great job! You got it right.' 
                  : `The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`
                }
              </p>
            </div>
          </div>

          {#if showExplanations && currentQuestion.explanation}
            <div class="explanation-box">
              <div class="explanation-header">
                <span class="explanation-icon">💡</span>
                <span class="explanation-label">Explanation</span>
              </div>
              <p class="explanation-text">{currentQuestion.explanation}</p>
            </div>
          {/if}

          <div class="feedback-actions">
            {#if !currentQuestion.learnt}
              <button class="btn-learnt" on:click={markAsLearnt}>
                <span class="btn-icon">✓</span>
                Mark as Learnt
              </button>
            {:else}
              <div class="learnt-badge">
                <span class="badge-icon">✓</span>
                Marked as Learnt
              </div>
            {/if}
            <button class="btn-next" on:click={nextQuestion}>
              Next Question
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      {/if}

      <!-- End Session Button -->
      <div class="session-footer">
        <button class="btn-end-session" on:click={endSession}>
          End Session
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    min-height: calc(100vh - 200px);
  }

  /* Start Screen */
  .start-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }

  .start-content {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    text-align: center;
    max-width: 600px;
    width: 100%;
  }

  .flashcard-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .start-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .start-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
  }

  .session-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 12px;
  }

  .stat-icon {
    font-size: 1.8rem;
  }

  .stat-text {
    text-align: left;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .settings {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    text-align: left;
  }

  .settings-title {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    cursor: pointer;
    font-size: 0.95rem;
    color: #555;
  }

  .checkbox-label input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #667eea;
  }

  .btn-start {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 3rem;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .no-questions {
    padding: 2rem;
    background: #fff5f5;
    border-radius: 12px;
    border: 2px dashed #e53e3e;
  }

  .no-questions p {
    color: #c33;
    margin-bottom: 0.5rem;
  }

  .hint {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #555;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    background: #e0e0e0;
  }

  /* Study Screen */
  .study-screen {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .session-header {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .session-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .subject-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .question-number {
    color: #666;
    font-size: 0.9rem;
  }

  .session-progress {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .progress-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .progress-item.correct {
    color: #4caf50;
  }

  .progress-item.incorrect {
    color: #e53e3e;
  }

  .progress-item.accuracy {
    color: #667eea;
  }

  .progress-icon {
    font-size: 1.2rem;
  }

  .progress-count {
    font-size: 1.1rem;
  }

  .progress-label {
    font-size: 0.9rem;
  }

  /* Flashcard */
  .flashcard {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .flashcard-header {
    margin-bottom: 2rem;
  }

  .flashcard-question {
    font-size: 1.8rem;
    color: #333;
    line-height: 1.5;
    font-weight: 600;
  }

  .flashcard-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .flashcard-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: #f8f9fa;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    font-size: 1rem;
  }

  .flashcard-option:hover:not(.disabled) {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: translateX(4px);
  }

  .flashcard-option.selected:not(.disabled) {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  .flashcard-option.correct {
    border-color: #4caf50;
    background: rgba(76, 175, 80, 0.1);
  }

  .flashcard-option.incorrect {
    border-color: #e53e3e;
    background: rgba(229, 62, 62, 0.1);
  }

  .flashcard-option.disabled {
    cursor: not-allowed;
  }

  .option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    background: white;
    border-radius: 50%;
    font-weight: 700;
    color: #667eea;
    font-size: 1rem;
  }

  .flashcard-option.correct .option-letter {
    background: #4caf50;
    color: white;
  }

  .flashcard-option.incorrect .option-letter {
    background: #e53e3e;
    color: white;
  }

  .option-text {
    flex: 1;
    color: #555;
    font-weight: 500;
  }

  .result-icon {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .correct-icon {
    color: #4caf50;
  }

  .incorrect-icon {
    color: #e53e3e;
  }

  .flashcard-actions {
    display: flex;
    justify-content: center;
  }

  .btn-submit {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 3rem;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Feedback Section */
  .feedback-section {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .feedback-result {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }

  .feedback-result.correct {
    background: rgba(76, 175, 80, 0.1);
    border: 2px solid #4caf50;
  }

  .feedback-result.incorrect {
    background: rgba(229, 62, 62, 0.1);
    border: 2px solid #e53e3e;
  }

  .feedback-icon {
    font-size: 3rem;
  }

  .feedback-text {
    flex: 1;
  }

  .feedback-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .feedback-result.correct .feedback-title {
    color: #4caf50;
  }

  .feedback-result.incorrect .feedback-title {
    color: #e53e3e;
  }

  .feedback-message {
    color: #555;
    margin: 0;
  }

  .explanation-box {
    padding: 1.5rem;
    background: #f8f9fa;
    border-left: 4px solid #667eea;
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }

  .explanation-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .explanation-icon {
    font-size: 1.3rem;
  }

  .explanation-label {
    font-weight: 600;
    color: #667eea;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .explanation-text {
    color: #555;
    line-height: 1.7;
    margin: 0;
  }

  .feedback-actions {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }

  .btn-learnt {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
    border: 2px solid #4caf50;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-learnt:hover {
    background: rgba(76, 175, 80, 0.2);
    transform: translateY(-2px);
  }

  .learnt-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(76, 175, 80, 0.1);
    border: 2px solid #4caf50;
    border-radius: 10px;
    color: #4caf50;
    font-weight: 600;
  }

  .badge-icon {
    font-size: 1.2rem;
  }

  .btn-next {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-next:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-arrow {
    font-size: 1.2rem;
    font-weight: 700;
  }

  .btn-icon {
    font-size: 1.1rem;
  }

  /* Session Footer */
  .session-footer {
    display: flex;
    justify-content: center;
    padding-top: 1rem;
  }

  .btn-end-session {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-end-session:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .start-content {
      padding: 2rem;
    }

    .start-title {
      font-size: 2rem;
    }

    .flashcard {
      padding: 1.5rem;
    }

    .flashcard-question {
      font-size: 1.4rem;
    }

    .session-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .session-progress {
      width: 100%;
      justify-content: space-between;
    }

    .feedback-result {
      flex-direction: column;
      text-align: center;
    }

    .feedback-actions {
      flex-direction: column;
      width: 100%;
    }

    .btn-learnt,
    .learnt-badge,
    .btn-next {
      width: 100%;
      justify-content: center;
    }
  }
</style>
