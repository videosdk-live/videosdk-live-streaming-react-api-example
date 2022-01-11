import React, { useEffect, useState } from "react";
import "./App.css";
import ReactPlayer from "react-player";

function App() {
  const [upstreamVisible, setupstreamVisible] = useState(false);
  const [downstreamVisible, setdownstreamVisible] = useState(false);

  const [urlVal, setUrlVal] = useState("");
  const [videoUrl, setvideoUrl] = useState("");
  const [streamURLs, setstreamURLs] = useState({
    upstreamUrl: "",
    downstreamUrl: "",
  });

  const changeText = (event) => {
    setUrlVal(event.target.value);
  };

  const getToken = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/get-token`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const { token } = await response.json();
      return token;
    } catch (e) {
      console.log(e);
    }
  };

  const getStreamURLs = async (token) => {
    const data = {
      record: true,
      name: "videosdk",
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_VIDEOSDK_URL}/v1/livestreams`,
        options
      );
      const jsonResp = await response.json();
      return jsonResp;
    } catch (e) {
      console.log(e);
    }
  };

  const callApis = async () => {
    const token = await getToken();
    const urlS = await getStreamURLs(token);
    setstreamURLs({
      downstreamUrl: urlS?.downstreamUrl,
      upstreamUrl: urlS?.upstreamUrl,
    });
  };

  useEffect(() => {
    callApis();
  }, []);

  const BackButton = ({ onPress }) => {
    return (
      <button
        onClick={onPress}
        style={{
          position: "absolute",
          top: 12,
          left: 10,
          height: 30,
          width: 60,
          backgroundColor: "transparent",
          fontSize: 14,
          marginLeft: 6,
        }}
      >
        Back
      </button>
    );
  };

  const Home = () => {
    return (
      <div
        style={{
          backgroundColor: "#F6F6FF",
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="button"
          onClick={() => {
            setupstreamVisible(true);
          }}
          style={{
            backgroundColor: "#4AA96C",
            fontSize: 16,
          }}
        >
          Go Live
        </button>
        <button
          className="button"
          onClick={() => {
            setdownstreamVisible(true);
          }}
          style={{
            backgroundColor: "#F55C47",
            marginTop: 8,
            fontSize: 16,
          }}
        >
          Down Stream
        </button>
      </div>
    );
  };

  const UpStream = () => {
    const str = streamURLs.upstreamUrl;
    const serverUrl = str && str.substr(0, 28);
    const streamKey = str && str.split("/")[4];

    return (
      <div
        style={{
          backgroundColor: "#F6F6FF",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "100vh",
            backgroundColor: "#F6F6FF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h3>Copy and paste these setting into your streaming software</h3>
          <div>
            <div>
              <input
                value={serverUrl}
                style={{ fontSize: 16 }}
                className="input"
                type="text"
                disabled
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(serverUrl);
                  alert("Stream URL Copied Successfully!");
                }}
                style={{
                  height: 40,
                  backgroundColor: "grey",
                  fontSize: 14,
                  marginLeft: 6,
                }}
              >
                Copy Stream URL
              </button>
            </div>
            <h5>
              This may referred to as 'URL' or "Address" in your streaming
              software.
            </h5>
          </div>

          <div style={{ marginTop: 6 }}>
            <div>
              <input
                value={streamKey}
                style={{ fontSize: 16 }}
                className="input"
                type="text"
                disabled
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(streamKey);
                  alert("Stream Key Copied Successfully!");
                }}
                style={{
                  height: 40,
                  backgroundColor: "grey",
                  fontSize: 14,
                  marginLeft: 6,
                }}
              >
                Copy Stream Key
              </button>
            </div>
            <h5>
              This may referred to as "Stream key" in your streaming software.
            </h5>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(streamURLs.downstreamUrl);
              alert("Down Stream Copied Successfully!");
            }}
            style={{
              height: 40,
              backgroundColor: "#F55C47",
              fontSize: 14,
            }}
          >
            Copy Down Stream URL
          </button>
        </div>
        <BackButton
          onPress={() => {
            setupstreamVisible(false);
          }}
        />
      </div>
    );
  };

  const DownStream = () => {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#F6F6FF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ReactPlayer
          controls={true}
          style={{
            objectFit: "contain",
            height: "100%",
            width: "100%",
          }}
          url={videoUrl}
        />
        <div style={{ marginTop: 8 }}>
          <input
            value={urlVal}
            style={{ fontSize: 16 }}
            className="input"
            onChange={changeText}
            type="text"
            placeholder={"http://www.example.com/live/playlist.m3u8"}
          />
          <button
            className="button"
            onClick={() => {
              setvideoUrl(urlVal);
            }}
            style={{
              height: 40,
              width: 60,
              backgroundColor: "green",
              color: "white",
              fontSize: 14,
              marginLeft: 6,
            }}
          >
            Play
          </button>
        </div>
        <BackButton
          onPress={() => {
            setdownstreamVisible(false);
            setUrlVal("");
            setvideoUrl("");
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#F6F6FF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {upstreamVisible ? (
        <UpStream />
      ) : downstreamVisible ? (
        <DownStream />
      ) : (
        <Home />
      )}
    </div>
  );
}

export default App;
