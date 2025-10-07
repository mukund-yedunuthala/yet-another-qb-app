<script>
  import { goto } from '$app/navigation';

  // Form state
  let formData = {
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    subject: '',
    explanation: ''
  };

  // Validation errors
  let errors = {};

  // Form submission state
  let isSubmitting = false;
  let showSuccess = false;

  // Validate form
  function validateForm() {
    errors = {};

    if (!formData.question.trim()) {
      errors.question = 'Question is required';
    }

    if (!formData.optionA.trim()) {
      errors.optionA = 'Option A is required';
    }

    if (!formData.optionB.trim()) {
      errors.optionB = 'Option B is required';
    }

    if (!formData.optionC.trim()) {
      errors.optionC = 'Option C is required';
    }

    if (!formData.optionD.trim()) {
      errors.optionD = 'Option D is required';
    }

    if (!formData.correctAnswer) {
      errors.correctAnswer = 'Please select the correct answer';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    return Object.keys(errors).length === 0;
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    isSubmitting = true;

    // Simulate API call (replace with Appwrite later)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create question object
    const question = {
      id: Date.now(),
      question: formData.question,
      options: [
        formData.optionA,
        formData.optionB,
        formData.optionC,
        formData.optionD
      ],
      correctAnswer: parseInt(formData.correctAnswer),
      subject: formData.subject,
      explanation: formData.explanation
    };

    console.log('Question created:', question);
    // TODO: Save to Appwrite here

    isSubmitting = false;
    showSuccess = true;

    // Reset form
    formData = {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      subject: '',
      explanation: ''
    };

    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccess = false;
    }, 3000);
  }

  // Handle input changes
  function handleInput(field) {
    return (event) => {
      formData[field] = event.target.value;
      // Clear error when user starts typing
      if (errors[field]) {
        delete errors[field];
        errors = errors;
      }
    };
  }
</script>

<svelte:head>
  <title>Add Question - QuizBank</title>
</svelte:head>

