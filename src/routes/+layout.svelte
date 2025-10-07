<script>
  import { page } from '$app/stores';
  
  const currentYear = new Date().getFullYear();
  
  // Check if current route matches
  $: isActive = (path) => $page.url.pathname === path;
</script>

<div class="app-container">
  <header class="header">
    <div class="container">
      <a href="/" class="logo">QuizBank</a>
      <nav class="nav">
        <a href="/" class="nav-link" class:active={isActive('/')}>
          Home
        </a>
        <a href="/questions" class="nav-link" class:active={isActive('/questions')}>
          Questions
        </a>
        <a href="/add" class="nav-link" class:active={isActive('/add')}>
          Add Question
        </a>
        <a href="/flashcards" class="nav-link" class:active={isActive('/flashcards')}>
          Flashcards
        </a>
      </nav>
    </div>
  </header>

  <main class="main">
    <slot />
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <p class="copyright">© {currentYear} QuizBank. All rights reserved.</p>
        <div class="footer-links">
          <a href="/imprint" class="footer-link">Imprint</a>
          <span class="separator">•</span>
          <a href="/privacy" class="footer-link">Privacy Policy</a>
          <span class="separator">•</span>
          <a href="/terms" class="footer-link">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 
                 Cantarell, 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
  }

  /* Header Styles */
  .header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    transition: opacity 0.3s ease;
  }

  .logo:hover {
    opacity: 0.8;
  }

  .nav {
    display: flex;
    gap: 2rem;
  }

  .nav-link {
    text-decoration: none;
    color: #555;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
  }

  .nav-link:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  .nav-link.active {
    color: #667eea;
    background: rgba(102, 126, 234, 0.15);
    font-weight: 600;
  }

  /* Main Content */
  .main {
    flex: 1;
    padding: 2rem 0;
  }

  /* Footer Styles */
  .footer {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    margin-top: auto;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .footer .container {
    padding: 2rem;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .copyright {
    color: #666;
    font-size: 0.9rem;
  }

  .footer-links {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .footer-link {
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
  }

  .footer-link:hover {
    color: #667eea;
  }

  .separator {
    color: #ccc;
    user-select: none;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .header .container {
      flex-direction: column;
      gap: 1rem;
    }

    .nav {
      gap: 1rem;
    }

    .nav-link {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    .footer-content {
      flex-direction: column;
      text-align: center;
    }

    .container {
      padding: 0 1rem;
    }
  }
</style>
