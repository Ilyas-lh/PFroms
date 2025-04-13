// formGenerator.js - Simplified version

class FormGenerator {
  constructor(config, containerId) {
      this.config = config;
      this.container = document.getElementById(containerId);
      this.currentPage = null;
      this.formData = {};
  }

  // Generate the entire form structure
  generateForm() {
      console.log('Generating form with config:', this.config);
      const form = document.createElement('form');
      form.id = 'simpleForm';

      // Create all pages
      this.config.pages.forEach(page => {
          const pageDiv = this.createPage(page);
          form.appendChild(pageDiv);
      });

      // Add the form to the container
      this.container.appendChild(form);

      // Register event listeners
      this.setupEventListeners();

      // Show the first page
      this.showPage(this.config.pages[0].id);
  }

  // Create a single page
  createPage(page) {
      console.log('Creating page:', page.id);
      const pageDiv = document.createElement('div');
      pageDiv.id = page.id;
      pageDiv.className = 'form-page';

      // Add title
      const title = document.createElement('h1');
      title.textContent = this.config.title;
      pageDiv.appendChild(title);

      // Add fields if present
      if (page.fields && page.fields.length > 0) {
          page.fields.forEach(field => {
              const fieldElement = this.createField(field);
              pageDiv.appendChild(fieldElement);
          });
      }

      // Add custom content if present
      if (page.content) {
          const contentDiv = document.createElement('div');
          contentDiv.innerHTML = page.content;
          pageDiv.appendChild(contentDiv);
      }

      // Add submit button (except for thank you page)
      if (page.id !== 'thankYouPage') {
          const navDiv = document.createElement('div');
          navDiv.className = 'nav-buttons';
          
          const submitButton = this.createSubmitButton();
          navDiv.appendChild(submitButton);
          
          pageDiv.appendChild(navDiv);
      }

      return pageDiv;
  }

  // Create a form field based on its type
  createField(field) {
      console.log('Creating field:', field.id, 'of type:', field.type);
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'form-group';
      
      // Create label
      const label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;
      fieldDiv.appendChild(label);

      let input;

      switch (field.type) {
          case 'text':
          case 'number':
              input = document.createElement('input');
              input.type = field.type;
              input.id = field.id;
              input.name = field.id;
              if (field.placeholder) input.placeholder = field.placeholder;
              if (field.required) input.required = true;
              fieldDiv.appendChild(input);
              break;
      }

      return fieldDiv;
  }

  createSubmitButton() {
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'submit-button';
      button.innerHTML = `
          Submit
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      `;
      
      return button;
  }

  // Show/hide pages
  showPage(pageId) {
      console.log('Showing page:', pageId);
      const pages = document.querySelectorAll('.form-page');
      pages.forEach(page => {
          page.classList.remove('active');
      });
      
      const pageToShow = document.getElementById(pageId);
      if (pageToShow) {
          pageToShow.classList.add('active');
          this.currentPage = pageId;
      } else {
          console.error('Page not found:', pageId);
      }
  }

  // Form validation
  validatePage(pageId) {
      console.log('Validating page:', pageId);
      const page = document.getElementById(pageId);
      const requiredFields = page.querySelectorAll('[required]');
      let isValid = true;
      
      // Clear any previous error messages
      const existingErrors = page.querySelectorAll('.field-error');
      existingErrors.forEach(err => err.remove());
      
      requiredFields.forEach(field => {
          // Reset border color
          field.style.borderColor = '';
          
          // Check if field has a value
          if (!field.value) {
              isValid = false;
              field.style.borderColor = 'red';
              
              // Add error message below the field
              const errorMsg = document.createElement('div');
              errorMsg.className = 'field-error';
              errorMsg.textContent = 'This field is required';
              errorMsg.style.color = 'red';
              errorMsg.style.fontSize = '0.8rem';
              errorMsg.style.marginTop = '4px';
              
              // Insert error after the field
              field.parentNode.insertBefore(errorMsg, field.nextSibling);
              
              console.log('Field validation failed:', field.id);
          }
      });
      
      console.log('Page validation result:', isValid);
      return isValid;
  }

