document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // =========================================
    // ELEMENTOS DEL DOM
    // =========================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const contactForm = document.getElementById('contactForm');
    const testimonialsContainer = document.getElementById('testimonials-container');

    // =========================================
    // 1. MENÚ MÓVIL
    // =========================================
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
            }
        });
    }

    // =========================================
    // 2. TESTIMONIOS (desde db.js)
    // =========================================
    if (testimonialsContainer) {
        renderTestimonials(testimonialsContainer);
    }

    // =========================================
    // 3. SMOOTH SCROLL (con altura del navbar)
    // =========================================
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.hash;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // =========================================
    // 4. ANIMACIONES AL HACER SCROLL
    // =========================================
    const animatedElements = document.querySelectorAll(
        '.card, .service-card, .testimonial-card, .benefit-card, .curiosity-banner, .info-item, .contact-form-panel'
    );

    if (animatedElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.classList.add('animate-ready');
            observer.observe(el);
        });
    }

    // =========================================
    // 5. FORMULARIO DE CONTACTO (¡CON EMOJIS 100% COMPATIBLES!)
    // =========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Capturar valores
            const nombre = document.getElementById('formNombre')?.value.trim() || '';
            const telefono = document.getElementById('formTelefono')?.value.trim() || '';
            const correo = document.getElementById('formCorreo')?.value.trim() || '';
            const mensaje = document.getElementById('formMensaje')?.value.trim() || '';

            // Validación
            if (!nombre || !telefono || !mensaje) {
                alert('❌ Por favor completa los campos obligatorios (nombre, teléfono y mensaje).');
                return;
            }

            // Número de WhatsApp (formato internacional)
            const waNumber = '555499168720';

            // 📌 MENSAJE CON EMOJIS UNIVERSALES (soportados por todas las versiones de WhatsApp)
            let waText = `*NUEVA SOLICITUD DESDE LA WEB* 🏨\n\n` +  // 🏨 es más universal que 🏥
                         `👨‍⚕️ *Paciente / Contacto:* ${nombre}\n` +  // 👨‍⚕️ profesional de salud
                         `📞 *Teléfono:* ${telefono}\n`;             // 📞 teléfono clásico

            if (correo) {
                waText += `📧 *Correo:* ${correo}\n`;                // 📧 email
            }

            waText += `\n📋 *Servicio requerido:*\n_${mensaje}_\n\n` + // 📋 clipboard
                      `Hola Yennifer, me gustaría recibir más información.`;

            // Mostrar en consola para verificar (opcional - puedes borrar estas líneas)
            console.log('✅ Mensaje generado:');
            console.log(waText);

            // Crear URL de WhatsApp
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

            // Feedback visual en el botón
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '🔄 Redirigiendo a WhatsApp... <i class="fab fa-whatsapp"></i>';
            btn.classList.add('btn-loading');

            // Abrir WhatsApp y restaurar botón
            setTimeout(() => {
                window.open(waUrl, '_blank');
                btn.disabled = false;
                btn.innerHTML = originalHTML;
                btn.classList.remove('btn-loading');
                contactForm.reset();
            }, 800);
        });
    }

}); // Fin DOMContentLoaded

// =========================================
// 6. EFECTO NAVBAR AL HACER SCROLL
// =========================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }
});

