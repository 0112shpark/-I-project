import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./main.css";
import { useData } from "../../hooks/userData";
import { useNavigate } from "react-router";
import { Configuration, OpenAIApi } from "openai";
import { FaCommentDots } from "react-icons/fa";
import map_keys from "./sample.json";
/*const configuration = new Configuration({
  organization: "org-JbU7cwJQlyRC9PjUIczsSIaO",
  apiKey: "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",
});*/
const { APIKEY } = process.env;
// console.log(process.env.APIKEY);
const my_apikey = process.env.REACT_APP_OPENAI_API_KEY;
console.log(my_apikey)
//const openai = new OpenAIApi(configuration);

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "여행지 안내를 시작하겠습니다.", isBot: 1 },
  ]);
  const [inputValue, setInputValue] = useState("");
  const { userData } = useData({});
  const [isloading, setIsloading] = useState(false);
  const { contentid, contenttypeid } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {    
    returnInformation(contentid,contenttypeid)
    .then((retInfo) => {
      console.log("Fetched string:", retInfo);
      setInputValue(retInfo);
      createCompletion({}, retInfo).then((response_) => {
        console.log(response_)
      });
      
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }, []);
  
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

  async function returnInformation(contentid, contenttypeid) {
    const details = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/detailIntro1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&contentId=${contentid}&contentTypeId=${contenttypeid}&_type=json`
    );
    const result = await details.json();
    const { response } = result;
    const { body } = response;
    const { items } = body;
    const { item } = items;
    let concat_prefix = "여행지 검색 정보에 대한 파일과 추천 멘트 형식을 아래와 같이 제공할테니, 형식을 준수해서 글을 작성해줘. \n 검색 정보: '''\n "
    
    for (const [key, value] of Object.entries(item[0])) {
      if(key in map_keys && value != ""){
        console.log(key);
        concat_prefix += `${map_keys[key]}: ${value} `;
      }
    }
    concat_prefix += "\n'''\n형식: \n'''오늘 갈 여행지에 대한 정보입니다. \n{여행지 이름}: {여행지 설명}";
    return concat_prefix;
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
    console.log(my_apikey);
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
          {isloading && <FaCommentDots className="icon"></FaCommentDots>}
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
