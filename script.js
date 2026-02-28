// script.js - Versão Corrigida e Melhorada
// Kelvis Tech - Enf. Yennifer Escudero
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // =========================================
    // ELEMENTOS DO DOM
    // =========================================
    const navbar      = document.querySelector('.navbar');
    const navToggle   = document.getElementById('navToggle');
    const navMenu     = document.getElementById('navMenu');
    const contactForm = document.getElementById('contactForm');
    const testimonialsContainer = document.getElementById('testimonials-container');
    const progressBar = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTop');

    // =========================================
    // 1. MENU MÓVEL — FIX #5 e #6
    // Fecha ao clicar fora + corrige aria-expanded
    // =========================================
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active', isOpen);
            // FIX #15: atualiza aria-expanded
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Fecha ao clicar em link
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // FIX #5: fecha ao clicar fora do menu
        document.addEventListener('click', (e) => {
            const clickedInside = navMenu.contains(e.target) || navToggle.contains(e.target);
            if (!clickedInside && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Fecha com tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    // =========================================
    // 2. TESTIMONIOS (desde db.js) — FIX #7
    // Fallback visual se db.js não existir
    // =========================================
    if (testimonialsContainer) {
        renderTestimonials(testimonialsContainer);
    }

    // =========================================
    // 3. SMOOTH SCROLL
    // =========================================
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.hash;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            e.preventDefault();
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });

    // =========================================
    // 4. ANIMAÇÕES AO FAZER SCROLL
    // =========================================
    const animatedElements = document.querySelectorAll(
        '.card, .service-card, .testimonial-card, .benefit-card, .curiosity-banner, .info-item, .contact-form-panel, .badges-grid, .faq-container'
    );

    if (animatedElements.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(el => {
            el.classList.add('animate-ready');
            observer.observe(el);
        });
    }

    // =========================================
    // 5. SCROLL: PROGRESS BAR + BACK TO TOP + NAVBAR
    // FIX #6: toggle também remove classe active do menu
    // =========================================
    window.addEventListener('scroll', () => {
        // Barra de progresso
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = height > 0 ? ((winScroll / height) * 100) + '%' : '0%';
        }

        // Botão voltar ao topo
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('show', window.scrollY > 400);
        }

        // Efeito navbar
        if (navbar) {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
        }

        // FIX #6: fecha menu ao rolar
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    }, { passive: true });

    // =========================================
    // 6. BOTÃO VOLTAR AO TOPO
    // =========================================
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // 7. BURBUJA WHATSAPP
    // =========================================
    setTimeout(() => {
        const waBubble = document.getElementById('waBubble');
        if (waBubble) waBubble.classList.add('show');
    }, 4000);

    // =========================================
    // 8. FORMULÁRIO — FIX #4: validação de e-mail
    // =========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre   = document.getElementById('formNombre')?.value.trim() || '';
            const telefono = document.getElementById('formTelefono')?.value.trim() || '';
            const correo   = document.getElementById('formCorreo')?.value.trim() || '';
            const mensaje  = document.getElementById('formMensaje')?.value.trim() || '';

            // Validação básica
            if (!nombre || !telefono || !mensaje) {
                mostrarNotificacion('❌ Por favor preencha nome, telefone e mensagem.', 'error');
                return;
            }

            // Validação de telefone
            const telefonoLimpio = telefono.replace(/\D/g, '');
            if (telefonoLimpio.length < 10 || telefonoLimpio.length > 11) {
                mostrarNotificacion('❌ Por favor insira um telefone válido (10 ou 11 dígitos).', 'error');
                return;
            }

            // FIX #4: Validação de e-mail quando preenchido
            if (correo) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(correo)) {
                    mostrarNotificacion('❌ Por favor insira um e-mail válido ou deixe o campo em branco.', 'error');
                    return;
                }
            }

            const waNumber = '555499168720';
            let waText = `*NOVA SOLICITAÇÃO - SITE ENF. YENNIFER*\n\n`;
            waText += `👤 *Nome:* ${nombre}\n`;
            waText += `📞 *Telefone:* ${telefono}\n`;
            if (correo) waText += `📧 *E-mail:* ${correo}\n`;
            waText += `\n📋 *Mensagem:*\n_${mensaje}_\n\n`;
            waText += `---\nEnviado pelo site`;

            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

            const btn = document.getElementById('submitBtn');
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '🔄 Enviando... <i class="fab fa-whatsapp"></i>';
                btn.classList.add('btn-loading');

                setTimeout(() => {
                    window.open(waUrl, '_blank', 'noopener,noreferrer');
                    mostrarNotificacion('✅ Mensagem enviada! Você será redirecionado ao WhatsApp.', 'success');
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                    btn.classList.remove('btn-loading');
                    contactForm.reset();
                }, 800);
            }
        });
    }

    // =========================================
    // 9. INICIALIZAR IDIOMA
    // =========================================
    const savedLang = localStorage.getItem('preferredLang') || 'pt';
    changeLanguage(savedLang);

    document.getElementById('btn-pt')?.addEventListener('click', (e) => { e.preventDefault(); changeLanguage('pt'); });
    document.getElementById('btn-es')?.addEventListener('click', (e) => { e.preventDefault(); changeLanguage('es'); });

}); // FIM DOMContentLoaded

