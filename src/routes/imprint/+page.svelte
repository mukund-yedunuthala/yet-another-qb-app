<svelte:head>
  <title>Imprint - Yet Another QB App</title>
</svelte:head>

<div class="container">
  <div class="legal-content">
    <h1>Imprint</h1>
    
    <section>
      <h2>Information pursuant to § 5 TMG</h2>
      <p>
        Mukund Yedunuthala<br />
        Hyderabad, Telangana<br />
        India
      </p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Website: mukundyedunuthala.page
      </p>
    </section>

    <section>
      <h2>Responsible for content according to § 55 Abs. 2 RStV</h2>
      <p>
        Mukund Yedunuthala<br />
        Hyderabad, Telangana<br />
        India
      </p>
    </section>

    <section>
      <h2>Disclaimer</h2>
      
      <h3>Liability for Content</h3>
      <p>
        The contents of our pages were created with great care. However, we cannot guarantee 
        the contents' accuracy, completeness, or topicality. According to statutory provisions, 
        we are furthermore responsible for our own content on these web pages. In this matter, 
        please notethat we are not obliged to monitor the transmitted or saved information of 
        third parties, or investigate circumstances pointing to illegal activity.
      </p>
      <h3>Liability for Links</h3>
      <p>
        Our offer contains links to external third-party websites. We have no influence on the 
        contents of those websites, therefore we cannot guarantee for those contents. Providers 
        or administrators of linked websites are always responsible for their own contents.
      </p>

      <h3>Copyright</h3>
      <p>
      Work in progress.
      </p>
    </section>
  </div>
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .legal-content {
    background: white;
    padding: 3rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  section {
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.5rem;
    color: #667eea;
    margin-bottom: 1rem;
    margin-top: 2rem;
  }

  h3 {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 0.75rem;
    margin-top: 1.5rem;
  }

  p {
    color: #555;
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .legal-content {
      padding: 2rem 1.5rem;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>