  // Update form data object with current values
  updateFormData() {
      const form = document.getElementById('simpleForm');
      const formElements = form.elements;
      
      for (let i = 0; i < formElements.length; i++) {
          const element = formElements[i];
          
          if (element.name && element.name !== '' && element.type !== 'submit' && element.type !== 'button') {
              this.formData[element.name] = element.value;
          }
      }
      
      console.log('Updated form data:', this.formData);
  }

  // Set up event listeners
  setupEventListeners() {
      const form = document.getElementById('simpleForm');
      
      // Store instance reference for event handler
      const self = this;
      
      // Form submission
      form.addEventListener('submit', function(e) {
          e.preventDefault();
          console.log('Form submit event triggered');
          
          // Validate the form
          if (!self.validatePage('page1')) {
              console.error('Form validation failed');
              return;
          }
          
          // Update form data
          self.updateFormData();
          
          // Submit to Supabase
          self.submitFormData();
      });
  }
  
  // Show loading state during submission
  showLoading(isLoading) {
      const submitButton = document.querySelector('button[type="submit"]');
      
      if (submitButton) {
          if (isLoading) {
              submitButton.disabled = true;
              submitButton.innerHTML = `
                  <span class="spinner"></span>
                  Submitting...
              `;
          } else {
              submitButton.disabled = false;
              submitButton.innerHTML = `
                  Submit
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              `;
          }
      }
  }
  
  // Submit data to Supabase
  async submitFormData() {
      try {
          // Show loading state
          this.showLoading(true);
          
          console.log('Submitting data to Supabase:', this.formData);
          
          // Check if Supabase client is available
          if (typeof window.supabaseClient === 'undefined') {
              console.error('Supabase client is not defined! Check supabaseClient.js');
              this.showNotification('Database connection error. Check the console.', 'error');
              return;
          }
          
          // Format data for Supabase
          const supabaseData = {
              name: this.formData.name,
              favorite_number: parseInt(this.formData.favoriteNumber)
          };
          
          // Insert data into Supabase
          const { data, error } = await window.supabaseClient
              .from('simple_form')
              .insert([supabaseData]);
          
          if (error) {
              console.error('Supabase insert error:', error);
              this.showNotification('Error saving data: ' + error.message, 'error');
              return;
          }
          
          console.log('Data saved to Supabase successfully:', data);
          
          // Show success message and thank you page
          this.showNotification('Response submitted successfully!', 'success');
          this.showPage('thankYouPage');
          
      } catch (error) {
          console.error('Error saving to Supabase:', error);
          this.showNotification('Error: ' + error.message, 'error');
      } finally {
          // Hide loading state
          this.showLoading(false);
      }
  }
  
  // Show notification message
  showNotification(message, type = 'info') {
      // Create notification element if it doesn't exist
      let notification = document.getElementById('form-notification');
      
      if (!notification) {
          notification = document.createElement('div');
          notification.id = 'form-notification';
          document.body.appendChild(notification);
      }
      
      // Set style based on notification type
      if (type === 'success') {
          notification.style.backgroundColor = '#4CAF50';
      } else if (type === 'error') {
          notification.style.backgroundColor = '#F44336';
      } else {
          notification.style.backgroundColor = '#2196F3';
      }
      
      // Set message and show notification
      notification.textContent = message;
      notification.style.opacity = '1';
      
      // Hide notification after 3 seconds
      setTimeout(() => {
          notification.style.opacity = '0';
          
          // Remove after fade out
          setTimeout(() => {
              notification.remove();
          }, 300); // Match the transition duration
      }, 3000);
  }
  
  // Reset the form
  resetForm() {
      // Reset HTML form element
      document.getElementById('simpleForm').reset();
      
      // Clear form data
      this.formData = {};
      
      // Return to first page
      this.showPage(this.config.pages[0].id);
      
      console.log('Form reset complete');
  }
}

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing form');
  const generator = new FormGenerator(formConfig, 'form-container');
  generator.generateForm();
  
  // Make resetForm accessible globally
  window.resetForm = () => generator.resetForm();
});