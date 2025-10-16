// Configuration - UPDATE WITH YOUR EMAIL
const BUSINESS_EMAIL = 'mentroid29@gmail.com'; // Change this to your email

const BUSINESS_NAME = 'Mentroid'; // Change this to your business name
// Booking functionality
function handleBooking(serviceName = 'Consultation') {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'booking-modal';
  modal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeBookingModal()"></div>
    <div class="booking-modal-content">
      <button class="modal-close" onclick="closeBookingModal()">&times;</button>
      <h2 class="modal-title">Book ${serviceName}</h2>
      <p class="modal-subtitle">Fill out the form below to schedule your appointment</p>
      
      <form id="bookingForm" class="booking-form" onsubmit="submitBooking(event, '${serviceName}')">
        <div class="form-row">
          <div class="form-group">
            <label for="bookingName">Full Name *</label>
            <input type="text" id="bookingName" name="name" required placeholder="XYZ">
          </div>
          
          <div class="form-group">
            <label for="bookingEmail">Email *</label>
            <input type="email" id="bookingEmail" name="email" required placeholder="zyx@email.com">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="bookingPhone">Phone Number *</label>
            <input type="tel" id="bookingPhone" name="phone" required placeholder="+91 98765 43210">
          </div>
          
          <div class="form-group">
            <label for="bookingDate">Preferred Date *</label>
            <input type="date" id="bookingDate" name="date" required min="${getTodayDate()}">
          </div>
        </div>

        <div class="form-group">
          <label for="bookingService">Service Type *</label>
          <select id="bookingService" name="service" required>
            <option value="${serviceName}">${serviceName}</option>
            <option value="AI Career Guidance">AI Career Guidance</option>
            <option value="Tech & ML Consultancy">Tech & ML Consultancy</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="bookingMessage">Additional Details</label>
          <textarea id="bookingMessage" name="message" rows="4" placeholder="Tell us about your project or requirements..."></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-cancel" onclick="closeBookingModal()">Cancel</button>
          <button type="submit" class="btn-submit">Send Booking Request</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  setTimeout(() => modal.classList.add('active'), 10);
}

// Close modal
function closeBookingModal() {
  const modal = document.querySelector('.booking-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Submit booking
function submitBooking(event, serviceName) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const submitBtn = form.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  sendViaFormSubmit(data, submitBtn, originalText);
}

// Send via FormSubmit.co
function sendViaFormSubmit(data, submitBtn, originalText) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `https://formsubmit.co/${BUSINESS_EMAIL}`;


  form.style.display = 'none';

  const fields = {
    '_subject': `New ${data.service} Booking Request - ${data.name}`,
    '_template': 'table',
    '_captcha': 'false',
    '_next': 'https://www.mentroid.co.in',
    'Name': data.name,
    'Email': data.email,
    'Phone': data.phone,
    'Service': data.service,
    'Preferred Date': formatDate(data.date),
    'Message': data.message || 'No additional details provided'
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);

  try {
    form.submit();
    window.location.href = "https://www.mentroid.co.in";
    setTimeout(() => {
      showSuccessMessage(data);
      closeBookingModal();
      form.remove();
    }, 1000);
  } catch (error) {
    console.error('Error sending form:', error);
  }
}

