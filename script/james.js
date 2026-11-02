/* ============================================
   RETRO FUTURISTIK INTERACTIVE JS
   James Aldo Parlindungan - Portfolio
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. CUSTOM CURSOR WITH TRAIL EFFECT
  // ==========================================
  
  const createCustomCursor = () => {
    // Main cursor dot
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.cssText = `
      width: 20px;
      height: 20px;
      border: 2px solid #05d9e8;
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 10000;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 20px rgba(5, 217, 232, 0.5);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(cursor);
    
    // Cursor trail
    const trail = [];
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.cssText = `
        width: ${10 - i * 2}px;
        height: ${10 - i * 2}px;
        background: rgba(255, 42, 109, ${0.5 - i * 0.1});
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: ${0.1 * (i + 1)}s;
      `;
      document.body.appendChild(dot);
      trail.push(dot);
    }
    
    document.addEventListener('pointermove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';

      trail.forEach((dot) => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
      });
    });
    
    // Scale cursor on hover over links
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.borderColor = '#ff2a6d';
        cursor.style.boxShadow = '0 0 30px rgba(255, 42, 109, 0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderColor = '#05d9e8';
        cursor.style.boxShadow = '0 0 20px rgba(5, 217, 232, 0.5)';
      });
    });
  };
  
  createCustomCursor();
  
  // ==========================================
  // 2. PARTICLE SYSTEM CANVAS
  // ==========================================
  
  const createParticleSystem = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * Math.PI * 2;
      }
      
      getRandomColor() {
        const colors = ['#ff2a6d', '#05d9e8', '#a855f7', '#f9f002', '#00ff9f'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.02;
        
        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * (0.5 + Math.sin(this.pulse) * 0.5);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connect nearby particles with lines
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.strokeStyle = '#05d9e8';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      connectParticles();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  };
  
  createParticleSystem();
  
  // ==========================================
  // 3. TYPING EFFECT FOR HERO SECTION
  // ==========================================
  
  const createTypingEffect = () => {
    const heroText = document.querySelector('#profil > div > p:first-child');
    if (!heroText) return;
    
    const originalText = heroText.textContent;
    heroText.textContent = '';
    heroText.style.borderRight = '2px solid #00ff9f';
    heroText.style.paddingRight = '5px';
    
    let charIndex = 0;
    
    const type = () => {
      if (charIndex < originalText.length) {
        heroText.textContent += originalText[charIndex];
        charIndex++;
        setTimeout(type, 100);
      } else {
        // Blinking cursor after typing
        setInterval(() => {
          heroText.style.borderRight = heroText.style.borderRight === 'none' 
            ? '2px solid #00ff9f' 
            : 'none';
        }, 500);
      }
    };
    
    // Start typing after slight delay
    setTimeout(type, 500);
  };
  
  createTypingEffect();
  
  // ==========================================
  // 4. SCROLL REVEAL ANIMATIONS
  // ==========================================
  
  const createScrollReveal = () => {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Add stagger animation to children
          const children = entry.target.querySelectorAll('article, .focus-grid article');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, observerOptions);
    
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
      
      const children = section.querySelectorAll('article, .focus-grid article');
      children.forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
    });
  };
  
  createScrollReveal();
  
  // ==========================================
  // 5. PARALLAX EFFECT ON PROFILE IMAGE
  // ==========================================
  
  const createParallax = () => {
    const profileImg = document.querySelector('#profil img');
    const profileSection = document.querySelector('#profil');
    
    if (!profileImg || !profileSection) return;
    
    profileSection.addEventListener('mousemove', (e) => {
      const rect = profileSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.05;
      const moveY = y * 0.05;
      
      profileImg.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    profileSection.addEventListener('mouseleave', () => {
      profileImg.style.transform = 'translate(0, 0)';
      profileImg.style.transition = 'transform 0.5s ease';
    });
  };
  
  createParallax();
  
  // ==========================================
  // 6. MAGNETIC EFFECT ON BUTTONS
  // ==========================================
  
  const createMagneticButtons = () => {
    const buttons = document.querySelectorAll('#profil a, nav a');
    
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.3s ease';
      });
    });
  };
  
  createMagneticButtons();
  
  // ==========================================
  // 7. GLITCH TEXT EFFECT ON HOVER
  // ==========================================
  
  const createGlitchEffect = () => {
    const title = document.querySelector('#profil h1');
    if (!title) return;
    
    const originalText = title.textContent;
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    
    title.addEventListener('mouseenter', () => {
      let iteration = 0;
      const interval = setInterval(() => {
        title.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join('');
        
        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        
        iteration += 1/3;
      }, 30);
    });
  };
  
  createGlitchEffect();
  
  // ==========================================
  // 8. NEON FLICKER RANDOMIZER
  // ==========================================
  
  const createNeonFlicker = () => {
    const headings = document.querySelectorAll('h2');
    
    headings.forEach(heading => {
      setInterval(() => {
        if (Math.random() > 0.95) {
          heading.style.opacity = '0.5';
          setTimeout(() => {
            heading.style.opacity = '1';
          }, 50);
          setTimeout(() => {
            heading.style.opacity = '0.7';
          }, 100);
          setTimeout(() => {
            heading.style.opacity = '1';
          }, 150);
        }
      }, 3000);
    });
  };
  
  createNeonFlicker();
  
  // ==========================================
  // 9. SMOOTH SCROLL WITH PROGRESS BAR
  // ==========================================
  
  const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #ff2a6d, #05d9e8, #a855f7);
      z-index: 10001;
      transition: width 0.1s ease;
      box-shadow: 0 0 10px rgba(5, 217, 232, 0.5);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
    });
  };
  
  createScrollProgress();

  const backToTopLink = document.querySelector('footer a[href="#beranda"]');
  backToTopLink?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // ==========================================
  // 10. INTERACTIVE CARD TILT EFFECT
  // ==========================================
  
  const createTiltEffect = () => {
    const cards = document.querySelectorAll('.focus-grid article, #keahlian article, #prestasi article');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        card.style.transition = 'transform 0.1s';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s ease';
      });
    });
  };
  
  createTiltEffect();
  
  // ==========================================
  // 11. AUDIO-VISUAL FEEDBACK (OPTIONAL)
  // ==========================================
  
  const createSoundEffect = () => {
    // Create audio context for hover sounds
    let audioContext;
    
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return; // Audio not supported
    }
    
    const playHoverSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };
    
    // Add sound to nav links
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('mouseenter', playHoverSound);
    });
  };
  
  // Uncomment to enable sound effects
  // createSoundEffect();
  
  // ==========================================
  // 12. DYNAMIC TIME-BASED GREETING
  // ==========================================
  
  const createDynamicGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    let emoji = '';
    
    if (hour < 12) {
      greeting = 'SELAMAT PAGI';
      emoji = '🌅';
    } else if (hour < 17) {
      greeting = 'SELAMAT SIANG';
      emoji = '☀️';
    } else if (hour < 20) {
      greeting = 'SELAMAT SORE';
      emoji = '🌆';
    } else {
      greeting = 'SELAMAT MALAM';
      emoji = '🌙';
    }
    
    console.log(`${emoji} ${greeting}! Welcome to the retro future.`);
    
    // Optional: Add to footer
    const footer = document.querySelector('footer');
    if (footer) {
      const greetingEl = document.createElement('p');
      const timeEl = document.createElement('span');
      greetingEl.append(`${emoji} ${greeting} | SYSTEM TIME: `, timeEl);
      greetingEl.style.fontSize = '0.8rem';
      greetingEl.style.opacity = '0.6';
      footer.insertBefore(greetingEl, footer.firstChild);

      const updateTime = () => {
        timeEl.textContent = new Date().toLocaleTimeString('id-ID');
      };

      updateTime();
      setInterval(updateTime, 1000);
    }
  };
  
  createDynamicGreeting();
  
  // ==========================================
  // 13. MATRIX RAIN EFFECT (TOGGLEABLE)
  // ==========================================
  
  const createMatrixRain = () => {
    // Press 'M' to toggle matrix rain
    let matrixActive = false;
    let matrixCanvas, matrixCtx;
    
    const initMatrix = () => {
      matrixCanvas = document.createElement('canvas');
      matrixCanvas.id = 'matrix-canvas';
      matrixCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.1;
        pointer-events: none;
      `;
      document.body.appendChild(matrixCanvas);
      
      matrixCtx = matrixCanvas.getContext('2d');
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';
      const charArray = chars.split('');
      const fontSize = 14;
      const columns = matrixCanvas.width / fontSize;
      const drops = [];
      
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
      
      const drawMatrix = () => {
        if (!matrixActive) return;
        
        matrixCtx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        matrixCtx.fillStyle = '#00ff9f';
        matrixCtx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
          const text = charArray[Math.floor(Math.random() * charArray.length)];
          matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        
        requestAnimationFrame(drawMatrix);
      };
      
      drawMatrix();
    };
    
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'm') {
        if (!matrixCanvas) {
          initMatrix();
        }
        matrixActive = !matrixActive;
        matrixCanvas.style.display = matrixActive ? 'block' : 'none';
        if (matrixActive) {
          const event = new Event('matrixStart');
          document.dispatchEvent(event);
        }
      }
    });
  };
  
  createMatrixRain();
  
  // ==========================================
  // 14. CONSOLE EASTER EGG
  // ==========================================
  
  console.log(`
    ██████╗ ███████╗████████╗██████╗  ██████╗ 
    ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗
    ██████╔╝█████╗     ██║   ██████╔╝██║   ██║
    ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║
    ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝
    ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 
                                             
    ███████╗██╗   ██╗████████╗██╗   ██╗██████╗ 
    ██╔════╝██║   ██║╚══██╔══╝██║   ██║██╔══██╗
    █████╗  ██║   ██║   ██║   ██║   ██║██████╔╝
    ██╔══╝  ██║   ██║   ██║   ██║   ██║██╔═══╝ 
    ██║     ╚██████╔╝   ██║   ╚██████╔╝██║     
    ╚═╝      ╚═════╝    ╚═╝    ╚═════╝ ╚═╝     
                                             
    🚀 Welcome to the Retro Future, James!
    💡 Press 'M' for Matrix mode
    🎮 Try hovering elements for surprises
  `);
  
});