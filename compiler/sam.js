import fetch from "node-fetch";

const API_KEY = "AIzaSyBkjqYa3GwxL3EMnixDpoAThE7A8fjiL4U";

async function testGemini() {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      { role: "user", parts: [{ text: "Say hello in 5 words" }] }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

testGemini();
