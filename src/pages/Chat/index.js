import React, { useEffect, useState } from "react";
import "./main.css";
import { useData } from "../../hooks/userData";
import { useNavigate } from "react-router";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-JbU7cwJQlyRC9PjUIczsSIaO",
  apiKey: "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",
});
const { APIKEY } = process.env;
// console.log(process.env.APIKEY);
const my_apikey = "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";
//const openai = new OpenAIApi(configuration);

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "안녕하세요, 무엇을 도와 드릴까요?", isBot: 1 },
  ]);
  const [inputValue, setInputValue] = useState("");
  const { userData } = useData({});
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();

  // 자동 스크롤
  useEffect(() => {
    var divdiv = document.getElementById("mess");

    divdiv.scrollTop = divdiv.scrollHeight;
  }, [messages]);

  /*
  async function send_msg_2_chatgpt(msg) {
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      messages : [{'role' : 'user', 'content' : msg}],
      temperature : 0.0
    });
    const data = await response;
    console.log(data)
    return data;
  }*/

  function replaceAll(strTemp, strValue1, strValue2) {
    while (1) {
      if (strTemp.indexOf(strValue1) !== -1)
        strTemp = strTemp.replace(strValue1, strValue2);
      else break;
    }
    return strTemp;
  }

  async function fetchStream(stream) {
    const reader = stream.getReader();

    let charsReceived = 0;
    const li = document.createElement("li");

    // read() returns a promise that resolves
    // when a value has been received
    const result = await reader
      .read()
      .then(function processText({ done, value }) {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (done) {
          console.log("Stream complete");
          //console.log(li.innerText);
          return li.innerText;
        }
        // value for fetch streams is a Uint8Array
        charsReceived += value.length;
        const decoder = new TextDecoder();
        const chunk = decoder.decode(value, { stream: true });
        console.log(
          `Received ${charsReceived} characters so far. Current chunk = ${chunk}`
        );
        li.appendChild(document.createTextNode(chunk));
        return reader.read().then(processText);
      });
    const list = result.split(",");
    const numList = list.map((item) => {
      //return unescape(replaceAll(item, "\\", "%"));
      return item;
    });
    //const text = String.fromCharCode(...numList);

    const response = JSON.parse(list);
    const final_response = response.choices[0].message.content;
    console.log(final_response);
    return final_response;
  }

  //const [chatList, setChatList] = ([]) // chat history
  async function createCompletion(params = {}, msg) {
    const DEFAULT_PARAMS = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: msg }],
      // max_tokens: 4096,
      temperature: 0,
      // frequency_penalty: 1.0,
      // stream: true,
    };
    //console.log(configuration['apiKey'])
    console.log(msg);
    const params_ = { ...DEFAULT_PARAMS, ...params };
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + my_apikey,
      },
      body: JSON.stringify(params_),
    });
    const stream = result.body;
    const output = await fetchStream(stream);
    console.log(output);
    return output;
  }

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    if (inputValue !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputValue, isBot: 0 },
      ]);
      console.log("This is chatbot.");

      setIsloading(true);
      const response = await createCompletion({}, inputValue);
      setIsloading(false);
      console.log("message:", messages);
      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputValue, isBot: 0 },
        { id: messages.length + 2, text: response, isBot: 1 },
      ]);

      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <section className="container">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <button
            className="chatbot-header-close"
            onClick={() => {
              navigate(-1);
            }}
          >
            &#8592;
          </button>
          <div className="chatbot-header-text">Chatbot</div>
          <img
            className="user-img"
            src={userData.photoURL}
            alt={userData.displayName}
          ></img>
        </div>
        <div className="chatbot-messages" id="mess">
          {messages.map((message) => (
            <div
              key={message.id}
              className="chatbot-message"
              style={{
                alignSelf: message.isBot ? "flex-start" : "flex-end",
                backgroundColor: message.isBot ? "greenYellow" : "white",
              }}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleInputSubmit} className="chatbot-input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            disabled={isloading}
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send-button">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Chatbot;
