// formConfig.js - Simplified form configuration

const formConfig = {
    title: "Simple Form",
    pages: [
        {
            id: "page1",
            title: "Basic Information",
            fields: [
                {
                    type: "text",
                    id: "name",
                    label: "Your Name:",
                    placeholder: "Enter your name",
                    required: true
                },
                {
                    type: "number",
                    id: "favoriteNumber",
                    label: "Your Favorite Number:",
                    required: true
                }
            ],
            nextPage: "thankYouPage"
        },
        {
            id: "thankYouPage",
            title: "Response Submitted",
            content: "<p>Your response has been sent successfully!</p><p>Click <a href=\"#\" onclick=\"resetForm()\">here</a> to submit another response</p>"
        }
    ]
  };
  
  // Make formConfig available globally
  window.formConfig = formConfig;