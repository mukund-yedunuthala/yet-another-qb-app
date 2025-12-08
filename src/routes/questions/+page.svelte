<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { tablesDB, PUBLIC_APPWRITE_DATABASE_ID, PUBLIC_APPWRITE_TABLE_ID } from '$lib/appwrite';

  let questions = [];
  let loading = true;
  let error = null;
  let searchQuery = '';
  let selectedSubject = 'all';
  let expandedExplanations = {};
// Fetch questions from Appwrite
  async function fetchQuestions() {
    loading = true;
    error = null;
    
    try {
      const response = await tablesDB.listRows(
        PUBLIC_APPWRITE_DATABASE_ID, //databaseId
        PUBLIC_APPWRITE_TABLE_ID,
      );
      
      // Transform rows to match our question format
      questions = response.rows.map(row => ({
        id: row.$id,
        subject: row.subject,
        question: row.question,
        options: [row.optionA, row.optionB, row.optionC, row.optionD],
        correctAnswer: row.correctAnswer,
        explanation: row.explanation,
        learnt: row.learnt
      }));
      
    } catch (err) {
      console.error('Error fetching questions:', err);
      error = 'Failed to load questions. Please try again.';
    } finally {
      loading = false;
    }
  }

  // Load questions on component mount
  onMount(() => {
    fetchQuestions();
  });

  // Get unique subjects
  $: subjects = ['all', ...new Set(questions.map(q => q.subject))];

  // Filter questions based on search and subject
  $: filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // Toggle explanation visibility
  function toggleExplanation(questionId) {
    expandedExplanations[questionId] = !expandedExplanations[questionId];
    expandedExplanations = expandedExplanations;
  }
</script>

<svelte:head>
  <title>Questions - Yet Another QB App</title>
</svelte:head>

<div class="container">
  <div class="page-header">
    <h1 class="page-title">Question Bank</h1>
    <p class="page-subtitle">Browse and manage your questions</p>
  </div>

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading questions...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <p>{error}</p>
      <button class="btn-primary" on:click={fetchQuestions}>Retry</button>
    </div>
  {:else}
    <div class="filters">
      <div class="search-box">
        <input
          type="text"
          placeholder="Search questions..."
          bind:value={searchQuery}
          class="search-input"
        />
      </div>

      <div class="filter-box">
        <select bind:value={selectedSubject} class="subject-filter">
          {#each subjects as subject}
            <option value={subject}>
              {subject === 'all' ? 'All Subjects' : subject}
            </option>
          {/each}
        </select>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <span class="stat-number">{questions.length}</span>
        <span class="stat-label">Total Questions</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{subjects.length - 1}</span>
        <span class="stat-label">Subjects</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{filteredQuestions.length}</span>
        <span class="stat-label">Filtered</span>
      </div>
    </div>


    <div class="questions-list">
      {#if filteredQuestions.length === 0}
        <div class="empty-state">
          <p>No questions found. Try adjusting your filters or add some questions!</p>
          <a href="/add" class="btn-primary">Add Your First Question</a>
        </div>
      {:else}
        {#each filteredQuestions as question (question.id)}
        <div class="question-card">
          <div class="question-header">
            <span class="subject-badge">{question.subject}</span>
            <span class="question-id">#{question.id}</span>
          </div>
          <h3 class="question-text">{question.question}</h3>
          <div class="options-list">
            {#each question.options as option, index}
              <div class="option" class:correct={index === question.correctAnswer}>
                <span class="option-letter">{String.fromCharCode(65 + index)}</span>
                <span class="option-text">{option}</span>
                {#if index === question.correctAnswer}
                  <span class="correct-badge">✓</span>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Explanation Section -->
          {#if question.explanation}
            <div class="explanation-section">
              <button
                class="explanation-toggle"
                on:click={() => toggleExplanation(question.id)}
                aria-expanded={expandedExplanations[question.id] || false}
              >
                <span class="toggle-icon" class:expanded={expandedExplanations[question.id]}>
                  ▶
                </span>
                <span class="toggle-text">
                  {expandedExplanations[question.id] ? 'Hide' : 'Show'} Explanation
                </span>
              </button>
              
              {#if expandedExplanations[question.id]}
                <div class="explanation-content" transition:slide={{ duration: 300 }}>
                  <div class="explanation-header">
                    <span class="explanation-icon">💡</span>
                    <span class="explanation-label">Explanation</span>
                  </div>
                  <p class="explanation-text">{question.explanation}</p>
                </div>
              {/if}
            </div>
          {/if}

          <div class="question-actions">
            <button class="btn-secondary">Edit</button>
            <button class="btn-danger">Delete</button>
          </div>
        </div>
      {/each}
      {/if}
    </div>
  {/if}
</div>

<style>

  .loading-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .error-state p {
    color: #e53e3e;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
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

  /* Filters */
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .search-box {
    flex: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .filter-box {
    min-width: 200px;
  }

  .subject-filter {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: box-shadow 0.3s ease;
  }

  .subject-filter:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  /* Stats */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Questions List */
  .questions-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .question-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .question-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .subject-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .question-id {
    color: #999;
    font-size: 0.9rem;
  }

  .question-text {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
    transition: background 0.3s ease;
  }

  .option.correct {
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.3);
  }

  .option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: white;
    border-radius: 50%;
    font-weight: 600;
    color: #667eea;
    font-size: 0.9rem;
  }

  .option-text {
    flex: 1;
    color: #555;
  }

  .correct-badge {
    color: #667eea;
    font-weight: 700;
    font-size: 1.2rem;
  }

  /* Explanation Section */
  .explanation-section {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .explanation-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(102, 126, 234, 0.05);
    border: 1px solid rgba(102, 126, 234, 0.2);
    padding: 0.6rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    font-size: 0.9rem;
    font-weight: 600;
    color: #667eea;
  }

  .explanation-toggle:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .toggle-icon {
    font-size: 0.7rem;
    transition: transform 0.3s ease;
    display: inline-block;
  }

  .toggle-icon.expanded {
    transform: rotate(90deg);
  }

  .toggle-text {
    flex: 1;
    text-align: left;
  }

  .explanation-content {
    margin-top: 0.75rem;
    padding: 1rem;
    background: #f8f9fa;
    border-left: 3px solid #667eea;
    border-radius: 8px;
  }

  .explanation-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .explanation-icon {
    font-size: 1.2rem;
  }

  .explanation-label {
    font-weight: 600;
    color: #667eea;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .explanation-text {
    color: #555;
    line-height: 1.7;
    margin: 0;
  }

  .question-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  /* Buttons */
  .btn-primary,
  .btn-secondary,
  .btn-danger {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    display: inline-block;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #555;
  }

  .btn-secondary:hover {
    background: #e0e0e0;
  }

  .btn-danger {
    background: #fee;
    color: #c33;
  }

  .btn-danger:hover {
    background: #fdd;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .empty-state p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }

    .filter-box {
      min-width: 100%;
    }

    .page-title {
      font-size: 2rem;
    }

    .question-actions {
      flex-direction: column;
    }

    .btn-secondary,
    .btn-danger {
      width: 100%;
    }
  }
</style>
