import { AzureKeyCredential } from '@azure/openai';
import { AssistantsClient } from '@azure/openai-assistants';
import readline from "readline";
import "dotenv/config.js";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://craftersopenai.openai.azure.com/';
const azureApiKey = process.env.API_KEY;
const assistantId = 'asst_TlosK9CVyvbV03MVYhV3M1iw'; // ENTER YOUR ASSISTANT ID

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function sendMessage(message) {
  const assistantsClient = new AssistantsClient(endpoint, new AzureKeyCredential(azureApiKey));
  const assistantThread = await assistantsClient.createThread();
  await assistantsClient.createMessage(assistantThread.id, "user", message);
  let runResponse = await assistantsClient.createRun(assistantThread.id, {
    assistantId: assistantId
  });  
 do {
    await new Promise((resolve) => setTimeout(resolve, 800));
    runResponse = await assistantsClient.getRun(assistantThread.id, runResponse.id);
  } while (runResponse.status === "queued" || runResponse.status === "in_progress") 
    const runMessages = await assistantsClient.listMessages(assistantThread.id);
    const {data} = runMessages;
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