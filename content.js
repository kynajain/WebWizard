let body = document.querySelector("body");

let btnQurious = document.createElement("button");
btnQurious.setAttribute("id", "btnQurious");
body.appendChild(btnQurious);

btnQurious.addEventListener('click', doSomething);

let speechRecognition = new webkitSpeechRecognition();
speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = "en-in";

let transcript = "";
speechRecognition.onresult = (event) => {
    transcript = "";
    for (let i = 0; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
    }
};

function doSomething(){
    if(btnQurious.hasAttribute("listening")){
        btnQurious.removeAttribute("listening");
        speechRecognition.stop();
        transcript = transcript.trim().toLowerCase();
        takeAction(transcript);
        transcript = "";
    } else {
        btnQurious.setAttribute("listening", "true");
        speechRecognition.start();
    }
}

function takeAction(content){
    if(content.startsWith("search in linkedin")){
        findInSearchBox(content.substring("search in linkedin".length).trim());
    } else if(content.startsWith("search in messages")){
        findInMessageBox(content.substring("search in messages".length).trim());
    } else {
        callOpenAI(content);
    }
}

function findInSearchBox(content){
    let searchTextbox = document.querySelector('#global-nav-typeahead input[placeholder="Search"]');
    searchTextbox.value = content;

    setTimeout(function(){
        searchTextbox.focus();
        searchTextbox.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13, // keyCode for Enter key is 13
            which: 13,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true
        }));
    }, 1000);
}

function findInMessageBox(content){
    window.location.assign(window.location.origin + "/messaging?searchTerm=" + content);
}



function callOpenAI(content) {
    const apiURL = 'https://api.openai.com/v1/chat/completions';
    const apiKey = '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'; // WARNING: Exposing API keys client-side is insecure
    const data = {
        model: "gpt-4-0125-preview", // Specify the model
         messages: [{
            role: "user",
            content: content
        }],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    };

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data.choices[0].message.content))
    .catch((error) => {
        console.error('Error:', error);
    });
}


