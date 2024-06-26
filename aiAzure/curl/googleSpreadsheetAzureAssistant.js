function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Adds a custom menu to Google Sheets.
  ui.createMenu('Azure OpenAI API')
      .addItem('Get Response', 'getResponse')
      .addToUi();
}

function createThread(apiKey, endpoint) {
    var apiURL = `https://${endpoint}/openai/threads?api-version=2024-05-01-preview`;
    var headers = {
      "api-key": apiKey,
      "Content-Type": "application/json"
    };
    var options = {
      "method": "post",
      "headers": headers,
      "payload": ''
    };
    var response = UrlFetchApp.fetch(apiURL, options);
    return JSON.parse(response.getContentText());
}

function createMessage(apiKey, endpoint, threadId, content) {
    var apiURL = `https://${endpoint}/openai/threads/${threadId}/messages?api-version=2024-05-01-preview`;
    var headers = {
      "api-key": apiKey,
      "Content-Type": "application/json"
    };
    var payload = JSON.stringify({
      "role": "user",
      "content": content
    });
    var options = {
      "method": "post",
      "headers": headers,
      "payload": payload
    };
    var response = UrlFetchApp.fetch(apiURL, options);
    return JSON.parse(response.getContentText());
}

function runThread(apiKey, endpoint, threadId) {
    var apiURL = `https://${endpoint}/openai/threads/${threadId}/runs?api-version=2024-05-01-preview`;
    var headers = {
      "api-key": apiKey,
      "Content-Type": "application/json"
    };
    var payload = JSON.stringify({
      "assistant_id": "asst_bhRd5zAq1b4MgY7oUIlqYucm" // replace with your assistant id
    });
    var options = {
      "method": "post",
      "headers": headers,
      "payload": payload
    };
    var response = UrlFetchApp.fetch(apiURL, options);
    return JSON.parse(response.getContentText());
}

function getThreadResponse(apiKey, endpoint, threadId) {
    var apiURL = `https://${endpoint}/openai/threads/${threadId}/messages?api-version=2024-05-01-preview`;
    var headers = {
      "api-key": apiKey,
      "Content-Type": "application/json"
    };
    var options = {
      "headers": headers,
      "payload": '',
      "muteHttpExceptions": true
    };
    var response = UrlFetchApp.fetch(apiURL, options);
    const jsonResponse = JSON.parse(response.getContentText());
    const message = jsonResponse.data[0].content[0].text.value;
    return message;
}

function getResponse() {
  var apiKey = ''; // Replace with API KEY
  var endpoint = 'CraftersOpenAI.openai.azure.com';
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  var promptText = cell.getValue();
  
  if (promptText) {    
    try {
      var thread = createThread(apiKey, endpoint);
      const message = createMessage(apiKey, endpoint, thread.id, promptText);
      const run = runThread(apiKey, endpoint, thread.id);

      Utilities.sleep(10000); // should be improved to read run state

      const responseMessage = getThreadResponse(apiKey, endpoint, thread.id);
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