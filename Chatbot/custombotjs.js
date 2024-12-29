// chatbot.js

// Replace with your OpenAI API key
const apiKey = "";
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    // Display user message
    appendMessage(userInput, 'user-message');

    // Clear input field
    document.getElementById("user-input").value = "";

    // Send message to OpenAI API
    const response = await getOpenAIResponse(userInput);

    // Display bot response
    appendMessage(response, 'bot-message');
}

function appendMessage(message, className) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.className = className;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getOpenAIResponse(userInput) {
    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",  // You can change the model
                prompt: userInput,
                max_tokens: 100
            })
        });

        // Check if the response status is not OK (status code 200)
        if (!response.ok) {
            // Throw an error with the status code
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Check if data has the expected format
        if (!data.choices || data.choices.length === 0) {
            throw new Error("No choices returned by the API.");
        }

        return data.choices[0].text.trim();
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching OpenAI response:", error);

        // Return a user-friendly error message
        return error.message +"Sorry, there was an error processing your request. Please try again later.";
    }
}

