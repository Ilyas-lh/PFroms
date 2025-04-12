// formGenerator.js - This will build the form from the configuration
document.addEventListener('DOMContentLoaded', () => {
  const generator = new FormGenerator(formConfig, 'form-container');
  generator.generateForm();
  
  // Make resetForm accessible globally
  window.resetForm = () => generator.resetForm();
});


class FormGenerator {
  constructor(config, containerId) {
    this.config = config;
    this.container = document.getElementById(containerId);
    this.currentPage = null;
    this.formData = {};
    this.conditionalFields = {};
  }

  // Generate the entire form structure
  generateForm() {
    const form = document.createElement('form');
    form.id = 'qualityForm';

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

    // Add navigation buttons (except for thank you page)
    if (page.id !== 'thankYouPage') {
      const navDiv = document.createElement('div');
      navDiv.className = 'nav-buttons';

      // Only add back button if not the first page
      if (page.id !== this.config.pages[0].id) {
        const backButton = this.createBackButton(page.id);
        navDiv.appendChild(backButton);
      } else {
        // Empty div for spacing on first page
        const spacer = document.createElement('div');
        navDiv.appendChild(spacer);
      }

      // Add next/submit button
      if (page.id === 'page3-forms') {
        // Last form page - add submit button
        const submitButton = this.createSubmitButton();
        navDiv.appendChild(submitButton);
      } else {
        // Add next button
        const nextButton = this.createNextButton(page);
        navDiv.appendChild(nextButton);
      }

      pageDiv.appendChild(navDiv);
    }

    return pageDiv;
  }

  // Create a form field based on its type
  createField(field) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'form-group';
    if (field.hidden) {
      fieldDiv.style.display = 'none';
    }

    // Add this to track conditional fields
    if (field.conditionals) {
      this.conditionalFields[field.id] = field.conditionals;
    }

    // Create label (for most field types)
    if (field.type !== 'checkbox-group' && field.type !== 'radio') {
      const label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;
      fieldDiv.appendChild(label);
    }

    let input;

    switch (field.type) {
      case 'text':
      case 'number':
      case 'time':
        input = document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.name = field.id;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.required) input.required = true;
        fieldDiv.appendChild(input);
        break;

      case 'select':
        input = document.createElement('select');
        input.id = field.id;
        input.name = field.id;
        if (field.required) input.required = true;

        field.options.forEach(option => {
          const optionEl = document.createElement('option');
          optionEl.value = option.value;
          optionEl.textContent = option.label;
          if (option.disabled) optionEl.disabled = true;
          if (option.selected) optionEl.selected = true;
          input.appendChild(optionEl);
        });

        fieldDiv.appendChild(input);
        break;

      case 'radio':
        // Add label for the group
        const groupLabel = document.createElement('label');
        groupLabel.textContent = field.label;
        fieldDiv.appendChild(groupLabel);

        field.options.forEach(option => {
          const optionDiv = document.createElement('div');
          
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.id = `${field.id}-${option.value}`;
          radio.name = field.id;
          radio.value = option.value;
          
          const optionLabel = document.createElement('label');
          optionLabel.setAttribute('for', `${field.id}-${option.value}`);
          optionLabel.style.display = 'inline';
          optionLabel.textContent = option.label;
          
          optionDiv.appendChild(radio);
          optionDiv.appendChild(optionLabel);
          fieldDiv.appendChild(optionDiv);
        });
        break;

      case 'checkbox-group':
        // Add label for the group
        const checkGroupLabel = document.createElement('label');
        checkGroupLabel.textContent = field.label;
        fieldDiv.appendChild(checkGroupLabel);

        field.options.forEach(option => {
          const optionDiv = document.createElement('div');
          
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = option.id;
          checkbox.name = field.id;
          checkbox.value = option.value;
          
          const optionLabel = document.createElement('label');
          optionLabel.setAttribute('for', option.id);
          optionLabel.style.display = 'inline';
          optionLabel.textContent = option.label;
          
          optionDiv.appendChild(checkbox);
          optionDiv.appendChild(optionLabel);
          fieldDiv.appendChild(optionDiv);
        });
        break;

