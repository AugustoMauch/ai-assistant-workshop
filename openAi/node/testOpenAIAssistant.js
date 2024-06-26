import OpenAI from "openai";
import readline from "readline";
import "dotenv/config.js";

const assistantId = 'asst_bhRd5zAq1b4MgY7oUIlqYucm'; // Replace with your assistant id
const openai = new OpenAI({
  apiKey: process.env.API_KEY
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function sendMessage(message) {
  let runResponse = await openai.beta.threads.createAndRun({
    assistant_id: assistantId,
    thread: {
      messages: [
        { role: "user", content: message },
      ],
    },
  });

  do {
     await new Promise((resolve) => setTimeout(resolve, 800));
     runResponse = await openai.beta.threads.runs.retrieve(
      runResponse.thread_id,
      runResponse.id
    );     
  } while (runResponse.status === "queued" || runResponse.status === "in_progress") 

  const threadMessages = await openai.beta.threads.messages.list(
    runResponse.thread_id
  );
  const {data} = threadMessages;
  const {content} = data[0];
  console.log(`Response: ${content[0].text.value}`);
}

function main() {
  rl.question('Enter your message: ', async (message) => {
    await sendMessage(message);
    main(); // call main again to prompt for next message
  });
}

main();

