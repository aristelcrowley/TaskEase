import '../assets/home.css';


export default function Home() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <a href="#" className="logo"><span>Task</span>Ease</a>
        <div className="nav-links">
          <a href="/register">Sign Up</a>
          <a href="/login">Login</a>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Master Your Day, One Task at a Time.</h1>
            <p>Join a community of achievers who stay organized, focused, and stress-free with our intuitive task manager.</p>
            <a href="/register">
              <button className="btn">Start for free</button>
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="feature-card feature-one">
            <div className="feature-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Effortless Task Control</h3>
            <p>Organize your day in seconds. Prioritize, update, and check off tasks without breaking your flow.</p>
          </div>

          <div className="feature-card feature-two">
            <div className="feature-icon">
              <i className="fas fa-bell"></i>
            </div>
            <h3>Smart, Adaptive Reminders</h3>
            <p>Let intelligent notifications guide your focus, tailored perfectly to your working rhythm.</p>
          </div>

          <div className="feature-card feature-three">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Track Your Progress</h3>
            <p>See your growth over time with beautiful visual insights that motivate and inform.</p>
          </div>
        </section>

        {/* Highlight Section */}
        <section className="feature-highlight">
          <div className="highlight-box">
            <h2>Designed for Simplicity</h2>
            <p>
              We believe that productivity tools should help you focus, not distract you. 
              TaskEase is built with a clean interface, minimal clutter, and powerful features 
              to keep you in control — effortlessly.
            </p>
          </div>
        </section>

        {/* Focus Section */}
        <section className="focus-section">
          <div className="video-container">
            <video autoPlay muted loop playsInline>
              <source src="/V1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="focus-content">
            <h2>Boost Your Focus, Crush Your Goals</h2>
            <p>Discover how TaskEase helps you stay on track, organized, and ahead of your tasks — all in one simple interface.</p>
            <a href="/register"> 
              <button className="btn">Start Now</button>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <h2><span>Task</span>Ease</h2>
            <p>Your trusted partner in getting things done efficiently and with ease.</p>
          </div>

          <div className="footer-links">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 <span>TaskEase</span>. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
