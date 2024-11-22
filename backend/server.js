const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const cors = require("cors");

const system_prompt = "You are a chatbot designed to assist users in calculating how long it will take them to pay off solar panels based on their state, electricity usage, and the specific model of solar panels they choose. Follow these steps to provide accurate and helpful responses: \n" +
    "\n" +
    "1. Identify the Solar Panel Model: Ask the user for their preferred solar panel model. If they do not know, suggest popular models and provide brief specifications (e.g., efficiency, warranty, cost). \n" +
    "\n" +
    "2. Determine User Location: Ask the user for their state of residence to access specific average electricity rates and solar incentives applicable in that state. \n" +
    "\n" +
    "3. Determine the amount of solar panels: Ask the user how many panels they want to install or a suggested amount based off location.\n" +
    "\n" +
    "4. Calculate Average Electricity Usage: Retrieve and use the average monthly electricity usage for the user's state. Provide context about how this affects their savings. \n" +
    "\n" +
    "5. Calculate Savings: Use the selected solar panel model's specifications and the user’s state data to calculate: \n" +
    "   - The total installation cost. \n" +
    "   - The monthly savings based on the average electricity rate and usage. \n" +
    "   - The estimated time (in years) it will take to pay off the solar panel investment through savings on electricity bills. \n" +
    "\n" +
    "6. Provide Clear Results: Present the user with: \n" +
    "   - The number of months it will take to pay off the solar panels. \n" +
    "   - Additional insights on potential energy savings, environmental impact, and available state incentives. \n" +
    "   - Encourage the user to ask follow-up questions for more personalized advice or information on financing options. \n" +
    "\n" +
    "7. User Engagement: Maintain a friendly and informative tone, encouraging users to explore their solar options and consider the benefits of solar energy.\n" +
    "8. Once you find the results, ask the user if they have any questions regarding solar panels and answer them. \n" +
    "9. If the user strays from the objective, kindly reroute them to the main topic. \n" +
    "10. This is important, do not include any equations or fractions."

dotenv.config()

const app = express();
const openai = new OpenAI();

app.use(express.json());
app.use(cors({

}))

app.get("/", (req, res) => {
    res.status(200).json({message: "Request received"});
})

const format_response = (message) => {
    let bold = false;
    let title = false;
    let new_message = "";
    for(let pointer = 0; pointer < message.length; pointer++){
        const bold_symbol = message[pointer]+message[pointer+1]
        const title_symbol = message[pointer]+message[pointer+1]+message[pointer+2]
        if(bold_symbol === "**"){
            if(bold === false){
                bold = true;
                new_message+="<strong>";
                pointer+=1
            }else{
                bold = false;
                new_message+="</strong>";
                pointer+=1
            }
        }else if(title_symbol === "###"){
            title = true;
            new_message+="<h3>";
            pointer+=2
        }else if(title === true && message[pointer] === "\n"){
            title = false;
            new_message+="</h3>\n";
        }else{
            new_message+=message[pointer];

        }

    }
    new_message = new_message.replaceAll("\n", "<br>")
    return new_message;
}

app.post("/chat", async (req, res) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: system_prompt },
            {
                role: "user",
                content: JSON.stringify(req.body.chat_log),
            },
        ],
    });
    const message = format_response(completion.choices[0].message.content)
    res.status(200).json({message})
})

app.listen("8080", () => {
    console.log("Listening on port 8080")
})