const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotSend = document.getElementById("chatbot-send");

chatbotToggle.addEventListener("click", () => chatbotContainer.classList.toggle("hidden"));
chatbotClose.addEventListener("click", () => chatbotContainer.classList.add("hidden"));

chatbotSend.addEventListener("click", sendMessage);
chatbotInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add(sender === "user" ? "user-message" : "bot-message");
  msg.textContent = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function sendMessage() {
  const text = chatbotInput.value.trim();
  if (!text) return;
  appendMessage(text, "user");
  chatbotInput.value = "";
  setTimeout(() => botReply(text.toLowerCase()), 600);
}

function chatReply(choice) {
  appendMessage(choice, "user");
  setTimeout(() => botReply(choice.toLowerCase()), 500);
}

function botReply(text) {
  let reply = "";
  if (text.includes("service")) {
    reply = "We offer Chatbot Development, ML Training, AI Consulting, IoT + ML Solutions, and Web Development. Visit the Services section for details.";
  } else if (text.includes("book")) {
    reply = "Sure! You can book a consultation here 👉 [Click to Book](#pricing)";
    window.location.href = "#pricing";
  } else if (text.includes("project")) {
    reply = "We build innovative AI/ML and GenAI projects with mentorship support. Want to see examples? Check our YouTube: https://www.youtube.com/@MENTROID";
  } else if (text.includes("feedback")) {
    reply = "I'd love your feedback! Please fill out the form here: https://formspree.io/f/xeoredjd";
  } else if (text.includes("social")) {
    reply = "Connect with us: 🔗\n- LinkedIn: https://linkedin.com/in/om-roy-3b809628a/\n- Instagram: https://www.instagram.com/mentroid_sol/\n- YouTube: https://www.youtube.com/@MENTROID\n- Facebook: https://www.facebook.com/profile.php?id=61581668020163";
  } else {
    reply = "I'm here to help you explore Mentroid’s services, book sessions, or connect on social platforms!";
  }
  appendMessage(reply, "bot");
}
