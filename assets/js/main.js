document.addEventListener('DOMContentLoaded', () => {

  // 1. LÓGICA DO CARROSSEL HERO (SLIDER AUTOMÁTICO E MANUAL)
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const dotsContainer = document.getElementById('hero-dots');

  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];

    const goToSlide = (index) => {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('bg-brand-blue');
        dots[currentSlide].classList.add('bg-white/40');
      }

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('bg-white/40');
        dots[currentSlide].classList.add('bg-brand-blue');
      }
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startAutoSlide = () => {
      slideInterval = setInterval(nextSlide, 6000); // Muda a cada 6 segundos
    };

    const stopAutoSlide = () => {
      clearInterval(slideInterval);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide(idx);
        startAutoSlide();
      });
    });

    // Inicia a rotação automática dos slides
    startAutoSlide();
  }

  // 2. FUNÇÃO DE ANIMAÇÃO DE CONTAGEM (Counter Animation)
  const animateCounter = (element) => {
    if (element.counterInterval) {
      clearInterval(element.counterInterval);
    }

    const target = parseInt(element.getAttribute('data-target'), 10);
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 1200;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    element.counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * target);

      element.textContent = `${prefix}${currentCount}${suffix}`;

      if (frame === totalFrames) {
        element.textContent = `${prefix}${target}${suffix}`;
        clearInterval(element.counterInterval);
      }
    }, frameDuration);
  };

  // Dispara contadores no scroll
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-counter]');
        counters.forEach(counter => animateCounter(counter));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('#parceiros, #cobertura').forEach(el => counterObserver.observe(el));

  // Evento Hover nos Números (Salto + Re-contagem)
  const metricItems = document.querySelectorAll('[data-counter-container]');
  metricItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const counterEl = item.querySelector('[data-counter]');
      if (counterEl) {
        animateCounter(counterEl);
      }
    });
  });

  // 3. REVELAR ELEMENTOS AO ROLAR A PÁGINA (Scroll Reveal)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

  // 4. SOMBRA NO HEADER FIXO
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      mainHeader.classList.add('shadow-md');
    } else {
      mainHeader.classList.remove('shadow-md');
    }
  });

  // 5. ANIMAÇÃO DE ENVIO DO FORMULÁRIO
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <i class="fa-solid fa-circle-notch fa-spin text-xl mr-2"></i>
        Processando Solicitação...
      `;

      setTimeout(() => {
        submitBtn.classList.remove('bg-brand-blue', 'hover:bg-brand-hover');
        submitBtn.classList.add('bg-green-600');
        submitBtn.innerHTML = `
          <i class="fa-solid fa-check-circle text-xl mr-2 animate-bounce"></i>
          Solicitação Enviada com Sucesso!
        `;
        
        leadForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-green-600');
          submitBtn.classList.add('bg-brand-blue', 'hover:bg-brand-hover');
          submitBtn.innerHTML = `Enviar Solicitação`;
        }, 4000);
      }, 1800);
    });
  }

  // 6. TOGGLE MENU MOBILE
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

});