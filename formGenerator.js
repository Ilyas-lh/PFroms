// formGenerator.js - Completely rewritten with fixes for navigation and form submission issues

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
      console.log('Generating form with config:', this.config);
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
      console.log('Creating field:', field.id, 'of type:', field.type);
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
              // Create a main container for the file upload component
              const fileContainer = document.createElement('div');
              fileContainer.className = 'file-upload-container';
              
              // Create the actual file input element
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.id = field.id;
              fileInput.name = field.id;
              fileInput.className = 'file-input';
              
              // Set attributes based on field configuration
              if (field.accept) fileInput.accept = field.accept;
              if (field.multiple) fileInput.multiple = true;
              
              // Create a custom styled button that triggers the file input
              const customButton = document.createElement('label');
              customButton.htmlFor = field.id;
              customButton.className = 'custom-file-upload';
              customButton.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Sélectionner des fichiers
              `;
              
              // Add descriptive text if provided
              let description = null;
              if (field.description) {
                  description = document.createElement('small');
                  description.className = 'file-description';
                  description.textContent = field.description;
              }
              
              // Create container for previews
              const previewContainer = document.createElement('div');
              previewContainer.className = 'file-preview-container';
              
              // Handle file selection
              fileInput.addEventListener('change', function(e) {
                  // Clear existing previews
                  previewContainer.innerHTML = '';
                  
                  // Get selected files as array
                  const files = Array.from(this.files);
                  console.log(`Selected ${files.length} files:`, files.map(f => f.name));
                  
                  // Limit previews to first 5 files
                  const filesToPreview = files.slice(0, 5);
                  
                  // Create preview for each file
                  filesToPreview.forEach(file => {
                      // Create preview container
                      const previewItem = document.createElement('div');
                      previewItem.className = 'preview-item';
                      
                      // Handle different file types
                      if (file.type.startsWith('image/')) {
                          // For images, show actual preview
                          const img = document.createElement('img');
                          img.className = 'file-preview';
                          previewItem.appendChild(img);
                          
                          // Read file and set as image source
                          const reader = new FileReader();
                          reader.onload = function(e) {
                              img.src = e.target.result;
                          };
                          reader.readAsDataURL(file);
                      } else if (file.type.startsWith('video/')) {
                          // For videos, show an icon
                          previewItem.innerHTML = `
                              <div class="video-preview">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                  </svg>
                                  <span>${file.name.substring(0, 15)}${file.name.length > 15 ? '...' : ''}</span>
                              </div>
                          `;
                      }
                      
                      // Add file info
                      const fileInfo = document.createElement('div');
                      fileInfo.className = 'file-info';
                      fileInfo.textContent = `${file.name.substring(0, 15)}${file.name.length > 15 ? '...' : ''} (${formatFileSize(file.size)})`;
                      previewItem.appendChild(fileInfo);
                      
                      // Add remove button
                      const removeBtn = document.createElement('button');
                      removeBtn.type = 'button';
                      removeBtn.className = 'remove-file';
                      removeBtn.innerHTML = '&times;';
                      removeBtn.addEventListener('click', function(evt) {
                          evt.preventDefault();
                          
                          // We need to handle file removal in a browser-compatible way
                          try {
                              // Create a new FileList without this file
                              const newFileList = Array.from(fileInput.files)
                                  .filter(f => f !== file);
                              
                              // Create a new DataTransfer object
                              const dataTransfer = new DataTransfer();
                              
                              // Add remaining files to it
                              newFileList.forEach(f => dataTransfer.items.add(f));
                              
                              // Set the new FileList to the input
                              fileInput.files = dataTransfer.files;
                              
                              // Remove preview item
                              previewItem.remove();
                              
                              // Log file removal
                              console.log('File removed, remaining:', fileInput.files.length);
                          } catch (err) {
                              console.error('Error removing file:', err);
                              alert('Erreur lors de la suppression du fichier. Veuillez réessayer.');
                          }
                      });
                      previewItem.appendChild(removeBtn);
                      
                      // Add preview to container
                      previewContainer.appendChild(previewItem);
                  });
                  
                  // If there are more files than previews shown
                  if (files.length > 5) {
                      const moreInfo = document.createElement('div');
                      moreInfo.className = 'more-files-info';
                      moreInfo.textContent = `+ ${files.length - 5} fichiers supplémentaires`;
                      previewContainer.appendChild(moreInfo);
                  }
              });
              
              // Create a clear all button if multiple files allowed
              if (field.multiple) {
                  const clearAllBtn = document.createElement('button');
                  clearAllBtn.type = 'button';
                  clearAllBtn.className = 'clear-all-files';
                  clearAllBtn.textContent = 'Effacer tout';
                  
                  clearAllBtn.addEventListener('click', function() {
                      // Clear the file input
                      fileInput.value = '';
                      
                      // Clear previews
                      previewContainer.innerHTML = '';
                      
                      console.log('All files cleared');
                  });
                  
                  // Add buttons to container
                  fileContainer.appendChild(fileInput);
                  fileContainer.appendChild(customButton);
                  fileContainer.appendChild(clearAllBtn);
              } else {
                  // Add elements to the container (without clear all button)
                  fileContainer.appendChild(fileInput);
                  fileContainer.appendChild(customButton);
              }
              
              // Add description and preview container
              if (description) fileContainer.appendChild(description);
              fileContainer.appendChild(previewContainer);
              
              // Helper function to format file size
              function formatFileSize(bytes) {
                  if (bytes < 1024) return bytes + ' B';
                  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
                  else return (bytes / 1048576).toFixed(1) + ' MB';
              }
              
              fieldDiv.appendChild(fileContainer);
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
      
      // Store instance reference for event handler
      const self = this;
      
      button.addEventListener('click', function() {
          console.log('Back button clicked on page:', pageId);
          self.navigateBack(pageId);
      });
      
      return button;
  }

  createNextButton(page) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'next-button';
      button.innerHTML = `
          Suivant
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      `;
      
      // Store instance reference for event handler
      const self = this;
      
      // Use safer approach to event binding
      button.addEventListener('click', function() {
          console.log('Next button clicked for page:', page.id);
          self.navigateNext(page);
      });
      
      return button;
  }

  createSubmitButton() {
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      
      // Regular submit button
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'submit-button';
      button.innerHTML = `
          Envoyer
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      `;
      
      // Debug button (helps test form submission)
      const debugButton = document.createElement('button');
      debugButton.type = 'button';
      debugButton.className = 'debug-button';
      debugButton.textContent = 'Debug/Export';
      
      // Store reference to this
      const self = this;
      
      // Add click handler to debug button
      debugButton.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('Debug button clicked - downloading form data');
          
          // Update form data
          self.updateFormData();
          
          // Download data as JSON file
          self.downloadFormData();
      });
      
      // Add buttons to container
      buttonContainer.appendChild(button);
      buttonContainer.appendChild(debugButton);
      
      return buttonContainer;
  }

  // Navigation methods
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

  navigateNext(page) {
      // Log for debugging
      console.log('Attempting to navigate from page:', page.id);
      
      // Validate required fields
      if (!this.validatePage(page.id)) {
          console.log('Validation failed for page:', page.id);
          return;
      }

      // Update formData with current values
      this.updateFormData();
      
      // Determine next page based on navigation rules
      let nextPageId = page.nextPage;
      
      // Check if there's a field with navigation logic
      if (page.fields) {
          page.fields.forEach(field => {
              if (field.navigation && this.formData[field.id]) {
                  const value = this.formData[field.id];
                  console.log(`Field ${field.id} has value:`, value);
                  
                  if (field.navigation[value]) {
                      nextPageId = field.navigation[value];
                      console.log(`Navigation to: ${nextPageId}`);
                  }
              }
          });
      }
      
      if (nextPageId) {
          console.log('Navigating to page:', nextPageId);
          this.showPage(nextPageId);
      } else {
          console.error('No next page defined for:', page.id);
      }
  }

  navigateBack(currentPageId) {
      // Find the previous page in the flow
      const currentIndex = this.config.pages.findIndex(page => page.id === currentPageId);
      console.log('Current page index:', currentIndex);
      
      if (currentIndex > 0) {
          const prevPageId = this.config.pages[currentIndex - 1].id;
          console.log('Navigating back to:', prevPageId);
          this.showPage(prevPageId);
      } else {
          console.error('No previous page found for:', currentPageId);
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
              errorMsg.textContent = 'Ce champ est obligatoire';
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
              } else if (element.type === 'file') {
                  // For file inputs, store the FileList object
                  if (element.files && element.files.length > 0) {
                      this.formData[element.name] = element.files;
                  } else {
                      // If no files selected, set to empty array or null
                      this.formData[element.name] = [];
                  }
              } else {
                  this.formData[element.name] = element.value;
              }
              
              // Apply conditional logic
              this.applyConditionalLogic(element.name);
          }
      }
      
      console.log('Updated form data:', this.formData);
  }

  // Apply conditional logic (show/hide fields)
  applyConditionalLogic(fieldName) {
      if (this.conditionalFields[fieldName] && this.formData[fieldName]) {
          const value = this.formData[fieldName];
          const rules = this.conditionalFields[fieldName][value];
          
          if (rules) {
              console.log(`Applying conditionals for ${fieldName}=${value}:`, rules);
              
              if (rules.show) {
                  rules.show.forEach(id => {
                      const element = document.getElementById(id) || 
                                     document.querySelector(`[name="${id}"]`)?.closest('.form-group');
                      if (element) {
                          const container = element.closest('.form-group');
                          if (container) {
                              container.style.display = 'block';
                              console.log(`Showing field: ${id}`);
                          }
                      } else {
                          console.warn(`Field not found for show rule: ${id}`);
                      }
                  });
              }
              
              if (rules.hide) {
                  rules.hide.forEach(id => {
                      const element = document.getElementById(id) || 
                                     document.querySelector(`[name="${id}"]`)?.closest('.form-group');
                      if (element) {
                          const container = element.closest('.form-group');
                          if (container) {
                              container.style.display = 'none';
                              console.log(`Hiding field: ${id}`);
                          }
                      } else {
                          console.warn(`Field not found for hide rule: ${id}`);
                      }
                  });
              }
          }
      }
  }

  // Set up event listeners
  setupEventListeners() {
      const form = document.getElementById('qualityForm');
      
      // Store instance reference for event handler
      const self = this;
      
      // Form submission - using both submit event and direct button click
      form.addEventListener('submit', function(e) {
          e.preventDefault();
          console.log('Form submit event triggered');
          self.handleFormSubmission();
      });
      
      // Also add direct click handler to the submit button as a fallback
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
          submitButton.addEventListener('click', function(e) {
              e.preventDefault();
              console.log('Submit button clicked directly');
              self.handleFormSubmission();
          });
      } else {
          console.error('Submit button not found!');
      }

      // Track changes for conditional logic
      form.addEventListener('change', function(e) {
          if (e.target.name) {
              // Update the data for the changed field
              self.updateFormData();
          }
      });
  }
  
  // Handle form submission
  async handleFormSubmission() {
      console.log('Handling form submission');
      
      // Update form data
      this.updateFormData();
      
      // Validate final page
      if (!this.validatePage('page3-forms')) {
          console.error('Final page validation failed');
          this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
          return;
      }
      
      // Debug output of form data to verify 
      console.log('Complete form data to be submitted:', this.formData);
      
      try {
          // First test if Supabase is available
          if (typeof supabase === 'undefined') {
              console.error('Supabase client is not defined! Check supabaseClient.js');
              this.showNotification('Erreur de connexion à la base de données. Vérifiez la console.', 'error');
              
              // Debug fallback - download data as JSON
              this.downloadFormData();
              return;
          }
          
          // Try a simple Supabase call to test the connection
          try {
              const { data, error } = await supabase.from('quality_reports').select('count').limit(1);
              if (error) {
                  console.error('Supabase connection test failed:', error);
                  this.showNotification('Erreur de connexion à Supabase. Vérifiez la configuration.', 'error');
                  this.downloadFormData();
                  return;
              }
              console.log('Supabase connection test succeeded');
          } catch (connError) {
              console.error('Supabase connection exception:', connError);
              this.showNotification('Erreur lors de la connexion à Supabase', 'error');
              this.downloadFormData();
              return;
          }
          
          // Proceed with normal submission
          await this.submitFormData(this.formData);
          
          // Show thank you page on success
          this.showPage('thankYouPage');
      } catch (error) {
          console.error('Form submission process failed:', error);
          this.showNotification('Erreur lors de l\'envoi du formulaire. Vérifiez la console.', 'error');
          
          // Fallback - download the form data
          this.downloadFormData();
      }
  }
  
  // Submit form data to Supabase
  async submitFormData(formData) {
      try {
          console.log('Starting submitFormData process');
          
          // Format data for Supabase
          const supabaseData = this.formatDataForSupabase(formData);
          
          // Show loading state
          this.showLoading(true);
          
          // Handle file uploads first (if any)
          let fileUploads = [];
          if (formData.fileUpload && formData.fileUpload.length > 0) {
              console.log('Uploading files...');
              try {
                  fileUploads = await this.uploadFilesToSupabase(formData.fileUpload);
                  console.log('File uploads completed:', fileUploads);
              } catch (fileError) {
                  console.error('File upload error:', fileError);
                  this.showNotification('Erreur lors du téléchargement des fichiers, mais nous continuons la soumission du formulaire', 'error');
              }
          }
          
          // Add file data to the record
          if (fileUploads.length > 0) {
              supabaseData.file_uploads = fileUploads;
          }
          
          console.log('Submitting data to Supabase:', supabaseData);
          
          // Insert data into Supabase
          const { data, error } = await supabase
              .from('quality_reports')
              .insert([supabaseData]);
          
          if (error) {
              console.error('Supabase insert error:', error);
              throw error;
          }
          
          console.log('Data saved to Supabase successfully:', data);
          
          // Show success message
          this.showNotification('Rapport enregistré avec succès!', 'success');
          
          return data;
      } catch (error) {
          console.error('Error saving to Supabase:', error);
          
          // Show error message
          this.showNotification('Erreur lors de l\'enregistrement du rapport: ' + error.message, 'error');
          
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
          quantity: parseFloat(formData.quantity) || 0,
          
          // Incident details
          quality_incident: formData.qualityIncident === 'oui',
          incident_types: Array.isArray(formData.incidentTypes) ? formData.incidentTypes : [],
          
          // Environmental measurements
          product_temp: parseFloat(formData.productTemp) || 0,
          ambient_temp: parseFloat(formData.ambientTemp) || 0,
          humidity: parseFloat(formData.humidity) || 0,
          
          // Additional info
          comment: formData.comment || '',
          time_recorded: formData.time
      };
  }
  
  // Upload files to Supabase Storage
  async uploadFilesToSupabase(fileList) {
      if (!fileList || fileList.length === 0) {
          return [];
      }

      const filePaths = [];
      const files = Array.from(fileList);
      
      // Create a unique folder for this submission
      const timestamp = Date.now();
      const folderName = `quality-reports/${timestamp}`;
      
      // Show upload progress
      this.showUploadProgress(true);
      let uploadedCount = 0;
      
      try {
          // Process each file
          for (const file of files) {
              // Validate file
              if (!this.validateFile(file)) {
                  continue; // Skip invalid files
              }
              
              // Create a unique filename
              const fileExt = file.name.split('.').pop().toLowerCase();
              const fileName = `${uploadedCount + 1}-${timestamp}-${this.generateRandomString(8)}.${fileExt}`;
              const filePath = `${folderName}/${fileName}`;
              
              // Update progress
              this.updateUploadProgress(uploadedCount, files.length);
              
              try {
                  // Upload to Supabase Storage
                  const { data, error } = await supabase.storage
                      .from('form-uploads') // Make sure this bucket exists
                      .upload(filePath, file, {
                          cacheControl: '3600',
                          upsert: false
                      });
                  
                  if (error) {
                      console.error('Error uploading file:', file.name, error);
                      this.showNotification(`Erreur lors du téléchargement de ${file.name}`, 'error');
                      continue;
                  }
                  
                  // Get the public URL
                  const { data: urlData } = supabase.storage
                      .from('form-uploads')
                      .getPublicUrl(filePath);
                  
                  // Add file metadata to the paths array
                  filePaths.push({
                      path: filePath,
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      url: urlData?.publicUrl || null
                  });
                  
                  uploadedCount++;
              } catch (e) {
                  console.error('Exception during upload:', e);
              }
          }
          
          // Finalize progress
          this.updateUploadProgress(files.length, files.length);
          
          return filePaths;
      } catch (error) {
          console.error('Error in batch upload:', error);
          this.showNotification('Erreur lors du téléchargement des fichiers', 'error');
          throw error;
      } finally {
          // Hide progress
          this.showUploadProgress(false);
      }
  }
  
  // Validate file before upload
  validateFile(file) {
      try {
          // Check file size (5MB limit)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
              this.showNotification(`Le fichier ${file.name} est trop volumineux (max 5MB)`, 'error');
              return false;
          }
          
          // Check file type
          const allowedTypes = [
              'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
              'video/mp4', 'video/quicktime', 'video/x-msvideo'
          ];
          
          if (!allowedTypes.includes(file.type)) {
              this.showNotification(`Type de fichier non supporté: ${file.name}`, 'error');
              return false;
          }
          
          return true;
      } catch (error) {
          console.error('File validation error:', error);
          return false;
      }
  }
  
  // Generate a random string (for unique filenames)
  generateRandomString(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
  }
  
  // Show/hide loading state
  showLoading(isLoading) {
      // Find or create submit button
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
  
  // Show/hide upload progress
  showUploadProgress(isVisible) {
      // Remove any existing progress bar
      const existingProgress = document.getElementById('upload-progress-container');
      if (existingProgress) {
          existingProgress.remove();
      }
      
      // Also remove overlay if it exists
      const existingOverlay = document.querySelector('.upload-overlay');
      if (existingOverlay) {
          existingOverlay.remove();
      }
      
      if (!isVisible) return;
      
      // Create overlay to prevent interaction
      const overlay = document.createElement('div');
      overlay.className = 'upload-overlay';
      document.body.appendChild(overlay);
      
      // Create progress container
      const progressContainer = document.createElement('div');
      progressContainer.id = 'upload-progress-container';
      
      // Add title
      const title = document.createElement('h3');
      title.textContent = 'Téléchargement des fichiers';
      progressContainer.appendChild(title);
      
      // Add progress bar
      const progressBar = document.createElement('div');
      progressBar.className = 'upload-progress-bar';
      
      const progressFill = document.createElement('div');
      progressFill.id = 'upload-progress-fill';
      
      progressBar.appendChild(progressFill);
      progressContainer.appendChild(progressBar);
      
      // Add status text
      const statusText = document.createElement('p');
      statusText.id = 'upload-status-text';
      statusText.textContent = 'Téléchargement: 0/0 fichiers';
      progressContainer.appendChild(statusText);
      
      // Add to body
      document.body.appendChild(progressContainer);
  }
  
  // Update upload progress
  updateUploadProgress(current, total) {
      const progressFill = document.getElementById('upload-progress-fill');
      const statusText = document.getElementById('upload-status-text');
      
      if (progressFill && statusText) {
          const percent = Math.round((current / total) * 100);
          progressFill.style.width = `${percent}%`;
          statusText.textContent = `Téléchargement: ${current}/${total} fichiers`;
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
  
  // Fallback method to download form data as JSON
  downloadFormData() {
      try {
          // Convert form data to JSON
          const formDataJson = JSON.stringify(this.formData, null, 2);
          
          // Create blob and download link
          const blob = new Blob([formDataJson], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `quality-report-${new Date().toISOString().slice(0, 10)}.json`;
          
          // Append to body, click and remove
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          this.showNotification('Les données du formulaire ont été téléchargées en tant que fichier JSON', 'info');
      } catch (error) {
          console.error('Failed to download form data:', error);
      }
  }
  
  // Reset the form
  resetForm() {
      // Reset HTML form element
      document.getElementById('qualityForm').reset();
      
      // Clear form data
      this.formData = {};
      
      // Return to first page
      this.showPage(this.config.pages[0].id);
      
      // Reset any conditionally shown/hidden fields
      document.querySelectorAll('.form-group').forEach(group => {
          // Get field ID
          const input = group.querySelector('input, select, textarea');
          let fieldId = input ? (input.name || input.id) : null;
          
          if (fieldId) {
              // Find field config
              const field = this.config.pages
                  .flatMap(page => page.fields || [])
                  .find(f => f.id === fieldId);
              
              // Apply default visibility
              if (field && field.hidden) {
                  group.style.display = 'none';
              } else {
                  group.style.display = 'block';
              }
          }
      });
      
      // Clear file previews
      document.querySelectorAll('.file-preview-container').forEach(container => {
          container.innerHTML = '';
      });
      
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