      case 'textarea':
        input = document.createElement('textarea');
        input.id = field.id;
        input.name = field.id;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.required) input.required = true;
        fieldDiv.appendChild(input);
        break;

      case 'file':
        input = document.createElement('input');
        input.type = 'file';
        input.id = field.id;
        input.name = field.id;
        if (field.accept) input.accept = field.accept;
        if (field.multiple) input.multiple = true;
        fieldDiv.appendChild(input);
        break;
    }

    return fieldDiv;
  }

  createBackButton(pageId) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'back-button';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
      Retour
    `;
    button.onclick = () => this.navigateBack(pageId);
    return button;
  }

  createNextButton(page) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `
      Suivant
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
    `;
    
    button.onclick = () => this.navigateNext(page);
    return button;
  }

  createSubmitButton() {
    const button = document.createElement('button');
    button.type = 'submit';
    button.innerHTML = `
      Envoyer
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
    `;
    return button;
  }

  // Navigation methods
  showPage(pageId) {
    const pages = document.querySelectorAll('.form-page');
    pages.forEach(page => {
      page.classList.remove('active');
    });
    
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
      pageToShow.classList.add('active');
      this.currentPage = pageId;
    }
  }

  navigateNext(page) {
    // Validate required fields
    if (!this.validatePage(page.id)) {
      return;
    }

    // Update formData with current values
    this.updateFormData();

    // Determine next page based on navigation rules
    let nextPageId = page.nextPage;

    // Check if there's a field with navigation logic
    page.fields.forEach(field => {
      if (field.navigation && this.formData[field.id]) {
        const value = this.formData[field.id];
        if (field.navigation[value]) {
          nextPageId = field.navigation[value];
        }
      }
    });

    if (nextPageId) {
      this.showPage(nextPageId);
    }
  }

  navigateBack(currentPageId) {
    // Find the previous page in the flow
    const currentIndex = this.config.pages.findIndex(page => page.id === currentPageId);
    if (currentIndex > 0) {
      this.showPage(this.config.pages[currentIndex - 1].id);
    }
  }

  // Form validation
  validatePage(pageId) {
    const page = document.getElementById(pageId);
    const requiredFields = page.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value) {
        isValid = false;
        field.style.borderColor = 'red';
      } else {
        field.style.borderColor = '';
      }
    });
    
    return isValid;
  }

  // Update form data object with current values
  updateFormData() {
    const form = document.getElementById('qualityForm');
    const formElements = form.elements;
    
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      
      if (element.name && element.name !== '' && element.type !== 'submit' && element.type !== 'button') {
        if (element.type === 'checkbox') {
          if (!this.formData[element.name]) {
            this.formData[element.name] = [];
          }
          
          if (element.checked && !this.formData[element.name].includes(element.value)) {
            this.formData[element.name].push(element.value);
          } else if (!element.checked && this.formData[element.name].includes(element.value)) {
            this.formData[element.name] = this.formData[element.name].filter(val => val !== element.value);
          }
        } else if (element.type === 'radio') {
          if (element.checked) {
            this.formData[element.name] = element.value;
          }
        } else {
          this.formData[element.name] = element.value;
        }
        
        // Apply conditional logic
        this.applyConditionalLogic(element.name);
      }
    }
  }

  // Apply conditional logic (show/hide fields)
  applyConditionalLogic(fieldName) {
    if (this.conditionalFields[fieldName] && this.formData[fieldName]) {
      const value = this.formData[fieldName];
      const rules = this.conditionalFields[fieldName][value];
      
      if (rules) {
        if (rules.show) {
          rules.show.forEach(id => {
            const element = document.getElementById(id) || 
                           document.querySelector(`[name="${id}"]`).closest('.form-group');
            if (element) {
              element.closest('.form-group').style.display = 'block';
            }
          });
        }
        
        if (rules.hide) {
          rules.hide.forEach(id => {
            const element = document.getElementById(id) || 
                           document.querySelector(`[name="${id}"]`).closest('.form-group');
            if (element) {
              element.closest('.form-group').style.display = 'none';
            }
          });
        }
      }
    }
  }

  // Set up event listeners
  setupEventListeners() {
    const form = document.getElementById('qualityForm');
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.updateFormData();
      
      // Here you would send the data to a server
      console.log('Form data:', this.formData);
      
      // Show thank you page
      this.showPage('thankYouPage');
    });

    // Track changes for conditional logic
    form.addEventListener('change', (e) => {
      if (e.target.name) {
        // Update the data and apply conditionals
        this.updateFormData();
      }
    });
  }

  // Reset the form
  resetForm() {
    document.getElementById('qualityForm').reset();
    this.formData = {};
    this.showPage(this.config.pages[0].id);
    
    // Reset any conditionally shown/hidden fields
    document.querySelectorAll('.form-group').forEach(group => {
      // Check if this element should be hidden by default
      const fieldId = group.querySelector('[name]')?.name;
      const field = this.config.pages
        .flatMap(page => page.fields || [])
        .find(f => f.id === fieldId);
      
      if (field && field.hidden) {
        group.style.display = 'none';
      } else {
        group.style.display = 'block';
      }
    });
  }
  async submitFormData(formData) {
    try {
        // Format data for Supabase
        const supabaseData = this.formatDataForSupabase(formData);
        
        // Show loading state
        this.showLoading(true);
        
        // Handle file uploads first (if any)
        let filePaths = [];
        if (formData.fileUpload && formData.fileUpload.length > 0) {
            filePaths = await this.uploadFilesToSupabase(formData.fileUpload);
        }
        
        // Add file paths to the data
        if (filePaths.length > 0) {
            supabaseData.file_paths = filePaths;
        }
        
        // Insert data into Supabase
        const { data, error } = await supabase
            .from('quality_reports')
            .insert([supabaseData]);
        
        if (error) throw error;
        
        console.log('Data saved to Supabase:', data);
        
        // Show success message
        this.showNotification('Rapport enregistré avec succès!', 'success');
        
        return data;
    } catch (error) {
        console.error('Error saving to Supabase:', error);
        
        // Show error message
        this.showNotification('Erreur lors de l\'enregistrement du rapport. Veuillez réessayer.', 'error');
        
        throw error;
    } finally {
        // Hide loading state
        this.showLoading(false);
    }
}

// Format form data for Supabase schema
formatDataForSupabase(formData) {
    return {
        // Personal info
        name: formData.name,
        
        // Main form data
        action_type: formData.actionType,
        operation_type: formData.operationType || null,
        alert_type: formData.alertType || null,
        entity: formData.entity,
        quality: formData.quality,
        hall: formData.hall,
        arch: formData.arch,
        quantity: parseFloat(formData.quantity),
        
        // Incident details
        quality_incident: formData.qualityIncident === 'oui',
        incident_types: Array.isArray(formData.incidentTypes) ? formData.incidentTypes : [],
        
        // Environmental measurements
        product_temp: parseFloat(formData.productTemp),
        ambient_temp: parseFloat(formData.ambientTemp),
        humidity: parseFloat(formData.humidity),
        
        // Additional info
        comment: formData.comment || '',
        time_recorded: formData.time
    };
}

// Upload files to Supabase Storage
async uploadFilesToSupabase(files) {
    const filePaths = [];
    
    // Create a folder with timestamp to group files from one submission
    const folderName = `quality-reports/${Date.now()}`;
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${i + 1}-${Date.now()}.${fileExt}`;
        const filePath = `${folderName}/${fileName}`;
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from('form-uploads') // Create this bucket in Supabase Storage
            .upload(filePath, file);
            
        if (error) {
            console.error('Error uploading file:', error);
            continue;
        }
        
        filePaths.push(filePath);
    }
    
    return filePaths;
}

// Show/hide loading indicator
showLoading(isLoading) {
    // You can implement a loading spinner here
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (submitButton) {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner"></span>
                Envoi en cours...
            `;
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = `
                Envoyer
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            `;
        }
    }
}

// Show notification message
showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('form-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'form-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '1000';
        notification.style.transition = 'opacity 0.3s ease-in-out';
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
    }, 3000);
}

// Update your setupEventListeners method to use the Supabase submission
setupEventListeners() {
    const form = document.getElementById('qualityForm');
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.updateFormData();
        
        try {
            // Submit to Supabase
            await this.submitFormData(this.formData);
            
            // Show thank you page on success
            this.showPage('thankYouPage');
        } catch (error) {
            // Error is already handled in submitFormData
            console.error('Form submission failed:', error);
        }
    });

    // Other event listeners...
}
}

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
  const generator = new FormGenerator(formConfig, 'form-container');
  generator.generateForm();
  
  // Make resetForm accessible globally
  window.resetForm = () => generator.resetForm();});

