const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const isAllowedEmail = require("./students");

const app = express();
const PORT = 3000;

const GOOGLE_CLIENT_ID =
    "596680702504-d2rfv27j74aff8tspgg2n1k83o1g6a81.apps.googleusercontent.com";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(express.json());
app.use(express.static("."));


// ================= GOOGLE LOGIN =================

app.post("/google-login", async (req, res) => {
    try {
        const token = req.body.credential;

        if (!token) {
            return res.status(400).json({
                allowed: false,
                message: "Google login token is missing"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email?.toLowerCase().trim();

        if (!email) {
            return res.json({
                allowed: false,
                message: "Google account email not found"
            });
        }

        if (isAllowedEmail(email)) {
            return res.json({
                allowed: true,
                message: "Access granted!",
                email: email
            });
        }

        return res.json({
            allowed: false,
            message: "Only Gmail accounts are allowed."
        });

    } catch (error) {
        console.error("Google login error:", error);

        return res.status(401).json({
            allowed: false,
            message: "Google login verification failed."
        });
    }
});


// ================= GENERATE QUIZ =================

app.post("/generate-quiz", (req, res) => {

    const topic = req.body.topic?.trim();
    const numberOfQuestions =
        parseInt(req.body.numberOfQuestions);

    console.log("Topic:", topic);
    console.log("Number of questions:", numberOfQuestions);

    if (!topic || !numberOfQuestions) {
        return res.json({
            success: false,
            message: "Please enter topic and number of questions."
        });
    }


    // Sample questions
    const questionBank = [

        {
            question: "What does UHV stand for?",
            options: [
                "Universal Human Values",
                "United Human Vision",
                "Universal Health Values",
                "United Human Values"
            ],
            answer: 0
        },

        {
            question: "What is the basic aspiration of every human being?",
            options: [
                "Continuous happiness and prosperity",
                "Only money",
                "Only physical comfort",
                "Fame"
            ],
            answer: 0
        },

        {
            question: "What is harmony?",
            options: [
                "A state of balance and mutual understanding",
                "Competition",
                "Conflict",
                "Isolation"
            ],
            answer: 0
        },

        {
            question: "Which is necessary for mutual happiness?",
            options: [
                "Right understanding",
                "Conflict",
                "Competition",
                "Fear"
            ],
            answer: 0
        },

        {
            question: "What is the purpose of education?",
            options: [
                "Right understanding and right living",
                "Only getting marks",
                "Only getting a job",
                "Only earning money"
            ],
            answer: 0
        },

        {
            question: "What is the relationship between human beings and nature?",
            options: [
                "Mutual fulfillment",
                "Competition",
                "Conflict",
                "No relationship"
            ],
            answer: 0
        },

        {
            question: "What is self-exploration?",
            options: [
                "Understanding oneself through natural acceptance",
                "Copying others",
                "Avoiding questions",
                "Competing with others"
            ],
            answer: 0
        },

        {
            question: "What is prosperity?",
            options: [
                "Feeling of having more than required physical facilities",
                "Having unlimited money",
                "Having a large house",
                "Buying expensive things"
            ],
            answer: 0
        },

        {
            question: "What is trust in a relationship?",
            options: [
                "The assurance that the other person intends my happiness and prosperity",
                "Fear of another person",
                "Competition",
                "Suspicion"
            ],
            answer: 0
        },

        {
            question: "Which is important for harmony in a family?",
            options: [
                "Trust and respect",
                "Competition",
                "Anger",
                "Jealousy"
            ],
            answer: 0
        }

    ];


    // Shuffle questions
    const shuffledQuestions =
        [...questionBank].sort(() => Math.random() - 0.5);


    // Select requested number
    const selectedQuestions =
        shuffledQuestions.slice(
            0,
            Math.min(numberOfQuestions, questionBank.length)
        );


    console.log(
        "Questions sent:",
        selectedQuestions.length
    );


    res.json({
        success: true,
        topic: topic,
        questions: selectedQuestions
    });

});


// ================= START SERVER =================

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});