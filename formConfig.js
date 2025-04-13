// formConfig.js - Complete form configuration

const formConfig = {
  title: "Rapport Qualité",
  pages: [
      {
          id: "page1",
          title: "Informations Initiales",
          fields: [
              {
                  type: "text",
                  id: "name",
                  label: "Nom & Prénom:",
                  placeholder: "Entre ton Nom",
                  required: true
              },
              {
                  type: "select",
                  id: "actionType",
                  label: "Type d'Action:",
                  required: true,
                  options: [
                      { value: "", label: "Sélectionner", disabled: true, selected: true },
                      { value: "operation", label: "Opération" },
                      { value: "alerte", label: "Alerte" }
                  ],
                  // This defines the navigation logic
                  navigation: {
                      "operation": "page2-operation",
                      "alerte": "page2-alert"
                  }
              }
          ],
          // Default next page (fallback)
          nextPage: "page2-operation"
      },
      {
          id: "page2-operation",
          title: "Détails d'Opération",
          fields: [
              {
                  type: "select",
                  id: "operationType",
                  label: "Opération:",
                  required: true,
                  options: [
                      { value: "", label: "Sélectionner", disabled: true, selected: true },
                      { value: "stockage", label: "Stockage" },
                      { value: "inspection", label: "Inspection" },
                      { value: "chargement", label: "Chargement" },
                      { value: "transfert", label: "Transfert" },
                      { value: "recyclage", label: "Recyclage" }
                  ],
                  // Conditionals can be used to show/hide fields based on selection
                  conditionals: {
                      "stockage": {
                          show: ["entity", "quality", "hall", "arch"],
                          hide: ["bandType"]
                      },
                      "inspection": {
                          show: ["entity", "quality", "hall"],
                          hide: ["arch", "bandType"]
                      }
                      // Add more conditions as needed
                  }
              }
          ],
          // This page always goes to page3-forms
          nextPage: "page3-forms"
      },
      {
          id: "page2-alert",
          title: "Détails d'Alerte",
          fields: [
              {
                  type: "select",
                  id: "alertType",
                  label: "Alerte:",
                  required: true,
                  options: [
                      { value: "", label: "Sélectionner", disabled: true, selected: true },
                      { value: "arretStockage", label: "Arrêt de Stockage" },
                      { value: "arretChargement", label: "Arrêt de Chargement" }
                  ]
              }
          ],
          // This page always goes to page3-forms
          nextPage: "page3-forms"
      },
      {
          id: "page3-forms",
          title: "Informations Générales",
          fields: [
              {
                  type: "select",
                  id: "entity",
                  label: "Entité:",
                  required: true,
                  options: [
                      { value: "", label: "Sélectionner", disabled: true, selected: true },
                      { value: "107D", label: "107D" },
                      { value: "107E", label: "107E" },
                      { value: "107F", label: "107F" },
                      { value: "JFC5", label: "JFC5" },
                      { value: "OFAS", label: "OFAS" }
                  ]
              },
              {
                  type: "text",
                  id: "quality",
                  label: "Qualité:",
                  placeholder: "Ex: TSP Low N",
                  required: true
              },
              {
                  type: "select",
                  id: "hall",
                  label: "Hall:",
                  required: true,
                  options: [
                      { value: "", label: "Sélectionner", disabled: true, selected: true },
                      { value: "HE03", label: "HE03" },
                      { value: "HE06", label: "HE06" }
                  ]
              },
              {
                  type: "select",
                  id: "arch",
                  label: "Arche:",
                  required: true,
                  options: [
                      { value: "", label: "Sélectionner", disabled: true, selected: true },
                      { value: "A01", label: "A01" },
                      { value: "A02", label: "A02" }
                  ]
              },
              {
                  type: "number",
                  id: "quantity",
                  label: "Quantité (T):",
                  required: true
              },
              {
                  type: "radio",
                  id: "qualityIncident",
                  label: "Incident Qualité:",
                  options: [
                      { value: "oui", label: "Oui" },
                      { value: "non", label: "Non" }
                  ],
                  conditionals: {
                      "oui": {
                          show: ["incidentTypes"]
                      },
                      "non": {
                          hide: ["incidentTypes"]
                      }
                  }
              },
              {
                  type: "checkbox-group",
                  id: "incidentTypes",
                  label: "Type d'Incident Qualité:",
                  options: [
                      { id: "colorChange", value: "colorChange", label: "Changement de Couleur" },
                      { id: "dust", value: "dust", label: "Présence de Poussière" },
                      { id: "powder", value: "powder", label: "Présence de Poudre" },
                      { id: "lumps", value: "lumps", label: "Présence de Grumeaux" }
                  ],
                  hidden: true // Hidden by default
              },
              {
                  type: "number",
                  id: "productTemp",
                  label: "Température Produit (°C):",
                  required: true
              },
              {
                  type: "number",
                  id: "ambientTemp",
                  label: "Température Ambiante (°C):",
                  required: true
              },
              {
                  type: "number",
                  id: "humidity",
                  label: "Humidité Ambiante (%):",
                  required: true
              },
              {
                  type: "file",
                  id: "fileUpload",
                  label: "Images/Videos:",
                  accept: "image/*,video/*",
                  multiple: true,
                  description: "Ajoutez des photos ou vidéos du produit (max 5 fichiers, 5MB par fichier)"
              },
              {
                  type: "textarea",
                  id: "comment",
                  label: "Commentaire:"
              },
              {
                  type: "time",
                  id: "time",
                  label: "Time:",
                  required: true
              }
          ],
          // This is the last form page, so next is the thank you page
          nextPage: "thankYouPage"
      },
      {
          id: "thankYouPage",
          title: "Réponse Envoyée",
          content: "<p>Votre rapport a été envoyé avec succès!</p><p>Click <a href=\"#\" onclick=\"resetForm()\">ici</a> pour envoyer une autre réponse</p>"
      }
  ]
};

// Make formConfig available globally
window.formConfig = formConfig;