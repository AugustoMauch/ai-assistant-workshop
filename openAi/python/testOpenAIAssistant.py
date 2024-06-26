from dotenv import load_dotenv
import os
import openai
import time
import sys

load_dotenv()

# Set your OpenAI API key
openai.api_key = os.getenv('API_KEY')

def create_thread(client): 
    return  client.beta.threads.create()

def add_message_to_thread(client, thread_id, message): 
    client.beta.threads.messages.create(
        thread_id,
        role="user",
        content=message
    )    

def create_run(client, thread_id, assistant_id):
    return client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id
    )

def retrieve_run(client, thread_id, run_id):
    return client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run_id
            )      

def retrieve_response(client, thread_id):
      thread_messages = client.beta.threads.messages.list(thread_id)
      return thread_messages.data[0].content[0].text.value


def main():
    # Initialize the OpenAI client
    client = openai
    
    assistant_id = "asst_bhRd5zAq1b4MgY7oUIlqYucm"

    thread = create_thread(client)

    message = sys.argv[1]
    add_message_to_thread(client, thread.id, message)

    run = create_run(client, thread.id, assistant_id)

    while True:
        run = retrieve_run(client, thread.id, run.id)        
        status = run.status
        
        if status == 'completed':
            break
        time.sleep(1)  # Adjust polling interval as needed

    print(f"Response: {retrieve_response(client, thread.id)}")
    
if __name__ == "__main__":
    main()