// =========================================
// NOTIFICAÇÕES
// =========================================
function mostrarNotificacion(mensaje, tipo = 'info') {
    document.querySelector('.custom-notification')?.remove();

    const notificacion = document.createElement('div');
    notificacion.className = `custom-notification ${tipo}`;
    notificacion.setAttribute('role', 'alert');
    notificacion.textContent = mensaje;

    notificacion.style.cssText = `
        position: fixed; top: 80px; right: 20px;
        background: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#2196F3'};
        color: white; padding: 15px 25px; border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999;
        font-weight: 500; max-width: 350px;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notificacion?.remove(), 300);
    }, 4000);
}

// =========================================
// RENDERIZAR TESTIMONIOS — FIX #7 e #13
// Fallback visual + estrelas de avaliação
// =========================================
function renderTestimonials(container) {
    if (typeof testimonials === 'undefined' || !Array.isArray(testimonials) || testimonials.length === 0) {
        // FIX #7: fallback visual elegante
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: var(--dark-gray);">
                <i class="fas fa-comment-slash" style="font-size: 3rem; color: var(--medium-gray); display: block; margin-bottom: 15px;"></i>
                <p style="font-size: 1.1rem;">Depoimentos em breve. Configure o arquivo <code>db.js</code>.</p>
            </div>`;
        return;
    }

    // FIX #13: adiciona estrelas a cada depoimento
    container.innerHTML = testimonials.map(t => {
        const stars = t.stars || 5;
        const starsHTML = Array.from({ length: 5 }, (_, i) =>
            `<i class="${i < stars ? 'fas' : 'far'} fa-star" aria-hidden="true"></i>`
        ).join('');

        return `
        <div class="testimonial-card">
            <div class="testimonial-stars" aria-label="${stars} de 5 estrelas">${starsHTML}</div>
            <div class="testimonial-content">
                <p>"${t.content}"</p>
            </div>
            <div class="testimonial-author">
                <img src="${t.avatar}" 
                     alt="Foto de ${t.name}" 
                     class="author-avatar" 
                     width="60" height="60"
                     loading="lazy"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=BE123C&color=fff&bold=true&size=128'">
                <div class="author-info">
                    <h4>${t.name}</h4>
                    <p>${t.position}</p>
                </div>
            </div>
        </div>`;
    }).join('');
}