<div class="container">
  <div class="page-header">
    <h1 class="page-title">Add New Question</h1>
    <p class="page-subtitle">Create a multiple choice question with explanations</p>
  </div>

  {#if showSuccess}
    <div class="success-message">
      <span class="success-icon">✓</span>
      Question added successfully!
    </div>
  {/if}

  <form class="question-form" on:submit={handleSubmit} novalidate>
    <!-- Question Text -->
    <div class="form-group">
      <label for="question" class="form-label">
        Question <span class="required">*</span>
      </label>
      <textarea
        id="question"
        class="form-input"
        class:error={errors.question}
        rows="3"
        placeholder="Enter your question here..."
        value={formData.question}
        on:input={handleInput('question')}
      ></textarea>
      {#if errors.question}
        <span class="error-message">{errors.question}</span>
      {/if}
    </div>

    <!-- Options Section -->
    <div class="options-section">
      <h3 class="section-title">Answer Options</h3>
      
      <div class="options-grid">
        <!-- Option A -->
        <div class="form-group">
          <label for="optionA" class="form-label">
            <span class="option-badge">A</span> Option A <span class="required">*</span>
          </label>
          <input
            type="text"
            id="optionA"
            class="form-input"
            class:error={errors.optionA}
            placeholder="Enter option A"
            value={formData.optionA}
            on:input={handleInput('optionA')}
          />
          {#if errors.optionA}
            <span class="error-message">{errors.optionA}</span>
          {/if}
        </div>

        <!-- Option B -->
        <div class="form-group">
          <label for="optionB" class="form-label">
            <span class="option-badge">B</span> Option B <span class="required">*</span>
          </label>
          <input
            type="text"
            id="optionB"
            class="form-input"
            class:error={errors.optionB}
            placeholder="Enter option B"
            value={formData.optionB}
            on:input={handleInput('optionB')}
          />
          {#if errors.optionB}
            <span class="error-message">{errors.optionB}</span>
          {/if}
        </div>

        <!-- Option C -->
        <div class="form-group">
          <label for="optionC" class="form-label">
            <span class="option-badge">C</span> Option C <span class="required">*</span>
          </label>
          <input
            type="text"
            id="optionC"
            class="form-input"
            class:error={errors.optionC}
            placeholder="Enter option C"
            value={formData.optionC}
            on:input={handleInput('optionC')}
          />
          {#if errors.optionC}
            <span class="error-message">{errors.optionC}</span>
          {/if}
        </div>

        <!-- Option D -->
        <div class="form-group">
          <label for="optionD" class="form-label">
            <span class="option-badge">D</span> Option D <span class="required">*</span>
          </label>
          <input
            type="text"
            id="optionD"
            class="form-input"
            class:error={errors.optionD}
            placeholder="Enter option D"
            value={formData.optionD}
            on:input={handleInput('optionD')}
          />
          {#if errors.optionD}
            <span class="error-message">{errors.optionD}</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Correct Answer -->
    <div class="form-group">
      <label class="form-label">
        Correct Answer <span class="required">*</span>
      </label>
      <div class="radio-group">
        <label class="radio-option">
          <input
            type="radio"
            name="correctAnswer"
            value="0"
            bind:group={formData.correctAnswer}
          />
          <span class="radio-label">Option A</span>
        </label>

        <label class="radio-option">
          <input
            type="radio"
            name="correctAnswer"
            value="1"
            bind:group={formData.correctAnswer}
          />
          <span class="radio-label">Option B</span>
        </label>

        <label class="radio-option">
          <input
            type="radio"
            name="correctAnswer"
            value="2"
            bind:group={formData.correctAnswer}
          />
          <span class="radio-label">Option C</span>
        </label>

        <label class="radio-option">
          <input
            type="radio"
            name="correctAnswer"
            value="3"
            bind:group={formData.correctAnswer}
          />
          <span class="radio-label">Option D</span>
        </label>
      </div>
      {#if errors.correctAnswer}
        <span class="error-message">{errors.correctAnswer}</span>
      {/if}
    </div>

    <!-- Subject -->
    <div class="form-group">
      <label for="subject" class="form-label">
        Subject <span class="required">*</span>
      </label>
      <input
        type="text"
        id="subject"
        class="form-input"
        class:error={errors.subject}
        placeholder="e.g., Mathematics, Science, History..."
        value={formData.subject}
        on:input={handleInput('subject')}
      />
      {#if errors.subject}
        <span class="error-message">{errors.subject}</span>
      {/if}
    </div>

    <!-- Explanation -->
    <div class="form-group">
      <label for="explanation" class="form-label">
        Explanation <span class="optional">(optional)</span>
      </label>
      <textarea
        id="explanation"
        class="form-input"
        rows="4"
        placeholder="Provide an explanation for the correct answer..."
        value={formData.explanation}
        on:input={handleInput('explanation')}
      ></textarea>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button
        type="button"
        class="btn-secondary"
        on:click={() => goto('/questions')}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Question'}
      </button>
    </div>
  </form>
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .page-subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
  }

  /* Success Message */
  .success-message {
    background: linear-gradient(135deg, #4caf50, #45a049);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .success-icon {
    font-size: 1.5rem;
    font-weight: bold;
  }

  /* Form */
  .question-form {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .required {
    color: #e53e3e;
  }

  .optional {
    color: #999;
    font-weight: 400;
    font-size: 0.85rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
    background: #fafafa;
  }

  .form-input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-input.error {
    border-color: #e53e3e;
    background: #fff5f5;
  }

  textarea.form-input {
    resize: vertical;
    min-height: 100px;
  }

  .error-message {
    display: block;
    color: #e53e3e;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  /* Options Section */
  .section-title {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .options-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
  }

  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .option-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    font-size: 0.85rem;
    font-weight: 700;
    margin-right: 0.25rem;
  }

  /* Radio Group */
  .radio-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .radio-option:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }

  .radio-option input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #667eea;
  }

  .radio-label {
    font-weight: 500;
    color: #555;
  }

  .radio-option:has(input:checked) {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  .radio-option:has(input:checked) .radio-label {
    color: #667eea;
    font-weight: 600;
  }

  /* Form Actions */
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #f0f0f0;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #555;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e0e0e0;
  }

  .btn-secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .question-form {
      padding: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .options-grid {
      grid-template-columns: 1fr;
    }

    .radio-group {
      grid-template-columns: repeat(2, 1fr);
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
    }
  }
</style>
