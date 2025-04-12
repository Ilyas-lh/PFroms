// formConfig.js - This defines your entire form structure

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
      ]
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
          // Hide/show fields based on selection
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
        },
      // New field for importing images and videos
        {
          type: "file",
          id: "mediaUpload",
          label: "Importer des Images/Vidéos:",
          accept: "image/*,video/*", // Accepts all image and video formats
          required: false
        }
      ],
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
        // More fields...
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
            // Add more options
          ],
          hidden: true // Hidden by default
        },
        // More fields...
      ]
    },
    {
      id: "thankYouPage",
      title: "Réponse Envoyée",
      content: "<p>Click <a href=\"#\" onclick=\"resetForm()\">ici</a> pour envoyer une autre réponse</p>"
    }
  ]
};
// At the end of your formConfig.js, if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = formConfig;
}