// ===============================
// ELEMENTS
// ===============================

const email = document.getElementById("email");

const predictBtn = document.getElementById("predictBtn");
const clearBtn = document.getElementById("clearBtn");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const prediction = document.getElementById("prediction");
const message = document.getElementById("message");
const icon = document.getElementById("icon");

const words = document.getElementById("words");
const chars = document.getElementById("chars");

const examples = document.querySelectorAll(".example");


// ===============================
// WORD COUNTER
// ===============================

function updateCounter() {
    const text = email.value;

    chars.innerHTML = "Characters : " + text.length;

    const count =
        text.trim() === ""
            ? 0
            : text.trim().split(/\s+/).length;

    words.innerHTML = "Words : " + count;
}

email.addEventListener("input", updateCounter);


// ===============================
// CLEAR BUTTON
// ===============================

clearBtn.addEventListener("click", () => {
    email.value = "";
    updateCounter();
    result.classList.add("hidden");
});


// ===============================
// EXAMPLE EMAILS
// ===============================

examples.forEach(example => {
    example.addEventListener("click", () => {
        email.value = example.innerText.trim();
        updateCounter();
    });
});


// ===============================
// PREDICTION
// ===============================

predictBtn.addEventListener("click", async () => {

    const text = email.value.trim();

    if (text === "") {
        alert("Please enter an email.");
        return;
    }

    result.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
        const response = await fetch("https://backend-spam-detector.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: text
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned status code ${response.status}`);
        }

        const data = await response.json();

        loading.classList.add("hidden");

        if (data.error) {
            alert(data.error);
            return;
        }

        result.classList.remove("hidden");

        prediction.innerHTML = data.prediction;


        // ==========================
        // HAM
        // ==========================

        if (data.prediction === "Ham") {
            prediction.className = "success";
            icon.className = "fa-solid fa-circle-check success";
            icon.innerHTML = "";
            message.innerHTML = "This email looks safe and legitimate.";
        }

        // ==========================
        // SPAM
        // ==========================

        else {
            prediction.className = "danger";
            icon.className = "fa-solid fa-triangle-exclamation danger";
            icon.innerHTML = "";
            message.innerHTML = "Warning! This email appears to be spam.";
        }

    } catch (error) {
        loading.classList.add("hidden");
        console.error("Fetch failure error details:", error);
        alert("Connection Error: Unable to communicate with backend at https://backend-spam-detector.onrender.com/predict");
    }

});