// Show success message
function showSuccessMessage(bookingData) {
  const successModal = document.createElement('div');
  successModal.className = 'booking-modal success-modal active';
  successModal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeSuccessModal()"></div>
    <div class="booking-modal-content success-content">
      <div class="success-icon">✓</div>
      <h2 class="success-title">Booking Request Sent!</h2>
      <p class="success-message">
        Thank you, <strong>${bookingData.name}</strong>! Your ${bookingData.service} request 
        for <strong>${formatDate(bookingData.date)}</strong> has been sent successfully.
      </p>
      <p class="success-submessage">
        We'll contact you at <strong>${bookingData.email}</strong> or <strong>${bookingData.phone}</strong> within 24 hours to confirm your appointment.
      </p>
      <button class="btn-primary" onclick="closeSuccessModal()">Got it!</button>
    </div>
  `;
  document.body.appendChild(successModal);
}

// Close success modal
function closeSuccessModal() {
  const modal = document.querySelector('.success-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

// Utilities
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBookingModal();
    closeSuccessModal();
  }
});

// Initialize booking buttons
document.addEventListener('DOMContentLoaded', () => {
  const bookingButtons = document.querySelectorAll('[data-booking], .btn-booking, .consultation-btn');
  bookingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service') || btn.textContent.trim() || 'Consultation';
      handleBooking(serviceName);
    });
  });
});

// CSS for modal (add to your stylesheet)
const modalStyles = `
<style>
* {
  box-sizing: border-box;
}

.booking-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.booking-modal.active {
  opacity: 1;
}

.booking-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

.booking-modal-content {
  position: relative;
  background: var(--bg-card, #ffffff);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.booking-modal.active .booking-modal-content {
  transform: translateY(0);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--text-secondary, #666);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-primary, #333);
  transform: rotate(90deg);
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-primary, #412da8);
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: var(--text-secondary, #666);
  margin-bottom: 2rem;
  font-size: 1rem;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary, #333);
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.8rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--bg-primary, #f9f9f9);
  color: var(--text-primary, #333);
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-secondary, #37a5f5);
  box-shadow: 0 0 0 3px rgba(55, 165, 245, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: transparent;
  border: 2px solid var(--border-color, #ddd);
  color: var(--text-secondary, #666);
}

.btn-cancel:hover {
  background: var(--bg-primary, #f9f9f9);
  border-color: var(--text-secondary, #666);
}

.btn-submit {
  background: linear-gradient(135deg, var(--accent-primary, #412da8), var(--accent-secondary, #37a5f5));
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(65, 45, 168, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success Modal */
.success-content {
  text-align: center;
  padding: 3rem 2rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
  animation: successPop 0.5s ease;
}

@keyframes successPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.success-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-primary, #412da8);
  margin-bottom: 1rem;
}

.success-message,
.success-submessage {
  color: var(--text-secondary, #666);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.success-submessage {
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

/* Mobile Responsive */
@media (max-width: 800px) {
  .booking-modal-content {
    padding: 2rem 1.5rem;
    width: 95%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-title {
    font-size: 1.5rem;
    padding-right: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .success-icon {
    width: 70px;
    height: 70px;
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .booking-modal-content {
    padding: 1.5rem 1rem;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .modal-subtitle {
    font-size: 0.9rem;
  }
}

textarea{
 resize : vertical;
 min-height:4.5em;
}
</style>
`;

// Inject styles into the document
if (document.head) {
  document.head.insertAdjacentHTML('beforeend', modalStyles);
}

//Training Program
// AI, ML, IoT & Video Editing Training / Service Modal
function handleAITechTraining(trainingType = 'Service') {
  const modal = document.createElement('div');
  modal.className = 'booking-modal';
  modal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeBookingModal()"></div>
    <div class="booking-modal-content">
      <button class="modal-close" onclick="closeBookingModal()">&times;</button>
      <h2 class="modal-title">🤖 ${trainingType}</h2>
      <p class="modal-subtitle">Register or request a quote for our AI-driven training or development service</p>
      
      <form id="aiMlForm" class="booking-form" onsubmit="submitAITechTraining(event, '${trainingType}')">

        <!-- Basic Info -->
        <div class="form-row">
          <div class="form-group">
            <label for="aiName">Full Name *</label>
            <input type="text" id="aiName" name="name" required placeholder="XYZ">
          </div>
          <div class="form-group">
            <label for="aiEmail">Email *</label>
            <input type="email" id="aiEmail" name="email" required placeholder="xyz.gmail.com">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="aiPhone">Phone Number *</label>
            <input type="tel" id="aiPhone" name="phone" required placeholder="+91 98765 43210">
          </div>
          <div class="form-group">
            <label for="aiService">Service or Training Type *</label>
            <select id="aiService" name="service" required>
              <option value="">Select category</option>
              <option value="AI Chatbot Development">AI Chatbot Development</option>
              <option value="Machine Learning with IoT Integration">Machine Learning with IoT Integration</option>
              <option value="AI Video Editing & Automation">AI Video Editing & Automation</option>
              <option value="Deep Learning Model Training">Deep Learning Model Training</option>
              <option value="Custom AI Solution / Consulting">Custom AI Solution / Consulting</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="aiBudget">Estimated Budget Range *</label>
            <select id="aiBudget" name="budget" required>
              <option value="">Select range</option>
              <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
              <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
              <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
              <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
              <option value="Above ₹1,00,000">Above ₹1,00,000 (Enterprise / Custom)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="aiDataset">Dataset Availability *</label>
            <select id="aiDataset" name="dataset" required>
              <option value="">Select option</option>
              <option value="I will provide my own dataset">I will provide my own dataset</option>
              <option value="Need dataset creation / sourcing support">Need dataset creation / sourcing support</option>
              <option value="Not applicable (e.g. chatbot training)">Not applicable</option>
            </select>
          </div>
        </div>


        <div class="form-row">
          <div class="form-group">
            <label for="aiStartDate">Preferred Start Date *</label>
            <input type="date" id="aiStartDate" name="startDate" required min="${getTodayDate()}">
          </div>
        </div>

        <!-- Project Goals -->
        <div class="form-group">
          <label for="aiGoals">Project Goals / Learning Objectives</label>
          <textarea id="aiGoals" name="goals" rows="4" placeholder="Describe your idea, project scope, or learning goals..."></textarea>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" onclick="closeBookingModal()">Cancel</button>
          <button type="submit" class="btn-submit">Submit Request</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.classList.add('active'), 10);
}

// Submit AI/ML/IoT form
function submitAITechTraining(event, trainingType) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const submitBtn = form.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  // Use FormSubmit service (free, no backend required)
  sendAITechViaFormSubmit(data, submitBtn, originalText);
}

// Send via FormSubmit
function sendAITechViaFormSubmit(data, submitBtn, originalText) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `https://formsubmit.co/${BUSINESS_EMAIL}`;

  form.style.display = 'none';

  const fields = {
    '_subject': `🤖 New ${data.service} Inquiry - ${data.name}`,
    '_template': 'table',
    '_captcha': 'false',
    '_next': 'https://www.mentroid.co.in', // ✅ FormSubmit auto-redirects here
    'Category': 'AI / ML / IoT / Video Service or Training',
    'Name': data.name,
    'Email': data.email,
    'Phone': data.phone,
    'Experience Level': data.level,
    'Service Type': data.service,
    'Budget Range': data.budget,
    'Dataset Availability': data.dataset,
    'Preferred Start Date': formatDate(data.startDate),
    'Goals / Description': data.goals || 'Not provided'
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);

  try {
    // ✅ Submit form (FormSubmit handles redirect using _next)
    form.submit();

    // Smooth cleanup (optional)
    setTimeout(() => {
      closeBookingModal();
      form.remove();
    }, 1000);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to submit request. Please try again.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}


// Success Message for AI/ML Training or Service
function showAISuccessMessage(data) {
  const successModal = document.createElement('div');
  successModal.className = 'booking-modal success-modal active';
  successModal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeSuccessModal()"></div>
    <div class="booking-modal-content success-content">
      <div class="success-icon">✅</div>
      <h2 class="success-title">Request Submitted!</h2>
      <p class="success-message">
        Thank you, <strong>${data.name}</strong>! Your inquiry for 
        <strong>${data.service}</strong> (Budget: <strong>${data.budget}</strong>) 
        has been sent successfully.
      </p>
      <p class="success-submessage">
        We’ll contact you at <strong>${data.email}</strong> or <strong>${data.phone}</strong> 
        soon to discuss your project or training details.
      </p>
      <button class="btn-primary" onclick="closeSuccessModal()">Got it!</button>
    </div>
  `;
  document.body.appendChild(successModal);
}

// Show training success message
function showTrainingSuccess(trainingData) {
  const successModal = document.createElement('div');
  successModal.className = 'booking-modal success-modal active';
  successModal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeSuccessModal()"></div>
    <div class="booking-modal-content success-content">
      <div class="success-icon">🎓</div>
      <h2 class="success-title">Registration Successful!</h2>
      <p class="success-message">
        Congratulations, <strong>${trainingData.name}</strong>! You've successfully registered for 
        <strong>${trainingData.course}</strong> training program.
      </p>
      <p class="success-submessage">
        We'll send detailed course information and enrollment details to 
        <strong>${trainingData.email}</strong> within 24 hours.
      </p>
      <div style="background: var(--bg-primary, #f9f9f9); padding: 1.5rem; border-radius: 15px; margin: 1.5rem 0;">
        <p style="margin: 0.5rem 0; color: var(--text-secondary, #666); font-size: 0.95rem;">
          📅 Start Date: <strong>${formatDate(trainingData.startDate)}</strong><br>
          ⏱️ Duration: <strong>${trainingData.duration}</strong><br>
          💻 Mode: <strong>${trainingData.mode}</strong>
        </p>
      </div>
      <button class="btn-primary" onclick="closeSuccessModal()">Awesome!</button>
    </div>
  `;

  document.body.appendChild(successModal);
}

// Initialize booking and training buttons
document.addEventListener('DOMContentLoaded', () => {
  // Add click handlers to all booking/consultation buttons
  const bookingButtons = document.querySelectorAll('[data-booking], .btn-booking, .consultation-btn');
  bookingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service') || btn.textContent.trim() || 'Consultation';
      handleBooking(serviceName);
    });
  });

  // Add click handlers to training buttons
  const trainingButtons = document.querySelectorAll('[data-training], .btn-training, .training-btn');
  trainingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const trainingType = btn.getAttribute('data-training-type') || 'Training Program';
      handleTraining(trainingType);
    });
  });
});


// Inject styles into the document
if (document.head) {
  document.head.insertAdjacentHTML('beforeend', modalStyles);
}

//Quote

// Booking functionality
function handleBooking(serviceName = 'Consultation') {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'booking-modal';
  modal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeBookingModal()"></div>
    <div class="booking-modal-content">
      <button class="modal-close" onclick="closeBookingModal()">&times;</button>
      <h2 class="modal-title">Book ${serviceName}</h2>
      <p class="modal-subtitle">Fill out the form below to schedule your appointment</p>
      
      <form id="bookingForm" class="booking-form" onsubmit="submitBooking(event, '${serviceName}')">
        <div class="form-row">
          <div class="form-group">
            <label for="bookingName">Full Name *</label>
            <input type="text" id="bookingName" name="name" required placeholder="XYZ">
          </div>
          
          <div class="form-group">
            <label for="bookingEmail">Email *</label>
            <input type="email" id="bookingEmail" name="email" required placeholder="xyz@email.com">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="bookingPhone">Phone Number *</label>
            <input type="tel" id="bookingPhone" name="phone" required placeholder="+91 98765 43210">
          </div>
          
          <div class="form-group">
            <label for="bookingDate">Preferred Date *</label>
            <input type="date" id="bookingDate" name="date" required min="${getTodayDate()}">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="bookingTime">Preferred Time *</label>
            <select id="bookingTime" name="time" required>
              <option value="">Select time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="bookingService">Service Type *</label>
            <select id="bookingService" name="service" required>
            <option value="${serviceName}">${serviceName}</option>
            <option value="AI Career Guidance">AI Career Guidance</option>
            <option value="Tech & ML Consultancy">Tech & ML Consultancy</option>
          </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="bookingMessage">Additional Details</label>
          <textarea id="bookingMessage" name="message" rows="4" placeholder="Tell us about your project or requirements..."></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-cancel" onclick="closeBookingModal()">Cancel</button>
          <button type="submit" class="btn-submit">Send Booking Request</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Animate modal in
  setTimeout(() => modal.classList.add('active'), 10);
}

// Close modal
function closeBookingModal() {
  const modal = document.querySelector('.booking-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Submit booking via email
function submitBooking(event, serviceName) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Show loading state
  const submitBtn = form.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Create email content
  const emailSubject = `New ${data.service} Booking Request - ${data.name}`;
  const emailBody = createEmailBody(data);

  // Method 1: Using FormSubmit.co (Recommended - No backend needed)
  sendViaFormSubmit(data, submitBtn, originalText);

  // Method 2: Using mailto (Backup - Opens email client)
  // sendViaMailto(emailSubject, emailBody, data, submitBtn, originalText);
}

// Method 1: Send via FormSubmit.co (FREE service, no backend needed)
function sendViaFormSubmit(data, submitBtn, originalText) {
  // Create form for FormSubmit
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `https://formsubmit.co/${BUSINESS_EMAIL}`;

  form.style.display = 'none';

  // Add form fields
  const fields = {
    '_subject': `New ${data.service} Booking Request - ${data.name}`,
    '_template': 'table',
    '_captcha': 'false',
    '_next': 'https://www.mentroid.co.in', // ✅ Instant redirect handled by FormSubmit
    'Name': data.name,
    'Email': data.email,
    'Phone': data.phone,
    'Service': data.service,
    'Preferred Date': formatDate(data.date),
    'Preferred Time': formatTime(data.time),
    'Message': data.message || 'No additional details provided'
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);

  // ✅ Submit and let FormSubmit redirect automatically
  try {
    form.submit();

    // Optional: small delay for modal animation cleanup
    setTimeout(() => {
      closeBookingModal();
      form.remove();
    }, 1000);
  } catch (error) {
    console.error('Error sending form:', error);

    // Fallback to mailto if something fails
    const emailSubject = `New ${data.service} Booking Request - ${data.name}`;
    const emailBody = createEmailBody(data);
    sendViaMailto(emailSubject, emailBody, data, submitBtn, originalText);
  }
}


// Method 2: Send via mailto (Opens default email client)
function sendViaMailto(subject, body, data, submitBtn, originalText) {
  const mailtoLink = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Open email client
  window.location.href = mailtoLink;

  // Show success message
  setTimeout(() => {
    showSuccessMessage(data);
    closeBookingModal();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 500);
}

// Method 3: Using Web3Forms (Alternative free service)
function sendViaWeb3Forms(data, submitBtn, originalText) {
  const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_KEY'; // Get from https://web3forms.com

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New ${data.service} Booking Request - ${data.name}`,
      from_name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      preferred_date: formatDate(data.date),
      preferred_time: formatTime(data.time),
      message: data.message || 'No additional details'
    })
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        showSuccessMessage(data);
        closeBookingModal();
      } else {
        alert('Failed to send booking. Please try again or contact us directly.');
      }
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to send booking. Please try again.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
}

// Create formatted email body
function createEmailBody(data) {
  return `
NEW BOOKING REQUEST
==================

Client Information:
-------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Booking Details:
----------------
Service: ${data.service}
Preferred Date: ${formatDate(data.date)}
Preferred Time: ${formatTime(data.time)}

Additional Details:
-------------------
${data.message || 'No additional details provided'}

---
This booking request was submitted through ${BUSINESS_NAME} website.
Please respond to the client at ${data.email} or ${data.phone}.
`;
}

// Show success message
function showSuccessMessage(bookingData) {
  const successModal = document.createElement('div');
  successModal.className = 'booking-modal success-modal active';
  successModal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeSuccessModal()"></div>
    <div class="booking-modal-content success-content">
      <div class="success-icon">✓</div>
      <h2 class="success-title">Booking Request Sent!</h2>
      <p class="success-message">
        Thank you, <strong>${bookingData.name}</strong>! Your ${bookingData.service} request 
        for <strong>${formatDate(bookingData.date)}</strong> at <strong>${formatTime(bookingData.time)}</strong>
        has been sent successfully.
      </p>
      <p class="success-submessage">
        We'll contact you at <strong>${bookingData.email}</strong> or <strong>${bookingData.phone}</strong> within 24 hours to confirm your appointment.
      </p>
      <button class="btn-primary" onclick="closeSuccessModal()">Got it!</button>
    </div>
  `;

  document.body.appendChild(successModal);
}

// Close success modal
function closeSuccessModal() {
  const modal = document.querySelector('.success-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

// Utility functions
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  const [hours] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${ampm}`;
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBookingModal();
    closeSuccessModal();
  }
});


// Custom Development Quote functionality
function handleQuote(serviceType = 'Custom Development') {
  const modal = document.createElement('div');
  modal.className = 'booking-modal';
  modal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeBookingModal()"></div>
    <div class="booking-modal-content">
      <button class="modal-close" onclick="closeBookingModal()">&times;</button>
      <h2 class="modal-title">💼 Get Custom Quote</h2>
      <p class="modal-subtitle">Tell us about your project and we'll provide a detailed quote</p>
      
      <form id="quoteForm" class="booking-form" onsubmit="submitQuote(event, '${serviceType}')">
        <div class="form-row">
          <div class="form-group">
            <label for="quoteName">Full Name *</label>
            <input type="text" id="quoteName" name="name" required placeholder="XYZ">
          </div>
          
          <div class="form-group">
            <label for="quoteCompany">Company/Organization</label>
            <input type="text" id="quoteCompany" name="company" placeholder="Your Company">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="quoteEmail">Email *</label>
            <input type="email" id="quoteEmail" name="email" required placeholder="xyz@gmail.com">
          </div>
          
          <div class="form-group">
            <label for="quotePhone">Phone Number *</label>
            <input type="tel" id="quotePhone" name="phone" required placeholder="+91 98765 43210">
          </div>
        </div>
        
        
        <div class="form-group">
          <label for="quoteService">Service Type *</label>
          <select id="quoteService" name="service" required>
            <option value="AI Chatbot Development">AI Chatbot Development</option>
              <option value="Machine Learning with IoT Integration">Machine Learning with IoT Integration</option>
              <option value="AI Video Editing & Automation">AI Video Editing & Automation</option>
              <option value="Deep Learning Model Training">Deep Learning Model Training</option>
              <option value="Custom AI Solution / Consulting">Custom AI Solution / Consulting</option>
            </select>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="quoteBudget">Estimated Budget *</label>
            <select id="quoteBudget" name="budget" required>
              <option value="">Select budget range</option>
              <option value="₹299 - ₹5,000">₹299 - ₹5,000</option>
              <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
              <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
              <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
              <option value="₹50,000+">₹50,000+</option>
              <option value="Not Sure">Not Sure</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="quoteTimeline">Project Timeline *</label>
            <select id="quoteTimeline" name="timeline" required>
              <option value="">Select timeline</option>
              <option value="1-2 Weeks">1-2 Weeks</option>
              <option value="2-4 Weeks">2-4 Weeks</option>
              <option value="1-2 Months">1-2 Months</option>
              <option value="2-3 Months">2-3 Months</option>
              <option value="3-6 Months">3-6 Months</option>
              <option value="6+ Months">6+ Months</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="quoteDescription">Project Description *</label>
          <textarea id="quoteDescription" name="description" rows="4" required placeholder="Describe your project requirements, features needed, target audience, etc."></textarea>
        </div>
        
        <div class="form-group">
          <label for="quoteFeatures">Key Features Required</label>
          <textarea id="quoteFeatures" name="features" rows="3" placeholder="List the main features you need (e.g., user authentication, payment integration, real-time chat, etc.)"></textarea>
        </div>
        
        <div class="form-group">
          <label for="quoteReference">Reference Websites/Apps (if any)</label>
          <input type="text" id="quoteReference" name="reference" placeholder="https://example.com">
        </div>
        
        <div class="form-group" style="margin-top: 1rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
            <input type="checkbox" id="quoteUrgent" name="urgent" value="yes" style="width: auto;">
            <span>This is an urgent project</span>
          </label>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-cancel" onclick="closeBookingModal()">Cancel</button>
          <button type="submit" class="btn-submit">Request Quote</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.classList.add('active'), 10);
}

// Submit quote request
function submitQuote(event, serviceType) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const submitBtn = form.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Send via FormSubmit
  sendQuoteViaFormSubmit(data, submitBtn, originalText);
}

// Send quote request via FormSubmit
function sendQuoteViaFormSubmit(data, submitBtn, originalText) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `https://formsubmit.co/${BUSINESS_EMAIL}`;

  form.style.display = 'none';

  const urgentFlag = data.urgent === 'yes' ? '🔴 URGENT - ' : '';

  // ✅ Include _next for instant redirect (no FormSubmit "Thanks" page)
  const fields = {
    '_subject': `${urgentFlag}💼 New Quote Request - ${data.name}`,
    '_template': 'table',
    '_captcha': 'false',
    '_next': 'https://www.mentroid.co.in', // ✅ Redirect handled by FormSubmit
    'Request Type': 'Custom Development Quote',
    'Name': data.name,
    'Company': data.company || 'Not provided',
    'Email': data.email,
    'Phone': data.phone,
    'Service Type': data.service,
    'Budget Range': data.budget,
    'Timeline': data.timeline,
    'Project Description': data.description,
    'Key Features': data.features || 'Not specified',
    'Reference': data.reference || 'None provided',
    'Urgent Project': data.urgent === 'yes' ? 'YES - Priority Request' : 'No'
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);

  try {
    // ✅ Submit handled by FormSubmit (redirects automatically via _next)
    form.submit();

    // Smooth cleanup
    setTimeout(() => {
      closeBookingModal();
      form.remove();
    }, 1000);
  } catch (error) {
    console.error('Error sending form:', error);
    alert('Failed to submit quote request. Please try again.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}


// Show quote success message
function showQuoteSuccess(quoteData) {
  const successModal = document.createElement('div');
  successModal.className = 'booking-modal success-modal active';
  successModal.innerHTML = `
    <div class="booking-modal-overlay" onclick="closeSuccessModal()"></div>
    <div class="booking-modal-content success-content">
      <div class="success-icon">💼</div>
      <h2 class="success-title">Quote Request Received!</h2>
      <p class="success-message">
        Thank you, <strong>${quoteData.name}</strong>! We've received your request for 
        <strong>${quoteData.service}</strong>.
      </p>
      <div style="background: var(--bg-primary, #f9f9f9); padding: 1.5rem; border-radius: 15px; margin: 1.5rem 0; text-align: left;">
        <p style="margin: 0.5rem 0; color: var(--text-secondary, #666); font-size: 0.95rem;">
          💰 Budget: <strong>${quoteData.budget}</strong><br>
          ⏱️ Timeline: <strong>${quoteData.timeline}</strong><br>
          ${quoteData.urgent === 'yes' ? '🔴 <strong style="color: #ff4444;">Marked as Urgent</strong><br>' : ''}
        </p>
      </div>
      <p class="success-submessage">
        Our team will review your requirements and send a detailed quote to 
        <strong>${quoteData.email}</strong> within 24-48 hours.
      </p>
      <p class="success-submessage" style="font-size: 0.9rem; color: var(--text-tertiary, #888);">
        💡 Tip: Check your spam folder if you don't see our email in your inbox.
      </p>
      <button class="btn-primary" onclick="closeSuccessModal()">Perfect!</button>
    </div>
  `;

  document.body.appendChild(successModal);
}

// Initialize booking, training, and quote buttons
document.addEventListener('DOMContentLoaded', () => {
  // Add click handlers to all booking/consultation buttons
  const bookingButtons = document.querySelectorAll('[data-booking], .btn-booking, .consultation-btn');
  bookingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service') || btn.textContent.trim() || 'Consultation';
      handleBooking(serviceName);
    });
  });

  // Add click handlers to training buttons
  const trainingButtons = document.querySelectorAll('[data-training], .btn-training, .training-btn');
  trainingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const trainingType = btn.getAttribute('data-training-type') || 'Training Program';
      handleTraining(trainingType);
    });
  });

  // Add click handlers to quote buttons
  const quoteButtons = document.querySelectorAll('[data-quote], .btn-quote, .quote-btn');
  quoteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceType = btn.getAttribute('data-quote-service') || 'Custom Development';
      handleQuote(serviceType);
    });
  });
});


// Inject styles into the document
if (document.head) {
  document.head.insertAdjacentHTML('beforeend', modalStyles);
}

// Youtube 
function openPlaylistModal(playlistId) {
  document.getElementById('youtubePlaylist').src = 'https://www.youtube.com/embed/videoseries?list=' + playlistId + '&autoplay=1';
  document.getElementById('playlistModal').style.display = 'flex';
}

function closePlaylistModal() {
  document.getElementById('playlistModal').style.display = 'none';
  document.getElementById('youtubePlaylist').src = '';
}
