import React, { useState, useEffect } from 'react';
import './App.css';

// 아이콘을 위한 Font Awesome import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    // 목표 날짜 설정 (예: 2025년 12월 31일)
    const difference = +new Date('2025-10-26') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        일: Math.floor(difference / (1000 * 60 * 60 * 24)),
        시간: Math.floor((difference / (1000 * 60 * 60)) % 24),
        분: Math.floor((difference / 1000 / 60) % 60),
        초: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="timer-segment">
        <span className="time">{timeLeft[interval]}</span>
        <span className="label">{interval}</span>
      </div>
    );
  });

  return (
    <div className="container">
      <header className="header">
        <h1>🚀 Our Website is Coming Soon!</h1>
        <p>저희의 새로운 웹사이트가 곧 여러분을 찾아갑니다. 잠시만 기다려주세요!</p>
      </header>

      <section className="countdown-timer">
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </section>

      <section className="subscribe-form">
        <h2>새 소식을 가장 먼저 받아보세요!</h2>
        <p>이메일을 등록해주시면, 사이트 오픈 시 가장 먼저 알려드릴게요.</p>
        <form>
          <input type="email" placeholder="your-email@example.com" required />
          <button type="submit">
            알림 받기 <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </section>

      <footer className="footer">
        <p>Follow us on social media:</p>
        <div className="social-links">
          <a href="https://youtu.be/9BalEldzE8o?si=iifuwIPVTMAG8WyK" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://youtu.be/xvFZjo5PgG0?si=yHsgcFco7ntekPaw" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://github.com/wilson-0302/OSS-Project-PoList.git" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;