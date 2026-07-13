// Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
        
        // Smooth scrolling for navigation links
        function scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Animation on scroll
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);
        
        // Observe elements with animate-fade-in class
        document.querySelectorAll('.animate-fade-in').forEach(el => {
            observer.observe(el);
        });
        
        // Handle form submission with Formspree integration and validation
        const contactForm = document.getElementById('contact-form');
        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');
        const errorMessageText = document.getElementById('form-error-text');
        const submitButton = document.getElementById('submit-button');

        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Clear previous status alerts
                successMessage.classList.add('hidden');
                errorMessage.classList.add('hidden');

                // Basic validation
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const service = document.getElementById('service').value;
                const message = document.getElementById('message').value.trim();

                if (!name || !email || !service || !message) {
                    showError('Please fill in all required fields.');
                    return;
                }

                // Email validation regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showError('Please enter a valid email address.');
                    return;
                }

                // Prepare button loading state
                const originalButtonContent = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i><span>Sending...</span>`;

                try {
                    // Check if they are still using the placeholder
                    if (contactForm.action.includes('YOUR_FORMSPREE_ID_HERE')) {
                        throw new Error('Please configure your Formspree Form ID in the action attribute of index.html.');
                    }

                    const formData = new FormData(contactForm);
                    const response = await fetch(contactForm.action, {
                        method: contactForm.method || 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Success path
                        successMessage.classList.remove('hidden');
                        contactForm.reset();
                        // Scroll to the alerts
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        // Formspree returned an error
                        const data = await response.json();
                        if (data && data.errors) {
                            const errorMsgs = data.errors.map(err => err.message).join(', ');
                            throw new Error(errorMsgs || 'Submission failed.');
                        } else {
                            throw new Error('Submission failed. Please try again later.');
                        }
                    }
                } catch (error) {
                    showError(error.message || 'An unexpected error occurred. Please try again.');
                } finally {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonContent;
                }
            });
        }

        function showError(message) {
            errorMessageText.textContent = message;
            errorMessage.classList.remove('hidden');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }