const form = document.getElementById('loanForm');
    const messageBox = document.getElementById('messageBox');
    const llmFeatureArea = document.getElementById('llmFeatureArea');
    const getSuggestionButton = document.getElementById('getSuggestionButton');
    const llmOutput = document.getElementById('llmOutput');

    // Configuration for the Gemini API
    const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';
    const API_KEY = ""; // Canvas will automatically provide the key at runtime
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

    // Function to display messages (custom alert/message box)
    function displayMessage(message, isSuccess = true) {
        messageBox.textContent = message;
        messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800', 'bg-yellow-100', 'text-yellow-800');
        if (isSuccess) {
            messageBox.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-400');
        } else {
            messageBox.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-400');
        }
    }

    // Function to get a delay value for exponential backoff
    function getDelay(attempt) {
        // Delay increases exponentially: 2s, 4s, 8s, 16s, etc.
        return Math.pow(2, attempt) * 1000;
    }

    // --- GEMINI API CALL FUNCTION ---
    /**
     * Calls the Gemini API to fetch a personalized suggestion based on application data.
     * Implements exponential backoff for retries.
     * @param {object} applicationData - The financial data of the rejected application.
     */
    async function fetchLlmSuggestion(applicationData) {
        // Show loading state and disable button
        llmOutput.innerHTML = '<div class="mt-4 p-4 text-center bg-gray-100 rounded-xl text-gray-600 font-medium flex items-center justify-center animate-pulse"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating your personalized improvement plan...</div>';
        getSuggestionButton.disabled = true;

        const systemPrompt = "You are an empathetic, professional, and knowledgeable financial advisor. Your goal is to provide a constructive, personalized plan in a maximum of three short paragraphs (max 100 words total) to help an applicant improve their financial standing to secure a loan. Do not mention any specific required numbers or ratios (like 15x income), instead give general advice on the next steps to take.";

        // Construct the detailed user query based on the application data
        const userQuery = `My recent loan application for $${applicationData.loanAmount} was rejected. My annual income is $${applicationData.income} and my credit score is ${applicationData.creditScore}. Provide a constructive, personalized plan to help me secure a loan in the future.`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            // No tools are needed for general financial advice/coaching
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            }
        };

        const MAX_RETRIES = 5;
        let attempt = 0;

        while (attempt < MAX_RETRIES) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    llmOutput.innerHTML = `
                        <div class="mt-4 p-5 bg-white border border-purple-200 rounded-xl shadow-lg">
                            <h3 class="text-lg font-bold text-purple-700 mb-3 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.14-2.052-.42-3.02z"></path></svg>
                                Your Personalized Improvement Plan
                            </h3>
                            <div class="prose max-w-none text-gray-700 leading-relaxed space-y-3">
                                ${text.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                    `;
                    getSuggestionButton.disabled = false;
                    return; // Exit loop on success
                } else {
                    throw new Error("Empty response from LLM.");
                }
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error);
                attempt++;
                if (attempt < MAX_RETRIES) {
                    const delay = getDelay(attempt);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    llmOutput.innerHTML = '<div class="mt-4 p-4 text-center bg-red-100 rounded-xl text-red-800 border border-red-400">⚠️ Failed to generate plan after multiple retries. Please try again later.</div>';
                    getSuggestionButton.disabled = false;
                }
            }
        }
    }


    // --- EVENT LISTENERS ---

    // 1. Form Submission Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous messages and LLM output
        messageBox.textContent = '';
        messageBox.classList.add('hidden');
        llmFeatureArea.classList.add('hidden');
        llmOutput.innerHTML = '';


        // Input validation (basic checks)
        const loanAmount = parseFloat(document.getElementById('loanAmount').value);
        const income = parseFloat(document.getElementById('income').value);
        const creditScore = parseInt(document.getElementById('creditScore').value, 10);
        const employmentStatus = document.getElementById('employmentStatus').value;

        if (isNaN(loanAmount) || isNaN(income) || isNaN(creditScore) || !document.getElementById('name').value || !document.getElementById('email').value || !employmentStatus) {
            displayMessage('Please fill out all fields with valid data.', false);
            return;
        }

        // Prepare the payload for the Spring Boot backend
        const data = {
            loanAmount: loanAmount,
            income: income,
            creditScore: creditScore,
            employmentStatus: employmentStatus,
            applicant: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value
            }
        };

        try {
            const response = await fetch('/api/loan/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Read the JSON response
            const result = await response.json();
            const loanStatus = result.status;

            if (response.ok) {
                // Display success message and status
                displayMessage(`Application Submitted! Status: ${loanStatus}. Check your email for details.`, true);

                // Conditionally enable LLM Feature if not fully approved
                if (loanStatus === 'REJECTED' || loanStatus === 'UNDER_REVIEW') {
                    llmFeatureArea.classList.remove('hidden');
                } else {
                    llmFeatureArea.classList.add('hidden');
                }

            } else {
                // Handle HTTP error statuses (4xx, 5xx)
                const errorMessage = result.message || 'An unknown error occurred during submission.';
                displayMessage(`Error: ${errorMessage}`, false);
            }
        } catch (error) {
            // Handle network errors (e.g., server unreachable)
            console.error('Network or Fetch Error:', error);
            displayMessage('Connection Error: Could not reach the server.', false);
        }
    });

    // 2. LLM Suggestion Button Handler
    getSuggestionButton.addEventListener('click', () => {
        // Get the current financial data from the form fields
        const applicationData = {
            loanAmount: parseFloat(document.getElementById('loanAmount').value),
            income: parseFloat(document.getElementById('income').value),
            creditScore: parseInt(document.getElementById('creditScore').value, 10),
        };

        // Re-validate if financial data is present before calling the API
        if (isNaN(applicationData.loanAmount) || isNaN(applicationData.income) || isNaN(applicationData.creditScore)) {
            llmOutput.innerHTML = '<div class="mt-4 p-4 text-center bg-yellow-100 rounded-xl text-yellow-800 border border-yellow-400">⚠️ Please ensure Loan Amount, Annual Income, and Credit Score are filled out before requesting a plan.</div>';
            return;
        }

        // Call the Gemini API function
        fetchLlmSuggestion(applicationData);
    });