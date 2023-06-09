import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./main.css";
import { useData } from "../../hooks/userData";
import { useLocation, useNavigate } from "react-router";
import firebase from "firebase/compat/app";
import { BiHappyAlt } from "react-icons/bi";

import map_keys from "./sample.json";

const my_apikey = process.env.REACT_APP_OPEN_API_KEY;
console.log(my_apikey);

//const openai = new OpenAIApi(configuration);

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "여행지 안내를 시작할게요!",
      isBot: 1,
      type: "auto", // 1) auto 2) recommend 3) introduce 4) details 5) user
    },
  ]);
  const [savedContext, setContextValue] = useState([]); //saved chat context
  const [inputValue, setInputValue] = useState("");
  const [buttonsOn, setButtons] = useState(false);
  const [defaultButtonOn, setDefaultButton] = useState(false);
  const { userData } = useData({});
  const [isloading, setIsloading] = useState(false);
  const [receivedMsgOk, setReceivedState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendString, setRecommendString] = useState([]);
  const [photoURL, setphotoURL] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("id");
  var contenttypeid;
  var contentid;
  var locationName;

  const firebaseConfig = {
    apiKey: "AIzaSyAHcapNthGtxiWfwLqFJ-lAaixYIHNhDdw",
    authDomain: "jaban-7c8c2.firebaseapp.com",
    databaseURL: "https://jaban-7c8c2-default-rtdb.firebaseio.com",
    projectId: "jaban-7c8c2",
    storageBucket: "jaban-7c8c2.appspot.com",
    messagingSenderId: "862801813260",
    appId: "1:862801813260:web:4a8e0911e28ed43cd5b329",
    measurementId: "G-B6Q439LLL4",
  };

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  useEffect(() => {
    const obtainedQueries = new URLSearchParams(window.location.search);
    contentid = obtainedQueries.get("contentid");
    contenttypeid = obtainedQueries.get("contenttypeid");
    locationName = obtainedQueries.get("locationName");

    if (userData) {
      const userRef = database.ref(`users/${userId}`);
      userRef
        .once("value")
        .then((snapshot) => {
          const user = snapshot.val();
          if (user && user.photoUrl) {
            setphotoURL(user.photoUrl);
          }
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
        });
    }
    returnInformation(contentid, contenttypeid, locationName)
      .then((retInfo) => {
        console.log("Fetched string:", retInfo);

        setButtons(false);
        setDefaultButton(false);
        //reset button status.

        setContextValue(retInfo); // [0] : details[1] : overview, address
        //setInputValue(retInfo);
        setIsloading(true);
        setMessages([
          ...messages,
          {
            id: messages.length + 1,
            text: locationName + "에 대해 물어보세요!",
            isBot: 1,
            type: "auto",
          },
        ]);
        setIsloading(false);
        setReceivedState(true);
        setDefaultButton(true); // default button on
        //setButtons(true);

        /*
          var emptyList = [];
          emptyList.push(Object.keys(retInfo[1])[buttonTick]);
          emptyList.push(Object.keys(retInfo[1])[buttonTick + 1]);
          console.log('List stacked : ', emptyList)
          setButtonKeywords(emptyList);
          */
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

  // ret[0] : details ret[1] : overview,addr
  async function returnInformation(contentid, contenttypeid, locationName) {
    const details = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/detailIntro1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&contentId=${contentid}&contentTypeId=${contenttypeid}&_type=json`
    );
    const result = await details.json();
    const details_item = result.response.body.items.item[0];

    const details2 = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/detailCommon1?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&serviceKey=VWVz5AVsiy%2F0nCNOXrxaxJy5b7pzOz3GyOBxO3T8av6rb9xuOhTZpv50%2BbrWeqaaok0Nk77O%2B%2F8wCWW4MPJLNA%3D%3D&contentId=${contentid}&defaultYN=Y&addrinfoYN=Y&overviewYN=Y&_type=json`
    );
    const result2 = await details2.json();

    const details_overview = result2.response.body.items.item[0];
    console.log(details_overview, details_item);

    let prefix_info = "";

    let prefix_overview = "장소 이름: " + locationName + "\n";

    for (const [key, value] of Object.entries(details_item)) {
      if (key in map_keys && value != "") {
        prefix_info += `${map_keys[key]}: ${value} `;
      }
    }

    prefix_overview += `${map_keys["overview"]}: ${details_overview["overview"]}\n`;
    prefix_overview += `${map_keys["addr"]}: ${details_overview["addr1"]} ${details_overview["addr2"]}`;
    return [prefix_overview, prefix_info];
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
      temperature: 0.7,
      // frequency_penalty: 1.0,
      // stream: true,
    };
    //console.log(configuration['apiKey'])

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
        { id: messages.length + 1, text: inputValue, isBot: 0, type: "user" },
      ]);
      console.log("This is chatbot.");

      setIsloading(true);
      const response = await createCompletion({}, inputValue);
      setIsloading(false);

      console.log("message:", messages);
      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputValue, isBot: 0, type: "user" },
        {
          id: messages.length + 2,
          text: response.text,
          isBot: 1,
          type: "auto",
        },
      ]);

      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  async function handleDefaultButtonClicked(buttonText) {
    console.log("default button clicked");
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: "새로운 질문을 추천해줘.",
        isBot: 0,
        type: "user",
      },
      {
        id: messages.length + 2,
        text: "새로운 질문을 추천해드릴게요. 잠시만 기다려주세요!",
        isBot: 1,
        type: "auto",
      },
    ]);
    setDefaultButton(false);
    const recommendGenerationString =
      "아래 제공되는 정보에 기반해서, 여행객이 궁금해 할 유용할 질문을 JSON 형식으로 반환해줘 (최대 5개). 다른 말은 하지마. \n\n" +
      "'''" +
      savedContext[0] +
      "\n" +
      savedContext[1] +
      "'''\n\n\n." +
      '형식: {"question1" : "질문1", "question2" : "질문2"}.';

    setIsloading(true);
    const response = await createCompletion({}, recommendGenerationString); //'{"question1": "asdf", "question2": "eeee"}';
    setIsloading(false);

    console.log(response);

    let resObj = {};

    try {
      resObj = JSON.parse(response.text); //response.text
    } catch (e) {
      console.log(e);
      return;
    }

    //console.log(resObj);
    //console.log("message:", messages);
    setRecommendString([resObj["question1"], resObj["question2"]]);

    // activate button and its content.
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: "새로운 질문을 추천해줘.",
        isBot: 0,
        type: "user",
      },
      {
        id: messages.length + 2,
        text: "새로운 질문을 추천해드릴게요. 잠시만 기다려주세요!",
        isBot: 1,
        type: "auto",
      },
      {
        id: messages.length + 3,
        text: "궁금해 하실 만한 내용을 생각해봤어요!\n",
        isBot: 1,
        type: "recommend",
      },
    ]);

    //console.log("message:", messages);
    setDefaultButton(true);
    setInputValue("");
  }

  async function handleButtonClicked(type) {
    console.log(`Button clicked:`, type);
    let promptedString = "";
    let userString = "";
    let autoString = "";
    if (type === "recommend0") {
      promptedString =
        "아래와 같이 질문과 정보를 제공할테니, 정보에 기반하여 질문에 대해 해요체로 답변을 간결하게 적어줘.\n\n  질문: " +
        recommendString[0] +
        "\n 정보:\n" +
        savedContext[0] +
        "\n" +
        savedContext[1];
      userString = recommendString[0];
      autoString = "질문에 대해 답변을 작성하고 있어요..";
    } else if (type === "recommend1") {
      promptedString =
        "아래와 같이 질문과 정보를 제공할테니, 정보에 기반하여 질문에 대해 해요체로 답변을 간결하게 적어줘.\n 질문: " +
        recommendString[1] +
        "\n 정보:\n" +
        savedContext[0] +
        "\n" +
        savedContext[1];
      userString = recommendString[1];
      autoString = "질문에 대해 답변을 작성하고 있어요..";
    } else if (type === "introduce") {
      promptedString =
        "여행지에 대한 설명을 제공할게. 설명을 이용해서 여행지에 대한 소개문을 세 문장 이내로 작성해줘. 해요체를 사용해.\n 설명 정보:\n" +
        savedContext[0];
      userString = "여행지에 대해 소개해줘.";
      autoString = "여행지에 대해 알아보고 있어요..";
    } else if (type === "details") {
      promptedString =
        "여행지에 대한 세부 정보와 형식을 제공할게. 모든 정보를 형식에 맞춰 나열해줘. 숫자로 표기된 값은 '있음'이나 '없음', '가능'이나 '불가능'으로 변환해. \n 세부 정보:\n" +
        savedContext[1] +
        "\n형식: - {세부 정보 이름} : {세부 정보 내용}\n- {세부 정보 이름} : {세부 정보 내용}\n...";
      userString = "여행지의 세부 정보에 대해 알려줘.";
      autoString = "세부 정보에 대해 알아보고 있어요..";
    }
    //console.log(type,promptedString);
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: userString,
        isBot: 0,
        type: "user",
      },
      {
        id: messages.length + 2,
        text: autoString,
        isBot: 1,
        type: "auto",
      },
    ]);
    console.log("chatbot sent msg1");

    setIsloading(true);
    const response = await createCompletion({}, promptedString);
    setIsloading(false);
    console.log(response);
    //console.log("message:", messages);
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: userString,
        isBot: 0,
        type: "user",
      },
      {
        id: messages.length + 2,
        text: autoString,
        isBot: 1,
        type: "auto",
      },
      { id: messages.length + 3, text: response.text, isBot: 1, type: type },
    ]);
    console.log(type);

    setButtons(false);
    setDefaultButton(true); //turn on recommendation button.
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
            src={photoURL}
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
                backgroundColor: message.isBot ? "#AEE4FF" : "#FFD9C2",
                whiteSpace: "pre-wrap",
              }}
            >
              {message.text}
              {receivedMsgOk &&
                defaultButtonOn &&
                (message.id === 2 ||
                  message.type === "recommend0" ||
                  message.type === "recommend1") && (
                  <div className="button-containers">
                    <button
                      className="button buttonD"
                      onClick={() => handleDefaultButtonClicked()}
                    >
                      <b>새로운 질문을 추천해줘.</b>
                    </button>
                    <button
                      className="button button1"
                      onClick={() => handleButtonClicked("introduce")}
                    >
                      <b>여행지에 대해 소개해줘.</b>
                    </button>
                    <button
                      className="button button2"
                      onClick={() => handleButtonClicked("details")}
                    >
                      <b>여행지의 세부 정보에 대해 알려줘.</b>
                    </button>
                    <button
                      className="button exit"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <b>더 이상 궁금한 것이 없어요.</b>
                    </button>
                  </div>
                )}
              {receivedMsgOk &&
                defaultButtonOn &&
                message.id !== 2 &&
                message.type === "recommend" && (
                  <div className="button-containers">
                    <button
                      className="button button1"
                      onClick={() => handleButtonClicked("recommend0")}
                    >
                      <b>{recommendString[0]}</b>
                    </button>
                    <button
                      className="button button2"
                      onClick={() => handleButtonClicked("recommend1")}
                    >
                      <b>{recommendString[1]}</b>
                    </button>
                    <button
                      className="button exit"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <b>더 이상 궁금한 것이 없어요.</b>
                    </button>
                  </div>
                )}
              {receivedMsgOk &&
                defaultButtonOn &&
                message.id === 2 &&
                (message.type === "recommend0" ||
                  message.type === "recommend1") && (
                  <div className="button-containers">
                    <button
                      className="button buttonD"
                      onClick={() => handleDefaultButtonClicked()}
                    >
                      <b>새로운 질문을 추천해줘.</b>
                    </button>
                    <button
                      className="button button1"
                      onClick={() => handleButtonClicked("introduce")}
                    >
                      <b>여행지에 대해 소개해줘.</b>
                    </button>
                    <button
                      className="button button2"
                      onClick={() => handleButtonClicked("details")}
                    >
                      <b>여행지의 세부 정보에 대해 알려줘.</b>
                    </button>
                    <button
                      className="button exit"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <b>더 이상 궁금한 것이 없어요.</b>
                    </button>
                  </div>
                )}

              {receivedMsgOk &&
                defaultButtonOn &&
                message.id !== 2 &&
                message.type === "introduce" && (
                  <div className="button-container">
                    <button
                      className="button buttonD"
                      onClick={() => handleDefaultButtonClicked()}
                    >
                      <b>새로운 질문을 추천해줘.</b>
                    </button>
                    <button
                      className="button button2"
                      onClick={() => handleButtonClicked("details")}
                    >
                      <b>여행지의 세부 정보에 대해 알려줘.</b>
                    </button>
                    <button
                      className="button exit"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <b>더 이상 궁금한 것이 없어요.</b>
                    </button>
                  </div>
                )}
              {receivedMsgOk &&
                defaultButtonOn &&
                message.id !== 2 &&
                message.type === "details" && (
                  <div className="button-container">
                    <button
                      className="button buttonD"
                      onClick={() => handleDefaultButtonClicked()}
                    >
                      <b>새로운 질문을 추천해줘.</b>
                    </button>
                    <button
                      className="button button1"
                      onClick={() => handleButtonClicked("introduce")}
                    >
                      <b>여행지에 대해 소개해줘.</b>
                    </button>
                    <button
                      className="button exit"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <b>더 이상 궁금한 것이 없어요.</b>
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
