$(document).ready(function() {

    const header = $('#header');
    let headerHeight = header.outerHeight() || 70; 
    $(window).on('load', function() {
        headerHeight = header.outerHeight() || 70;
    });

    // --- Dynamic Content Personalization ---
    const businessName = "Your Business"; 
    const businessCity = "Your Area"; 

    // Update headline in the new guarantee section
    $('#features-headline').html(`Make <span class="highlight">${businessName}</span> The Go-To, First Choice for Customers in the ${businessCity}`);

    $('.offer-card.monthly-plan .offer-features li:first-child').html(`<i class="fas fa-crown"></i> Local Market Exclusivity (One business type per area)`);
    $('.offer-card.annual-plan .offer-features li:first-child').html(`<i class="fas fa-crown"></i> Local Market Exclusivity (One business type per area)`);

    // --- Set Default Plan on Page Load ---
    function setDefaultPlan() {
        const defaultPlan = 'annual_program';
        const annualCard = $('.offer-card.annual-plan');
        const formTitle = $('#form-title-text');
        const submitButton = $('#lead-form .btn-submit');
        const selectedPlanInput = $('#form-selected-plan');

        $('.offer-card').removeClass('selected');
        annualCard.addClass('selected');
        
        selectedPlanInput.val(defaultPlan);
        formTitle.html('Apply for <span class="highlight">Annual Membership</span>');
        submitButton.text('Complete My Membership Registration');
    }

    setDefaultPlan(); // Call on page load

    // --- Event Handlers ---
    $('nav a[href^="#"], .cta-buttons a[href^="#"], .custom-cards-text a[href^="#"], .comparison-cta a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - headerHeight + 1
            }, 800);

            if ($('#header nav ul').hasClass('active')) {
                $('#header nav ul').removeClass('active');
                $('#mobile-menu-toggle i').removeClass('fa-times').addClass('fa-bars');
            }
        }
    });

    $('#mobile-menu-toggle').on('click', function() {
        const navUl = $('nav ul');
        navUl.toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });

    $('.faq-question').on('click', function() {
        const answer = $(this).next('.faq-answer');
        const icon = $(this).find('i');

        $('.faq-answer').not(answer).slideUp(300).removeClass('open')
            .prev().removeClass('active').find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        
        answer.slideToggle(300, function() {
            $(this).toggleClass('open');
        });
        $(this).toggleClass('active');
        icon.toggleClass('fa-chevron-down fa-chevron-up');
    });
    
    window.showForm = function(planType, buttonElement) {
        const formSection = $('#contact-form-section');
        const formTitle = $('#form-title-text');
        const selectedPlanInput = $('#form-selected-plan');
        const formSubmissionMessage = $('#form-submission-message');
        const submitButton = $('#lead-form .btn-submit');

        $('.offer-card').removeClass('selected');
        $(buttonElement).closest('.offer-card').addClass('selected');

        formSubmissionMessage.text('').removeClass('success error info');
        selectedPlanInput.val(planType);
        
        if (!formSection.is(':visible')) {
            formSection.slideDown();
        }

        let titleText = "Lock In Your Local Market";
        let buttonText = "Send My Request";

        if (planType === 'monthly_program') {
            titleText = 'Apply for <span class="highlight">Monthly Membership</span>';
            buttonText = 'Complete My Membership Registration';
        } else if (planType === 'annual_program') {
            titleText = 'Apply for <span class="highlight">Annual Membership</span>';
            buttonText = 'Complete My Membership Registration';
        } else if (planType === 'free_trial') {
            titleText = 'Request <span class="highlight">Free Trial</span>';
            buttonText = 'Submit Free Trial Request';
        }
        formTitle.html(titleText);
        submitButton.text(buttonText);

        $('html, body').animate({
            scrollTop: formSection.offset().top - headerHeight - 20
        }, 800);
    }

    $('#lead-form').on('submit', function(event) {
        event.preventDefault();
        const form = $(this);
        const formData = form.serializeArray();
        const formObject = {};
        const formSubmissionMessage = $('#form-submission-message');

        let isValid = true;
        form.find('input[required]').each(function() {
            if ($(this).val().trim() === "") {
                isValid = false;
                $(this).css('border-color', 'var(--error-color)');
            } else {
                $(this).css('border-color', 'var(--border-color)');
            }
        });

        if (!isValid) {
            formSubmissionMessage.text('Please fill in all required fields.').removeClass('success info').addClass('error');
            return;
        }

        $.each(formData, function(i, field) {
            formObject[field.name] = field.value;
        });

        console.log("Form Submitted Data:", formObject);
        formSubmissionMessage.text('Submitting your request...').removeClass('error success').addClass('info');

        setTimeout(function() {
            let successMessage = 'Thank you! Your request has been received. We will contact you shortly.';
            if(formObject.selected_plan === 'monthly_program' || formObject.selected_plan === 'annual_program'){
                successMessage = 'Thank you for registering! We will review your application and contact you soon to finalize your membership.';
            } else if (formObject.selected_plan === 'free_trial'){
                 successMessage = 'Thanks for your interest in the Free Trial! We will send you more information shortly.';
            }
            formSubmissionMessage.text(successMessage).removeClass('info error').addClass('success');
            form[0].reset();
            form.find('input[required]').css('border-color', 'var(--border-color)');
            
            // Reset form texts and selection
            $('#form-title-text').html('Lock In Your Local Market');
            $('#lead-form .btn-submit').text('Send My Request');
            $('.offer-card').removeClass('selected');
            setDefaultPlan(); // Reset to default selection after submission

        }, 1500);
    });

    $('#current-year').text(new Date().getFullYear());

    function initComparisonSlider() {
        const slider = document.querySelector('.comparison-slider');
        if (!slider) return;
        const afterImage = slider.querySelector('.slider-image-after');
        const sliderHandle = slider.querySelector('.slider-handle');
        let isDragging = false;
        
        function moveSlider(x) {
            const rect = slider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            position = Math.max(0, Math.min(100, position));
            sliderHandle.style.left = position + '%';
            afterImage.style.clipPath = `inset(0 0 0 ${position}%)`;
        }
        
        const startDrag = () => {
            isDragging = true;
            sliderHandle.classList.add('dragging');
        };

        const endDrag = () => {
            isDragging = false;
            sliderHandle.classList.remove('dragging');
        };

        sliderHandle.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(); });
        sliderHandle.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { e.preventDefault(); startDrag(); } });
        
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);

        window.addEventListener('mousemove', (e) => { if (isDragging) { moveSlider(e.clientX); } });
        window.addEventListener('touchmove', (e) => { if (isDragging && e.touches.length === 1) { moveSlider(e.touches[0].clientX); } });
    }
    
    function initStatAnimations() {
        const impactSection = document.getElementById('google-listing-impact');
        if (!impactSection) return;

        const animateValue = (element, start, end, duration, formatter) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = progress * (end - start) + start;
                element.text(formatter(currentValue));
                if (progress < 1) { window.requestAnimationFrame(step); }
            };
            window.requestAnimationFrame(step);
        };

        const setProgress = (circle, percent) => {
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    impactSection.classList.add('is-animated');
                    
                    const afterOverlay = $('.after-overlay');
                    const afterRating = afterOverlay.find('.rating-score');
                    const afterReviews = afterOverlay.find('.review-count');
                    const afterGrowth = afterOverlay.find('.growth-value');
                    const afterRank = afterOverlay.find('.rank-value');
                    const afterEngagement = afterOverlay.find('.engagement-value');
                    const afterSentiment = afterOverlay.find('.sentiment-value');

                    const sliderHandle = impactSection.querySelector('.slider-handle');
                    const afterImage = impactSection.querySelector('.slider-image-after');

                    $({percent: 50}).animate({percent: 25}, {
                        duration: 1500,
                        step: function() {
                            const currentPercent = this.percent;
                            sliderHandle.style.left = currentPercent + '%';
                            afterImage.style.clipPath = `inset(0 0 0 ${currentPercent}%)`;
                        }
                    });

                    animateValue(afterRating, 3.2, 4.8, 1500, (val) => val.toFixed(1));
                    animateValue(afterReviews, 24, 156, 1500, (val) => `(${Math.round(val)} reviews)`);
                    animateValue(afterGrowth, 2, 18, 1500, (val) => `+${Math.round(val)} Reviews`);
                    animateValue(afterRank, 12, 1, 1500, (val) => `#${Math.round(val)}`);
                    animateValue(afterEngagement, 8, 25, 1500, (val) => `${Math.round(val)}%`);
                    animateValue(afterSentiment, 75, 98, 1500, (val) => `${Math.round(val)}%`);

                    const beforeCircle = impactSection.querySelector('.before-overlay .progress-ring__circle');
                    const afterCircle = impactSection.querySelector('.after-overlay .progress-ring__circle');
                    setProgress(beforeCircle, 8);
                    setProgress(afterCircle, 25);

                    setTimeout(() => {
                        afterRank.addClass('positive-change').html(`#1 <i class="fas fa-trophy rank-icon"></i>`);
                        const sentimentIcon = afterOverlay.find('.sentiment-icon');
                        sentimentIcon.addClass('is-happy');
                        sentimentIcon.find('i').removeClass('fa-meh').addClass('fa-laugh-beam');
                        
                        afterOverlay.addClass('glowing-effect');
                        
                        sliderHandle.classList.add('show-indicator');

                        if(typeof confetti === 'function') {
                             const rect = afterOverlay[0].getBoundingClientRect();
                             const origin = {
                                 x: (rect.left + rect.right) / 2 / window.innerWidth,
                                 y: (rect.top + rect.bottom) / 2 / window.innerHeight
                             };
                             confetti({
                                 particleCount: 100,
                                 spread: 70,
                                 origin: origin,
                                 colors: ['#18883e', '#FFC107', '#FFFFFF']
                             });
                        }

                    }, 1600); 

                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(impactSection);
    }

    initComparisonSlider();
    initStatAnimations();
});