// =========================================
// 7. RENDERIZAR TESTIMONIOS
// =========================================
function renderTestimonials(container) {
    // Verificar que la variable global 'testimonials' exista
    if (typeof testimonials === 'undefined' || !Array.isArray(testimonials)) {
        console.warn('⚠️ No se encontraron testimonios en db.js');
        container.innerHTML = '<p>No hay testimonios para mostrar.</p>';
        return;
    }

    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-content">
                <p>${t.content}</p>
            </div>
            <div class="testimonial-author">
                <img src="${t.avatar}" alt="${t.name}" class="author-avatar" loading="lazy">
                <div class="author-info">
                    <h4>${t.name}</h4>
                    <p>${t.position}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// =========================================
// 8. SISTEMA MULTILINGÜE (i18n) COMPLETADO
// =========================================

const translations = {
    es: {
        // Navbar
        nav_home: "Inicio",
        nav_about: "Sobre Mí",
        nav_services: "Servicios",
        nav_benefits: "Beneficios",
        nav_testimonials: "Testimonios",
        nav_contact: "Contacto",
        
        // Hero
        hero_title: "Servicios de Enfermería a Domicilio",
        hero_desc: "Atención médica profesional, personalizada y compasiva para la pronta recuperación de tus seres queridos en la comodidad de su hogar en Passo Fundo - RS.",
        hero_btn_book: "Agendar Cita",
        hero_btn_services: "Ver Servicios",
        hero_feat_home: "Atención a domicilio",
        hero_feat_custom: "Cuidados personalizados",

        // Cards Rápidas
        card1_title: "Contacto Directo",
        card1_desc: "Llama o escribe al WhatsApp para agendar una visita médica.",
        card2_title: "Profesionalismo",
        card2_desc: "Técnica de enfermería capacitada para cuidados complejos.",
        card3_title: "Disponibilidad",
        card3_desc: "Horarios flexibles según las necesidades del paciente.",
        card4_title: "Ubicación",
        card4_desc: "Servicios disponibles en toda la ciudad de Passo Fundo - RS.",

        // Sobre Mí
        about_title: "Conoce a Yennifer Blanco",
        about_p1: "Como Técnica de Enfermería profesional, mi compromiso es brindar atención de la más alta calidad en la comodidad de tu hogar. Entiendo que la recuperación y el cuidado son más efectivos en un entorno familiar y tranquilo.",
        about_p2: "Cuento con la capacitación técnica y la empatía necesaria para manejar desde el cuidado preventivo hasta la atención de pacientes con necesidades complejas, garantizando siempre tu bienestar.",
        about_feat1_title: "Atención Domiciliaria",
        about_feat1_desc: "Cuidados profesionales sin salir de tu hogar en Passo Fundo.",
        about_feat2_title: "Cuidado Empático",
        about_feat2_desc: "Trato humano, respetuoso y dedicado para cada paciente.",
        about_feat3_title: "Horarios Flexibles",
        about_feat3_desc: "Adaptabilidad total a las rutinas y necesidades de la familia.",
        about_feat4_title: "Seguimiento Riguroso",
        about_feat4_desc: "Control exacto de tratamientos y signos vitales.",
        about_btn: "Agenda una Evaluación",

        // Servicios
        serv_title: "Servicios de Enfermería",
        serv_subtitle: "Atención especializada y procedimientos técnicos en su hogar",
        serv1_title: "Toma de signos vitales",
        serv1_desc: "Monitoreo constante de presión arterial, temperatura, frecuencia cardíaca y respiratoria.",
        serv2_title: "Administración de medicamentos",
        serv2_desc: "Aplicación de tratamientos vía intravenosa (IV) e intramuscular (IM) con prescripción médica.",
        serv3_title: "Curación de heridas",
        serv3_desc: "Tratamiento y limpieza profesional de heridas, incluyendo retiro de puntos.",
        serv4_title: "Pacientes ventilados",
        serv4_desc: "Manejo técnico y especializado de pacientes que requieren soporte ventilatorio.",
        serv5_title: "Traqueostomía y gastrostomía",
        serv5_desc: "Cuidados específicos, limpieza y manejo de pacientes con dispositivos médicos.",
        serv6_title: "Cuidados posquirúrgicos",
        serv6_desc: "Acompañamiento y cuidados personalizados durante la recuperación de cirugías.",

        // Beneficios
        ben_title: "Ventajas del Cuidado en Casa",
        ben_subtitle: "Descubre por qué la recuperación a domicilio es la mejor opción para tus seres queridos",
        ben1_title: "Comodidad y Calor de Hogar",
        ben1_desc: "Estar en un entorno familiar y conocido reduce la ansiedad del paciente, favoreciendo un estado mental positivo que acelera el proceso de sanación.",
        ben2_title: "Menor Riesgo de Infecciones",
        ben2_desc: "Al evitar las visitas constantes a centros hospitalarios, se reduce drásticamente la exposición a virus y bacterias intrahospitalarias.",
        ben_curiosity_title: "¿Sabías qué?",
        ben_curiosity_desc: "Estudios médicos demuestran que los pacientes que reciben cuidados en su propio hogar reportan un <strong>50% menos de estrés</strong>, duermen mejor y presentan una recuperación clínica mucho más rápida y efectiva en comparación con internaciones prolongadas.",
        ben3_title: "Atención 100% Exclusiva",
        ben3_desc: "A diferencia de un hospital, el paciente no comparte la atención con otros. El monitoreo es constante, directo y enfocado únicamente en sus necesidades.",
        ben4_title: "Integración Familiar",
        ben4_desc: "Permite a la familia estar presente y participar activamente en la recuperación, recibiendo educación directa sobre el cuidado del paciente.",

        // Testimonios
        test_title: "Testimonios de Pacientes",
        test_subtitle: "La tranquilidad y satisfacción de las familias es mi mayor recomendación",

        // Contacto
        cont_title: "Contáctame",
        cont_subtitle: "Estoy aquí para responder tus dudas y evaluar tus necesidades de cuidado",
        cont_info_title: "Información de Contacto",
        cont_info_desc: "No dudes en comunicarte conmigo. Responderé a tu solicitud lo más pronto posible para agendar tu visita.",
        cont_area_title: "Área de Atención",
        cont_area_desc: "Passo Fundo - RS (A domicilio)",
        cont_phone_title: "Teléfono / WhatsApp",
        cont_avail_title: "Disponibilidad",
        cont_avail_desc: "Lunes a Domingo (Previa Cita)",

        // Formulario
        form_label_name: "Tu Nombre",
        form_place_name: "Ej. Carlos Silva",
        form_label_phone: "Tu WhatsApp",
        form_place_phone: "Ej. (54) 90000-0000",
        form_label_email: "Tu Correo (Opcional)",
        form_place_email: "correo@ejemplo.com",
        form_label_msg: "¿Cómo puedo ayudarte?",
        form_place_msg: "Describe brevemente el tipo de cuidado o servicio que necesitas...",
        form_btn: "Enviar Mensaje <i class='fas fa-paper-plane' style='margin-left: 8px;'></i>",

        // Footer
        foot_brand_desc: "Atención de enfermería compasiva, profesional y de calidad, llevada directamente a la comodidad de tu hogar.",
        foot_explore: "Explorar",
        foot_services: "Servicios",
        foot_serv1: "Signos Vitales",
        foot_serv2: "Medicamentos",
        foot_serv3: "Curación de heridas",
        foot_serv4: "Cuidados posquirúrgicos",
        foot_copy: "&copy; 2026 Enf. Yennifer Blanco. Todos los derechos reservados.",
        foot_dev: "Desarrollado con carinho por <strong>Kelvis Tech</strong>"
    },
    pt: {
        // Navbar
        nav_home: "Início",
        nav_about: "Sobre Mim",
        nav_services: "Serviços",
        nav_benefits: "Benefícios",
        nav_testimonials: "Depoimentos",
        nav_contact: "Contato",
        
        // Hero
        hero_title: "Serviços de Enfermagem em Domicílio",
        hero_desc: "Atendimento médico profissional, personalizado e humanizado para a rápida recuperação de seus entes queridos no conforto do seu lar em Passo Fundo - RS.",
        hero_btn_book: "Agendar Consulta",
        hero_btn_services: "Ver Serviços",
        hero_feat_home: "Atendimento em domicílio",
        hero_feat_custom: "Cuidados personalizados",

        // Cards Rápidas
        card1_title: "Contato Direto",
        card1_desc: "Ligue ou envie mensagem no WhatsApp para agendar uma visita médica.",
        card2_title: "Profissionalismo",
        card2_desc: "Técnica de enfermagem capacitada para cuidados complexos.",
        card3_title: "Disponibilidade",
        card3_desc: "Horários flexíveis de acordo com as necessidades do paciente.",
        card4_title: "Localização",
        card4_desc: "Serviços disponíveis em toda a cidade de Passo Fundo - RS.",

        // Sobre Mim
        about_title: "Conheça Yennifer Blanco",
        about_p1: "Como Técnica de Enfermagem profissional, meu compromisso é oferecer atendimento da mais alta qualidade no conforto da sua casa. Entendo que a recuperação e o cuidado são mais eficazes em um ambiente familiar e tranquilo.",
        about_p2: "Conto com a capacitação técnica e a empatia necessárias para lidar desde o cuidado preventivo até o atendimento de pacientes com necessidades complexas, garantindo sempre o seu bem-estar.",
        about_feat1_title: "Atendimento Domiciliar",
        about_feat1_desc: "Cuidados profissionais sem sair de casa em Passo Fundo.",
        about_feat2_title: "Cuidado Empático",
        about_feat2_desc: "Tratamento humano, respeitoso e dedicado a cada paciente.",
        about_feat3_title: "Horários Flexíveis",
        about_feat3_desc: "Adaptabilidade total às rotinas e necessidades da família.",
        about_feat4_title: "Acompanhamento Rigoroso",
        about_feat4_desc: "Controle exato de tratamentos e sinais vitais.",
        about_btn: "Agendar uma Avaliação",

        // Serviços
        serv_title: "Serviços de Enfermagem",
        serv_subtitle: "Atendimento especializado e procedimentos técnicos no seu lar",
        serv1_title: "Sinais vitais",
        serv1_desc: "Monitoramento constante da pressão arterial, temperatura, frequência cardíaca e respiratória.",
        serv2_title: "Administração de medicamentos",
        serv2_desc: "Aplicação de tratamentos via intravenosa (IV) e intramuscular (IM) com prescrição médica.",
        serv3_title: "Curativos e tratamento de feridas",
        serv3_desc: "Tratamento e limpeza profissional de feridas, incluindo retirada de pontos.",
        serv4_title: "Pacientes em ventilação",
        serv4_desc: "Manejo técnico e especializado de pacientes que requerem suporte ventilatório.",
        serv5_title: "Traqueostomia e gastrostomia",
        serv5_desc: "Cuidados específicos, limpeza e manejo de pacientes com dispositivos médicos.",
        serv6_title: "Cuidados pós-cirúrgicos",
        serv6_desc: "Acompanhamento e cuidados personalizados durante a recuperação de cirurgias.",

        // Benefícios
        ben_title: "Vantagens do Cuidado em Casa",
        ben_subtitle: "Descubra por que a recuperação domiciliar é a melhor opção para seus entes queridos",
        ben1_title: "Conforto e Calor do Lar",
        ben1_desc: "Estar em um ambiente familiar e conhecido reduz a ansiedade do paciente, favorecendo um estado mental positivo que acelera o processo de cura.",
        ben2_title: "Menor Risco de Infecções",
        ben2_desc: "Ao evitar visitas constantes a hospitais, reduz-se drasticamente a exposição a vírus e bactérias intra-hospitalares.",
        ben_curiosity_title: "Você sabia?",
        ben_curiosity_desc: "Estudos médicos demonstram que pacientes que recebem cuidados em seu próprio lar relatam <strong>50% menos estresse</strong>, dormem melhor e apresentam uma recuperação clínica muito mais rápida e eficaz em comparação com internações prolongadas.",
        ben3_title: "Atendimento 100% Exclusivo",
        ben3_desc: "Diferente de um hospital, o paciente não divide a atenção com outros. O monitoramento é constante, direto e focado unicamente em suas necessidades.",
        ben4_title: "Integração Familiar",
        ben4_desc: "Permite à família estar presente e participar ativamente da recuperação, recebendo orientação direta sobre os cuidados com o paciente.",

        // Testimonios
        test_title: "Depoimentos de Pacientes",
        test_subtitle: "A tranquilidade e satisfação das famílias são a minha maior recomendação",

        // Contacto
        cont_title: "Entre em Contato",
        cont_subtitle: "Estou aqui para tirar suas dúvidas e avaliar suas necessidades de cuidado",
        cont_info_title: "Informações de Contato",
        cont_info_desc: "Sinta-se à vontade para me contatar. Responderei à sua solicitação o mais rápido possível para agendar sua visita.",
        cont_area_title: "Área de Atendimento",
        cont_area_desc: "Passo Fundo - RS (Em domicílio)",
        cont_phone_title: "Telefone / WhatsApp",
        cont_avail_title: "Disponibilidade",
        cont_avail_desc: "Segunda a Domingo (Com agendamento prévio)",

        // Formulario
        form_label_name: "Seu Nome",
        form_place_name: "Ex. Carlos Silva",
        form_label_phone: "Seu WhatsApp",
        form_place_phone: "Ex. (54) 90000-0000",
        form_label_email: "Seu E-mail (Opcional)",
        form_place_email: "email@exemplo.com",
        form_label_msg: "Como posso ajudar?",
        form_place_msg: "Descreva brevemente o tipo de cuidado ou serviço que você precisa...",
        form_btn: "Enviar Mensagem <i class='fas fa-paper-plane' style='margin-left: 8px;'></i>",

        // Footer
        foot_brand_desc: "Atendimento de enfermagem humanizado, profissional e de qualidade, levado diretamente ao conforto do seu lar.",
        foot_explore: "Explorar",
        foot_services: "Serviços",
        foot_serv1: "Sinais Vitais",
        foot_serv2: "Medicamentos",
        foot_serv3: "Curativos",
        foot_serv4: "Cuidados pós-cirúrgicos",
        foot_copy: "&copy; 2026 Enf. Yennifer Blanco. Todos os direitos reservados.",
        foot_dev: "Desenvolvido com carinho por <strong>Kelvis Tech</strong>"
    }
};

// Función principal para cambiar el idioma
function changeLanguage(lang) {
    localStorage.setItem('preferredLang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${lang}`).classList.add('active');

    // Traducir textos normales (innerHTML)
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // Traducir los placeholders de los inputs del formulario
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.setAttribute('placeholder', translations[lang][key]);
        }
    });

    updateWhatsAppLink(lang);
    document.documentElement.lang = lang;
}

// Función para cambiar el mensaje predeterminado de WhatsApp
function updateWhatsAppLink(lang) {
    const waFloat = document.querySelector('.whatsapp-float');
    if(waFloat) {
        const msgES = "Hola Yennifer, me gustaría solicitar información sobre tus servicios";
        const msgPT = "Olá Yennifer, gostaria de solicitar informações sobre seus serviços";
        const text = lang === 'pt' ? msgPT : msgES;
        waFloat.href = `https://wa.me/555499168720?text=${encodeURIComponent(text)}`;
    }
}

// Inicializar el idioma al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'pt'; 
    changeLanguage(savedLang);
});