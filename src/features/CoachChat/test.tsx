import React, { useEffect, useState, useRef, useContext } from "react";
import { Message, experimental_useAssistant as useAssistant } from "ai/react";
import OpenAI from "openai";
import jszip from "jszip";
import Papa from "papaparse";
import { TbLoader3 } from "react-icons/tb";
import axios from "axios";
import { ChatBotContext } from "@/context/ChatbotContext";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

const ChatBot = (data) => {
  const [fileId, setFileId] = useState();
  const [exampleQuestion, setexampleQuestion] = useState(false);
  const {
    userThreadId,
    setUserThreadId,
    existingMessages,
    setExistingMessages,
  } = useContext(ChatBotContext);
  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    setInput,
    error,
    threadId,
  } = useAssistant({
    api: "/api/assistant",
    body: {
      fileId: fileId,
      // userThreadId,
    },
  });

  useEffect(() => {
    if (threadId) {
      setUserThreadId(threadId);
    }
  }, [threadId]);

  useEffect(() => {
    // Create a map to store existing messages by their ids
    const existingMessagesMap = new Map(
      existingMessages.map((message) => [message.id, message])
    );

    // Iterate over new messages
    messages.forEach((message) => {
      // If the message's ID exists in existingMessagesMap, replace the existing message
      if (existingMessagesMap.has(message.id)) {
        existingMessagesMap.set(message.id, message);
      } else {
        // If the message's ID doesn't exist in existingMessagesMap, add the new message
        existingMessagesMap.set(message.id, message);
      }
    });

    // Convert the map back to an array of messages
    const updatedMessages = Array.from(existingMessagesMap.values());

    // Update the state with the updated array of messages
    setExistingMessages(updatedMessages);
    setexampleQuestion(false);
  }, [messages]);

  // console.log('the messages', messages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const uploadCSVFileToOpenAI = async (csvData) => {
      try {
        const csvBlob = await new Blob([Papa.unparse(csvData ? csvData : [])], {
          type: "text/csv",
        });

        const csvFile = new File([csvBlob], "mitchfile.csv", {
          type: "text/csv",
        });

        if (!fileId) {
          const file = await openai.files.create({
            file: csvFile,
            purpose: "assistants",
          });

          setFileId(file?.id);
        }
      } catch (error) {
        console.log("error ", error);
      }
    };

    if (data?.data?.length > 0) {
      uploadCSVFileToOpenAI(data?.data);
    }
  }, [data?.data]);

  useEffect(() => {
    return async () => {
      if (fileId) {
        const file = await openai.files.del(fileId);
      }

      console.log("here");
    };
  }, [fileId]);

  useEffect(() => {
    if (exampleQuestion && input) {
      submitMessage();
    }
  }, [exampleQuestion, input]);

  useEffect(() => {
    console.log("status is ", status);
  }, [status]);

  const PreferenceSugestionButton = ({ text, active }) => {
    return (
      <div
        className={`px-[12px] mr-4 my-2  cursor-pointer w-fit py-[6px] text-[14px] leading-[18px] rounded-[6px] ${
          active
            ? "bg-[#154FFF] text-white "
            : "border border-[#D9D9D9] text-[#3B3434]"
        } `}
        onClick={async () => {
          if (fileId && status != "in_progress") {
            setInput(text);
            setexampleQuestion(true);
          }
        }}
      >
        {text}
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-20 rounded-[8px] right-0 w-full md:max-w-[700px]  bg-white border border-gray-300  shadow-lg "
      style={{ zIndex: 200 }}
    >
      {/* chat example questions */}

      {/* Chat display */}
      <div className="flex flex-col min-h-[60vh] h-full max-h-[60vh] p-4 overflow-y-auto">
        <h1 className="px-6">Some Example Questions for the Chatbot</h1>
        <div className="flex flex-wrap px-6">
          <PreferenceSugestionButton text="Why was marketing expense higher in March 2024?" />
          <PreferenceSugestionButton text="Please Identify non-recurring costs in the past twelve month period." />
          <PreferenceSugestionButton text="Create a graph of revenue over time by product/service type" />
        </div>

        {existingMessages.map((m) => (
          <div
            key={m.id}
            className={`flex mb-4 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] rounded-lg p-3 ${
                m.role === "user"
                  ? "bg-blue-500 text-white rounded-b-[8px] rounded-tl-[8px]"
                  : "bg-gray-200 rounded-b-[8px] rounded-tr-[8px]"
              }`}
            >
              {m.role != "data" ? m?.content : m?.data}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      {/* <div className='flex items-center border-t border-gray-300 p-4'>
        <input
          type='text'
          placeholder='Type your message...'
          className='flex-1 border border-gray-300 rounded p-2 mr-2'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />

        {!loading && (
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`}
            onClick={handleSendMessage}
            disabled={loading}
          >
            Send
          </button>
        )}
      </div> */}

      {status === "in_progress" && (
        <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
      )}

      <form
        onSubmit={submitMessage}
        className="flex items-center border-t border-gray-300 p-4"
      >
        {fileId && (
          <div className="flex w-full  space-x-2 justify-between items-center">
            <input
              className=" w-[80%] border border-slate-400 text-[16px] max-h-[48px] rounded-[8px] p-[12px] gap-[8px]"
              value={input}
              placeholder="Ask Questions about your financial data"
              onChange={handleInputChange}
            />

            <button
              type="submit"
              disabled={status === "in_progress"}
              className="w-[20%] px-[20px] bg-[#154FFF] my-5 text-[#F5F7F8] rounded-[12px] h-[48px] flex flex-col justify-center leading-[0.15px] items-center font-bold text-[14px]"
            >
              {status === "in_progress" ? (
                <TbLoader3 className="h-7 w-7 text-white animate-spin" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        )}

        {!fileId && (
          <div className="w-full flex justify-center ">
            <TbLoader3 className="h-7 w-7 text-[#154FFF] animate-spin" />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatBot;