// =========================================
// SISTEMA I18N COMPLETO
// =========================================
const translations = {
    es: {
        nav_home: "Inicio", nav_about: "Sobre Mí", nav_services: "Servicios",
        nav_benefits: "Beneficios", nav_testimonials: "Testimonios", nav_contact: "Contacto",
        hero_title: "Servicios de Enfermería a Domicilio",
        hero_desc: "Atención médica profesional, personalizada y compasiva para la pronta recuperación de tus seres queridos en la comodidad de su hogar en Passo Fundo - RS.",
        hero_btn_book: "Agendar Cita", hero_btn_services: "Ver Servicios",
        hero_feat_home: "Atención a domicilio", hero_feat_custom: "Cuidados personalizados",
        badge_1: "Registro COREN Activo", badge_2: "Material 100% Descartable",
        badge_3: "Atención Humanizada", badge_4: "Material Estéril",
        card1_title: "Contacto Directo", card1_desc: "WhatsApp con respuesta rápida",
        card2_title: "Profesionalismo", card2_desc: "Técnica especializada COREN activo",
        card3_title: "Disponibilidad", card3_desc: "Atención todos los días",
        card4_title: "Ubicación", card4_desc: "Passo Fundo y región",
        about_title: "Conoce a Yennifer Escudero",
        about_p1: "Como Técnica de Enfermería profesional, mi compromiso es brindar atención de la más alta calidad en la comodidad de tu hogar.",
        about_p2: "Cuento con la capacitación técnica y la empatía necesaria para manejar desde el cuidado preventivo hasta la atención de pacientes con necesidades complejas.",
        coren_label: "Registro Profesional COREN-RS:",
        about_feat1_title: "Atención Domiciliaria", about_feat1_desc: "Cuidados profesionales sin salir de casa",
        about_feat2_title: "Cuidado Empático", about_feat2_desc: "Trato humano y respetuoso",
        about_feat3_title: "Horarios Flexibles", about_feat3_desc: "Adaptación a tu rutina",
        about_feat4_title: "Seguimiento Riguroso", about_feat4_desc: "Control exacto del tratamiento",
        about_btn: "Agenda una Evaluación",
        serv_title: "Servicios de Enfermería", serv_subtitle: "Atención especializada en tu hogar",
        serv1_title: "Signos vitales", serv1_desc: "Monitoreo de presión, temperatura y frecuencias cardíaca/respiratoria",
        serv2_title: "Medicamentos", serv2_desc: "Aplicación vía intravenosa (IV) e intramuscular (IM) con prescripción",
        serv3_title: "Curaciones", serv3_desc: "Tratamiento profesional de heridas y retiro de puntos",
        serv4_title: "Ventilación", serv4_desc: "Manejo especializado de pacientes con soporte ventilatorio",
        serv5_title: "Traqueo/Gastrostomía", serv5_desc: "Cuidados específicos con dispositivos médicos",
        serv6_title: "Postquirúrgico", serv6_desc: "Acompañamiento personalizado post-cirugía",
        ben_title: "Ventajas del Cuidado en Casa", ben_subtitle: "Recuperación más rápida y humanizada",
        ben1_title: "Confort del Hogar", ben1_desc: "Ambiente familiar reduce ansiedad y acelera la cura",
        ben2_title: "Menos Infecciones", ben2_desc: "Evita exposición a bacterias hospitalarias",
        ben_curiosity_title: "¿Sabías qué?",
        ben_curiosity_desc: "Pacientes en casa reportan <strong>50% menos estrés</strong> y recuperación más rápida",
        ben3_title: "Atención Exclusiva", ben3_desc: "Monitoreo constante y enfocado solo en ti",
        ben4_title: "Familia Presente", ben4_desc: "Participación activa y orientación directa a familiares",
        // FIX #12: botão Benefits com tradução
        ben_cta_btn: "Hablar con Yennifer ahora",
        ben_cta_sub: "Responde en menos de 1 hora",
        faq_title: "Preguntas Frecuentes", faq_subtitle: "Tus principales dudas",
        faq_q1: "¿Formas de pago?", faq_a1: "Aceptamos PIX o transferencia bancaria al finalizar la visita",
        faq_q2: "¿Horarios disponibles?", faq_a2: "Lunes a Domingo, con horarios acordados previamente",
        faq_q3: "¿Traen equipos?", faq_a3: "Sí, todos los equipos y materiales estériles necesarios",
        faq_q4: "¿Atienden emergencias?", faq_a4: "Para emergencias con riesgo de vida, llame SAMU (192). Nuestro foco es cuidado programado",
        test_title: "Testimonios", test_subtitle: "La satisfacción de las familias es mi mayor recomendación",
        cont_title: "Contáctame", cont_subtitle: "Estoy aquí para resolver tus dudas",
        cont_info_title: "Información", cont_info_desc: "Responderé lo más rápido posible",
        cont_area_title: "Área", cont_area_desc: "Passo Fundo - RS (Domicilio)",
        cont_phone_title: "WhatsApp", cont_avail_title: "Disponibilidad",
        cont_avail_desc: "Lunes a Domingo (con cita)",
        form_label_name: "Nombre", form_place_name: "Ej. Carlos Silva",
        form_label_phone: "WhatsApp", form_place_phone: "(54) 90000-0000",
        form_label_email: "E-mail (opcional)", form_place_email: "email@ejemplo.com",
        form_label_msg: "¿Cómo puedo ayudarte?", form_place_msg: "Describe brevemente el servicio que necesitas...",
        form_btn: "Enviar Mensaje",
        foot_brand_desc: "Cuidado humanizado y profesional en la comodidad de tu hogar",
        foot_explore: "Explorar", foot_services: "Servicios",
        foot_serv1: "Signos Vitales", foot_serv2: "Medicamentos",
        foot_serv3: "Curaciones", foot_serv4: "Postquirúrgico",
        foot_copy: "&copy; 2026 Enf. Yennifer Escudero. Todos los derechos reservados.",
        foot_dev: "Desarrollado por <strong>Kelvis Tech</strong>",
        wa_bubble: "👋 ¿Necesitas ayuda en casa? Escríbeme",
        wa_float_label: "Háblanos",
        coren_label: "Registro Profesional COREN-RS:"
    },
    pt: {
        nav_home: "Início", nav_about: "Sobre Mim", nav_services: "Serviços",
        nav_benefits: "Benefícios", nav_testimonials: "Depoimentos", nav_contact: "Contato",
        hero_title: "Serviços de Enfermagem em Domicílio",
        hero_desc: "Atendimento médico profissional, personalizado e humanizado para a rápida recuperação de seus entes queridos no conforto do seu lar em Passo Fundo - RS.",
        hero_btn_book: "Agendar Consulta", hero_btn_services: "Ver Serviços",
        hero_feat_home: "Atendimento em domicílio", hero_feat_custom: "Cuidados personalizados",
        badge_1: "Registro COREN Ativo", badge_2: "Material 100% Descartável",
        badge_3: "Atendimento Humanizado", badge_4: "Material Estéril",
        card1_title: "Contato Direto", card1_desc: "WhatsApp com resposta rápida",
        card2_title: "Profissionalismo", card2_desc: "Técnica especializada COREN ativo",
        card3_title: "Disponibilidade", card3_desc: "Atendimento todos os dias",
        card4_title: "Localização", card4_desc: "Passo Fundo e região",
        about_title: "Conheça Yennifer Escudero",
        about_p1: "Como Técnica de Enfermagem profissional, meu compromisso é oferecer atendimento da mais alta qualidade no conforto da sua casa. Entendo que a recuperação e o cuidado são mais eficazes em um ambiente familiar e tranquilo.",
        about_p2: "Conto com a capacitação técnica e a empatia necessárias para lidar desde o cuidado preventivo até o atendimento de pacientes com necessidades complexas, garantindo sempre o seu bem-estar.",
        coren_label: "Registro Profissional COREN-RS:",
        about_feat1_title: "Atendimento Domiciliar", about_feat1_desc: "Cuidados profissionais sem sair de casa",
        about_feat2_title: "Cuidado Empático", about_feat2_desc: "Tratamento humano e respeitoso",
        about_feat3_title: "Horários Flexíveis", about_feat3_desc: "Adaptação à sua rotina",
        about_feat4_title: "Acompanhamento Rigoroso", about_feat4_desc: "Controle exato do tratamento",
        about_btn: "Agendar uma Avaliação",
        serv_title: "Serviços de Enfermagem", serv_subtitle: "Atendimento especializado no seu lar",
        serv1_title: "Sinais vitais", serv1_desc: "Monitoramento de pressão, temperatura e frequências cardíaca/respiratória",
        serv2_title: "Medicamentos", serv2_desc: "Aplicação via intravenosa (IV) e intramuscular (IM) com prescrição",
        serv3_title: "Curativos", serv3_desc: "Tratamento profissional de feridas e retirada de pontos",
        serv4_title: "Ventilação", serv4_desc: "Manejo especializado de pacientes com suporte ventilatório",
        serv5_title: "Traqueo/Gastrostomia", serv5_desc: "Cuidados específicos com dispositivos médicos",
        serv6_title: "Pós-cirúrgico", serv6_desc: "Acompanhamento personalizado pós-cirurgia",
        ben_title: "Vantagens do Cuidado em Casa", ben_subtitle: "Recuperação mais rápida e humanizada",
        ben1_title: "Conforto do Lar", ben1_desc: "Ambiente familiar reduz ansiedade e acelera a cura",
        ben2_title: "Menos Infecções", ben2_desc: "Evita exposição a bactérias hospitalares",
        ben_curiosity_title: "Você sabia?",
        ben_curiosity_desc: "Pacientes em casa relatam <strong>50% menos estresse</strong> e recuperação mais rápida que em internações",
        ben3_title: "Atendimento Exclusivo", ben3_desc: "Monitoramento constante e focado só em você",
        ben4_title: "Família Presente", ben4_desc: "Participação ativa e orientação direta aos familiares",
        ben_cta_btn: "Falar com Yennifer agora",
        ben_cta_sub: "Responde em menos de 1 hora",
        faq_title: "Dúvidas Frequentes", faq_subtitle: "Tire suas principais dúvidas",
        faq_q1: "Formas de pagamento?", faq_a1: "Aceitamos PIX ou transferência bancária no final da visita",
        faq_q2: "Horários disponíveis?", faq_a2: "Segunda a Domingo, com horários agendados previamente",
        faq_q3: "Trazem equipamentos?", faq_a3: "Sim, todos os equipamentos e materiais estéreis necessários",
        faq_q4: "Atendem emergências?", faq_a4: "Para emergências com risco de vida, ligue SAMU (192). Nosso foco é cuidado programado",
        test_title: "Depoimentos", test_subtitle: "A satisfação das famílias é minha maior recomendação",
        cont_title: "Entre em Contato", cont_subtitle: "Estou aqui para tirar suas dúvidas",
        cont_info_title: "Informações", cont_info_desc: "Responderei o mais rápido possível",
        cont_area_title: "Área", cont_area_desc: "Passo Fundo - RS (Domicílio)",
        cont_phone_title: "WhatsApp", cont_avail_title: "Disponibilidade",
        cont_avail_desc: "Segunda a Domingo (agendamento)",
        form_label_name: "Nome", form_place_name: "Ex. Carlos Silva",
        form_label_phone: "WhatsApp", form_place_phone: "(54) 90000-0000",
        form_label_email: "E-mail (opcional)", form_place_email: "email@exemplo.com",
        form_label_msg: "Como posso ajudar?", form_place_msg: "Descreva brevemente o serviço que precisa...",
        form_btn: "Enviar Mensagem",
        foot_brand_desc: "Cuidado humanizado e profissional no conforto do seu lar",
        foot_explore: "Explorar", foot_services: "Serviços",
        foot_serv1: "Sinais Vitais", foot_serv2: "Medicamentos",
        foot_serv3: "Curativos", foot_serv4: "Pós-cirúrgico",
        foot_copy: "&copy; 2026 Enf. Yennifer Escudero. Todos os direitos reservados.",
        foot_dev: "Desenvolvido por <strong>Kelvis Tech</strong>",
        wa_bubble: "👋 Precisa de ajuda em casa? Me chame",
        wa_float_label: "Fale Conosco",
        coren_label: "Registro Profissional COREN-RS:"
    }
};

