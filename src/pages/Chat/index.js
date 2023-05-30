import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./main.css";
import { useData } from "../../hooks/userData";
import { useNavigate } from "react-router";
import { Configuration, OpenAIApi } from "openai";
import { FaCommentDots } from "react-icons/fa";
import map_keys from "./sample.json";

const my_apikey = process.env.REACT_APP_OPEN_API_KEY;

//const openai = new OpenAIApi(configuration);

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "여행지 안내를 시작할게요! \n 잠시만 기다려주세요.",
      isBot: 1,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [buttonsOn, setButtons] = useState(false);
  const { userData } = useData({});
  const [isloading, setIsloading] = useState(false);
  const [receivedMsgOk, setReceivedState] = useState(false);
  const navigate = useNavigate();
  var contenttypeid;
  var contentid;
  var locationName;

  useEffect(() => {
    const obtainedQueries = new URLSearchParams(window.location.search);
    console.log(obtainedQueries.get("contentid"));
    contentid = obtainedQueries.get("contentid");
    contenttypeid = obtainedQueries.get("contenttypeid");
    locationName = obtainedQueries.get("locationName");
    console.log(contentid, contenttypeid, locationName);
    returnInformation(contentid, contenttypeid, locationName)
      .then((retInfo) => {
        console.log("Fetched string:", retInfo);
        //setInputValue(retInfo);
        setIsloading(true);
        createCompletion({}, retInfo).then((response_) => {
          setMessages([
            ...messages,
            { id: messages.length + 5, text: response_.text, isBot: 1 },
          ]);
          setIsloading(false);
          setReceivedState(true);
          setButtons(true);
          console.log(response_.text);
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

  async function returnInformation(contentid, contenttypeid, locationName) {
    const details = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/detailIntro1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&contentId=${contentid}&contentTypeId=${contenttypeid}&_type=json`
    );
    const result = await details.json();
    const { response } = result;
    const { body } = response;
    const { items } = body;
    const { item } = items;
    let concat_prefix =
      "검색 정보와 추천 멘트 형식을 아래와 같이 제공할테니, 너가 알고 있는 사실이나 상식은 철저히 배제하고, 내가 아래에 제공하는 정보에만 기반하면서, 형식을 준수해서 최대한 간략한 요약글을 작성해줘. 무조건 문장마다 해요체로 끝나야 해.  \n 검색 정보: '''\n 여행지 이름:" +
      locationName +
      " ";

    for (const [key, value] of Object.entries(item[0])) {
      if (key in map_keys && value != "") {
        console.log(key);
        concat_prefix += `${map_keys[key]}: ${value} `;
      }
    }
    concat_prefix +=
      "\n'''\n형식: \n'''오늘 갈 여행지 {여행지 이름}에 대해 안내드려요! \n{여행지 설명}";
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

    const buttons = ["Button 1", "Button 2", "Button 3"];
    const responseWithButtons = {
      text: output,
      buttons: buttons,
    };
    return responseWithButtons;
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
        { id: messages.length + 2, text: response.text, isBot: 1 },
      ]);

      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  async function handleButtonClicked1(buttonText) {
    console.log(`Button clicked: btn1`);
    const promptedString =
      "언제 방문하는 게 가장 좋을까? 해요체로 간략하게 내가 앞에서 준 정보를 바탕으로 너의 생각을 답해줘.";

    setMessages([
      ...messages,
      {
        id: messages.length + 3,
        text: "언제 방문하는 게 가장 좋을까?",
        isBot: 0,
      },
    ]);
    console.log("chatbot sent msg1");

    setIsloading(true);
    const response = await createCompletion({}, promptedString);
    setIsloading(false);

    console.log("message:", messages);
    setMessages([
      ...messages,
      {
        id: messages.length + 3,
        text: "언제 방문하는 게 가장 좋을까?",
        isBot: 0,
      },
      { id: messages.length + 3, text: response.text, isBot: 1 },
    ]);

    setInputValue("");
  }

  async function handleButtonClicked2(buttonText) {
    console.log(`Button clicked: btn2`);
    const promptedString =
      "이곳의 매력에 대해 어떻게 생각해? 해요체로 간략하게 내가 앞에서 준 정보를 바탕으로 너의 생각을 답해줘.";

    setMessages([
      ...messages,
      {
        id: messages.length + 4,
        text: "이곳의 매력에 대해 어떻게 생각해?",
        isBot: 0,
      },
    ]);
    console.log("chatbot sent msg1");

    setIsloading(true);
    const response = await createCompletion({}, promptedString);
    setIsloading(false);

    console.log("message:", messages);
    setMessages([
      ...messages,
      {
        id: messages.length + 4,
        text: "이곳의 매력에 대해 어떻게 생각해?",
        isBot: 0,
      },
      { id: messages.length + 4, text: response.text, isBot: 1 },
    ]);

    setInputValue("");
  }

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
              {receivedMsgOk &&
                buttonsOn &&
                message.id !== 1 &&
                message.isBot && (
                  <div className="button-container">
                    <button
                      className="button button1"
                      onClick={handleButtonClicked1}
                    >
                      <b>언제 방문하는 게 가장 좋을까?</b>
                    </button>
                    <br></br>
                    <button
                      className="button button2"
                      onClick={handleButtonClicked2}
                    >
                      <b>이곳의 매력에 대해 어떻게 생각해?</b>
                    </button>
                  </div>
                )}
            </div>
          ))}
          {isloading && (
            <img
              src="/../images/pencil.gif"
              alt="writing"
              className="loading-icon"
            ></img>
          )}
        </div>
      </div>
    </section>
  );
};

export default Chatbot;
