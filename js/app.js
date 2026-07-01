/**
 * Portfolio interactive layer — terminal hero, Three.js background,
 * Swiper media carousel, PSOL modals.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* PSOL content registry                                                */
  /* ------------------------------------------------------------------ */
  var PSOL_DATA = {
    'policy-aware-agentic': {
      title: 'Policy-Aware Agentic Task Execution',
      meta: 'Agentic layer · LangGraph + LangChain · ROS2/Nav2',
      problem: 'Multi-robot missions needed a governed execution layer that could translate high-level objectives into safe, auditable Nav2 actions without bypassing fleet policy constraints.',
      solution: 'Built a LangGraph and LangChain mission-execution orchestrator over ROS2/Nav2 with schema-validated tool calls, policy gates, and telemetry feedback loops for runtime state.',
      outcome: 'Delivered language-guided task execution that respects navigation boundaries while coordinating multi-robot goals in simulation.',
      learning: 'Agentic autonomy over real robot stacks requires explicit policy enforcement at every tool boundary—orchestration without guardrails is not production-ready.'
    },
    'ros2-nav-platform': {
      title: 'ROS2 Multi-Robot Navigation Platform',
      meta: 'Fleet infrastructure · ROS2 Humble + PyTorch',
      problem: 'Webots-only prototypes could not scale swarm size, sensor fidelity, or fleet telemetry needed to train navigation policies from human trajectory data.',
      solution: 'Architected a ROS2 Humble simulation platform with SLAM Toolbox, Nav2, map_merge, frontier exploration, and C++/Python nodes for navigation, mapping, and high-rate state logging into PyTorch-ready datasets.',
      outcome: 'Enabled larger multi-agent experiments with RViz live telemetry and quantified task efficiency, coverage, and cooperation across Route, Survey, and Mixed navigation strategies.',
      learning: 'Reliable autonomy infrastructure must precede learning—telemetry fidelity and modular ROS2 graph design determine whether imitation learning and agentic planners can ship to sim-to-real.',
      link: { href: 'https://github.com/AmirMohaddesi/Human-driven-navigation-strategies-in-a-ROS2-environment', label: 'View on GitHub' }
    },
    'comm-aware-coordination': {
      title: 'Communication-Aware Multi-Robot Coordination',
      meta: 'Multi-robot coordination · Strategy diversity',
      problem: 'Homogeneous navigation policies caused redundant exploration and coordination failures as team size grew.',
      solution: 'Designed a communication-aware coordination layer for goal sharing and path deconfliction; integrated agentic planning hooks via LangGraph and LangChain for language-guided fleet decisions when classical policies stalled.',
      outcome: 'Mixed human-inspired strategies delivered the strongest balance of exploration breadth and task completion time across disaster-response simulation scenarios.',
      learning: 'Strategy diversity plus explicit inter-robot messaging beats monolithic policies for scalable team autonomy.'
    },
    'strategy-diversity': {
      title: 'Strategy Diversity in Robot Teams',
      meta: 'Empirical multi-agent study · SAB 2024',
      problem: 'No empirical baseline existed for how heterogeneous navigation behaviors affect team-level efficiency in embodied multi-agent settings.',
      solution: 'Built a Webots multi-agent testbed with Clearpath PR2 robots and a C++ obstacle-avoidance controller; ran controlled sweeps over Route, Survey, and Mixed strategy assignments.',
      outcome: 'Published findings on strategy diversity at SAB 2024; demonstrated measurable gains in coverage and coordination effectiveness for exploration-style missions.',
      learning: 'Heterogeneity is a controllable systems knob—treat strategy assignment as infrastructure, not an afterthought.',
      link: { href: 'https://github.com/AmirMohaddesi/Benefits-of-Varying-Navigation-Strategies-in-Robots', label: 'View on GitHub' }
    },
    'telepresence-nav': {
      title: 'Autonomous Telepresence Navigation',
      meta: 'Human study · IEEE ICDL 2024',
      problem: 'Manual telepresence navigation imposed high cognitive load and degraded task performance during remote scavenger-hunt operations.',
      solution: 'Shipped real-time SLAM navigation in ROS with a PyQt operator GUI and instrumentation for cognitive load, spatial awareness, and movement efficiency.',
      outcome: 'Autonomous navigation reduced operator burden and improved usability; results presented at IEEE ICDL 2024.',
      learning: 'Autonomy wins when telemetry-backed UX metrics prove reduced operator cost, not when autonomy is added for its own sake.'
    },
    'embedded-quantization': {
      title: 'Embedded ML Quantization',
      meta: 'PyTorch · embedded inference · NMI Lab',
      problem: 'Full-precision spiking neural networks exceeded power budgets on embedded inference targets.',
      solution: 'Implemented 8-bit quantized SNNs in PyTorch with a custom quantization scheme for deployment-constrained hardware.',
      outcome: 'Cut energy use 12%–18% on MNIST/CIFAR benchmarks with only 3%–7% accuracy loss.',
      learning: 'Quantization trade-offs are systems decisions—profile accuracy, power, and latency jointly before picking a bit width.'
    },
    'career-conversation-agent': {
      title: 'Career Conversation Agent',
      meta: 'Python · Gradio · Hugging Face',
      problem: 'Static portfolios could not answer nuanced, context-dependent questions from recruiters and collaborators.',
      solution: 'Deployed a persona-grounded conversational agent in Python and Gradio with embedding-backed context retrieval and public Hugging Face Space integration.',
      outcome: 'Live demo embedded on this site; enables interactive career Q&A without manual follow-up.',
      learning: 'Production agent UX requires tight retrieval boundaries—ground answers in verified profile data, not open-ended generation.',
      link: { href: 'https://huggingface.co/spaces/AMIXXM/Career_Conversation', label: 'Hugging Face Demo' }
    },
    'ros2-distributed-stack': {
      title: 'ROS2 Distributed Multi-Robot Control Stack',
      meta: 'CARL Lab · ROS2 Humble',
      problem: 'Single-process simulators could not stress-test distributed mapping and frontier coordination under realistic ROS2 timing.',
      solution: 'Integrated SLAM Toolbox, Nav2, map_merge, and frontier exploration into a ROS2 Humble disaster-response scenario with DDP-ready PyTorch training hooks.',
      outcome: 'Delivered a reusable research platform for collaborative navigation, mapping, and fleet telemetry capture.',
      learning: 'Distributed ROS2 graphs expose race conditions early—design telemetry and merge policies before scaling agent count.',
      link: { href: 'https://github.com/AmirMohaddesi/Human-driven-navigation-strategies-in-a-ROS2-environment', label: 'View on GitHub' }
    }
  };

  var TERMINAL_LINES = [
    { text: '$ ros2 launch carl_fleet stack_humble.launch.py agents:=4', className: 'term-cmd' },
    { text: '[INFO] [fleet_manager]: Initializing multi-robot graph…', className: 'term-info', delay: 120 },
    { text: '[INFO] [slam_toolbox]: Loading map_merge + SLAM Toolbox', className: 'term-info', delay: 80 },
    { text: '[INFO] [nav2_controller]: Nav2 lifecycle nodes — active', className: 'term-info', delay: 80 },
    { text: '[INFO] [telemetry_bridge]: C++/Python telemetry pipeline online', className: 'term-cyan', delay: 100 },
    { text: '[INFO] [agent_orchestrator]: LangGraph mission layer — policy gates OK', className: 'term-cyan', delay: 100 },
    { text: '[INFO] [rviz2]: Subscribing /fleet/state · /map · /goals', className: 'term-info', delay: 90 },
    { text: '[WARN] [frontier_explorer]: Agent-2 reassigned — mixed strategy mode', className: 'term-warn', delay: 110 },
    { text: '[INFO] [fleet_manager]: 4 agents synchronized · sim clock 1.0x', className: 'term-success', delay: 100 },
    { text: '✓ Stack ready — AI Systems Architect online', className: 'term-success', delay: 200 }
  ];

  /* ------------------------------------------------------------------ */
  /* Terminal typing effect                                               */
  /* ------------------------------------------------------------------ */
  function initTerminal() {
    var terminal = document.getElementById('heroTerminal');
    var output = document.getElementById('terminalOutput');
    var heroMain = document.getElementById('heroMain');
    if (!terminal || !output || !heroMain) return;

    if (prefersReducedMotion) {
      output.innerHTML = TERMINAL_LINES.map(function (line) {
        return '<div class="' + line.className + '">' + escapeHtml(line.text) + '</div>';
      }).join('');
      revealHero(heroMain, terminal);
      return;
    }

    var lineIndex = 0;
    var charIndex = 0;
    var currentLineEl = null;

    function typeNextChar() {
      if (lineIndex >= TERMINAL_LINES.length) {
        setTimeout(function () {
          revealHero(heroMain, terminal);
        }, 450);
        return;
      }

      var line = TERMINAL_LINES[lineIndex];
      if (!currentLineEl) {
        currentLineEl = document.createElement('div');
        currentLineEl.className = line.className;
        output.appendChild(currentLineEl);
        charIndex = 0;
      }

      if (charIndex < line.text.length) {
        currentLineEl.textContent += line.text.charAt(charIndex);
        charIndex += 1;
        var scrollEl = terminal.querySelector('.hero-terminal__body');
        if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
        setTimeout(typeNextChar, 14 + Math.random() * 22);
      } else {
        lineIndex += 1;
        currentLineEl = null;
        var pause = line.delay || 60;
        setTimeout(typeNextChar, pause);
      }
    }

    setTimeout(typeNextChar, 400);
  }

  function revealHero(heroMain, terminal) {
    terminal.classList.add('hero-terminal--done');
    heroMain.classList.add('hero-main--visible');
    heroMain.setAttribute('aria-hidden', 'false');
    if (window.jQuery && jQuery.fn.fitText) {
      setTimeout(function () {
        jQuery('#intro h1').fitText(1, { minFontSize: '28px', maxFontSize: '76px' });
      }, 80);
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------------ */
  /* Three.js hero background                                             */
  /* ------------------------------------------------------------------ */
  function initThreeHero() {
    var canvas = document.getElementById('hero-three-canvas');
    var intro = document.getElementById('intro');
    if (!canvas || !intro || typeof THREE === 'undefined') return;

    if (prefersReducedMotion) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 28;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var agentCount = 48;
    var positions = new Float32Array(agentCount * 3);
    var colors = new Float32Array(agentCount * 3);
    var cyan = new THREE.Color(0x22d3ee);
    var grey = new THREE.Color(0x334155);

    for (var i = 0; i < agentCount; i++) {
      var angle = (i / agentCount) * Math.PI * 2;
      var radius = 6 + Math.random() * 8;
      var y = (Math.random() - 0.5) * 10;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      var c = Math.random() > 0.35 ? cyan : grey;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var material = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      sizeAttenuation: true
    });

    var points = new THREE.Points(geometry, material);
    scene.add(points);

    var linesGeo = new THREE.BufferGeometry();
    var linePositions = [];
    for (var j = 0; j < agentCount; j++) {
      for (var k = j + 1; k < agentCount; k++) {
        var dx = positions[j * 3] - positions[k * 3];
        var dy = positions[j * 3 + 1] - positions[k * 3 + 1];
        var dz = positions[j * 3 + 2] - positions[k * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < 18) {
          linePositions.push(
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
            positions[k * 3], positions[k * 3 + 1], positions[k * 3 + 2]
          );
        }
      }
    }
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    var lines = new THREE.LineSegments(
      linesGeo,
      new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.08 })
    );
    scene.add(lines);

    var mouse = { x: 0, y: 0 };
    intro.addEventListener('mousemove', function (e) {
      var rect = intro.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    function resize() {
      var w = intro.clientWidth;
      var h = intro.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener('resize', resize);

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      points.rotation.y = t * 0.06;
      points.rotation.x = Math.sin(t * 0.12) * 0.08;
      lines.rotation.y = points.rotation.y;
      lines.rotation.x = points.rotation.x;
      camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 1.8 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();
  }

  /* ------------------------------------------------------------------ */
  /* Swiper carousel                                                      */
  /* ------------------------------------------------------------------ */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    var el = document.querySelector('.media-swiper');
    if (!el) return;

    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: prefersReducedMotion ? false : { delay: 4200, disableOnInteraction: false },
      pagination: { el: '.media-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.media-swiper .swiper-button-next',
        prevEl: '.media-swiper .swiper-button-prev'
      },
      breakpoints: {
        640: { slidesPerView: 1.15 },
        900: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* PSOL modals                                                          */
  /* ------------------------------------------------------------------ */
  var modalLastFocus = null;

  function initPsolModals() {
    var modal = document.getElementById('psolModal');
    if (!modal) return;

    var backdrop = modal.querySelector('.psol-modal__backdrop');
    var closeBtn = modal.querySelector('.psol-modal__close');
    var cards = document.querySelectorAll('.psol-card[data-psol-id]');

    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a.link-external')) return;
        var id = card.getAttribute('data-psol-id');
        if (id) openPsolModal(id);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var id = card.getAttribute('data-psol-id');
          if (id) openPsolModal(id);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closePsolModal);
    if (backdrop) backdrop.addEventListener('click', closePsolModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closePsolModal();
      }
    });
  }

  function openPsolModal(id) {
    var data = PSOL_DATA[id];
    var modal = document.getElementById('psolModal');
    if (!data || !modal) return;

    modal.querySelector('#psolModalTitle').textContent = data.title;
    modal.querySelector('#psolModalMeta').textContent = data.meta;

    var list = modal.querySelector('#psolModalList');
    list.innerHTML = [
      { key: 'Problem', val: data.problem },
      { key: 'Solution', val: data.solution },
      { key: 'Outcome', val: data.outcome },
      { key: 'Learning', val: data.learning }
    ].map(function (item) {
      return '<li><span class="psol-label">' + item.key + ':</span> ' + escapeHtml(item.val) + '</li>';
    }).join('');

    var linkWrap = modal.querySelector('#psolModalLink');
    if (data.link) {
      linkWrap.innerHTML = '<a class="psol-modal__ext link-external" href="' + data.link.href + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(data.link.label) + ' →</a>';
      linkWrap.hidden = false;
    } else {
      linkWrap.innerHTML = '';
      linkWrap.hidden = true;
    }

    modalLastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('psol-modal-open');
    closeBtnFocus(modal);
  }

  function closeBtnFocus(modal) {
    var closeBtn = modal.querySelector('.psol-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closePsolModal() {
    var modal = document.getElementById('psolModal');
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('psol-modal-open');
    if (modalLastFocus && modalLastFocus.focus) modalLastFocus.focus();
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                 */
  /* ------------------------------------------------------------------ */
  function boot() {
    initTerminal();
    initPsolModals();
    initSwiper();
    if (typeof THREE !== 'undefined') {
      initThreeHero();
    } else {
      window.addEventListener('load', function () {
        if (typeof THREE !== 'undefined') initThreeHero();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