// =========================================
// MUDAR IDIOMA
// =========================================
function changeLanguage(lang) {
    if (!translations[lang]) return;
    localStorage.setItem('preferredLang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${lang}`)?.classList.add('active');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key] !== undefined) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key] !== undefined) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });

    updateWhatsAppLinks(lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'es';
}

// =========================================
// ATUALIZAR LINKS WHATSAPP
// =========================================
function updateWhatsAppLinks(lang) {
    const msgs = {
        pt: "Olá Yennifer, gostaria de solicitar informações para agendar uma visita a domicílio.",
        es: "Hola Yennifer, me gustaría solicitar información para agendar una visita a domicilio."
    };
    const waUrl = `https://wa.me/555499168720?text=${encodeURIComponent(msgs[lang] || msgs.pt)}`;

    document.querySelectorAll('a.whatsapp-float, a[data-wa-link]').forEach(link => {
        link.href = waUrl;
    });

    const heroBtn = document.querySelector('[data-i18n="hero_btn_book"]');
    if (heroBtn && heroBtn.tagName === 'A') {
        heroBtn.href = waUrl;
    }
}

// =========================================
// FECHAR BURBUJA WHATSAPP
// =========================================
window.closeWaBubble = function (e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('waBubble')?.classList.remove('show');
};

// =========================================
// INJETAR ESTILOS EXTRAS (estrelas + animações)
// =========================================
(function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(110%); opacity: 0; }
        }

        /* FIX #13: Estrelas nos depoimentos */
        .testimonial-stars {
            color: #f59e0b;
            font-size: 1rem;
            margin-bottom: 14px;
            letter-spacing: 2px;
        }
        .testimonial-stars .far { color: #d1d5db; }

        /* FIX #14: FAQ animação suave */
        details.faq-item .faq-content {
            overflow: hidden;
            transition: padding 0.3s ease;
        }
        details.faq-item:not([open]) .faq-content {
            padding-top: 0;
            padding-bottom: 0;
        }

        /* FIX #2: destaque visual no placeholder do COREN */
        #coren-number {
            background: rgba(190,18,60,0.08);
            border: 1px dashed var(--primary-color);
            border-radius: 4px;
            padding: 2px 8px;
            font-style: italic;
            color: var(--primary-color);
        }
    `;
    document.head.appendChild(style);
})();