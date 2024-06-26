function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Adds a custom menu to Google Sheets.
  ui.createMenu('OpenAI API')
      .addItem('Get Response', 'getResponse')
      .addToUi();
}

function createThread(apiKey) {
    var apiURL = 'https://api.openai.com/v1/threads';
    var options = {
      "method": "post",
      "contentType": "application/json",
      "headers": {
        "Authorization": "Bearer " + apiKey,
        "OpenAI-Beta": "assistants=v2"
      },
      "muteHttpExceptions": true
    };
    var response = UrlFetchApp.fetch(apiURL, options);
    return JSON.parse(response.getContentText());
}

function createMessage(apiKey, threadId, content) {
    var apiURL = `https://api.openai.com/v1/threads/${threadId}/messages`;
    var payload = JSON.stringify({
      "role": "user",
      "content": content
    });
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": payload,
      "headers": {
        "Authorization": "Bearer " + apiKey,
        "OpenAI-Beta": "assistants=v2"
      },
      "muteHttpExceptions": true
    };
    var response = UrlFetchApp.fetch(apiURL, options);
    return JSON.parse(response.getContentText());
}

function runThread(apiKey, threadId) {
    var apiURL = `https://api.openai.com/v1/threads/${threadId}/runs`;
    var payload = JSON.stringify({
      "assistant_id": "asst_bhRd5zAq1b4MgY7oUIlqYucm" // replace with your assistant id
    });
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": payload,
      "headers": {
        "Authorization": "Bearer " + apiKey,
        "OpenAI-Beta": "assistants=v2"
      },
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(apiURL, options);
    return JSON.parse(response.getContentText());
}

function getThreadResponse(apiKey, threadId) {
    var apiURL = `https://api.openai.com/v1/threads/${threadId}/messages`;
    var options = {
      "contentType": "application/json",
      "headers": {
        "Authorization": "Bearer " + apiKey,
        "OpenAI-Beta": "assistants=v2"
      },
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(apiURL, options);
    const jsonResponse = JSON.parse(response.getContentText());
    const message = jsonResponse.data[0].content[0].text.value;
    return message;
}

function getResponse() {
  var apiKey = ''; // replace with the api key
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  var promptText = cell.getValue();
  
  if (promptText) {    
    try {
      var thread = createThread(apiKey);

      const message = createMessage(apiKey, thread.id, promptText);
      const run = runThread(apiKey, thread.id);

      Utilities.sleep(5000); // should be improved to read run state

      const responseMessage = getThreadResponse(apiKey, thread.id);
      // Update the next cell in the row with the response
      cell.offset(0, 1).setValue(responseMessage);
    } catch (e) {
    SpreadsheetApp.getUi().alert(e.toString());
      Logger.log(e.toString());
    }
  } else {
    SpreadsheetApp.getUi().alert('Please select a cell with content.');
  }
}
