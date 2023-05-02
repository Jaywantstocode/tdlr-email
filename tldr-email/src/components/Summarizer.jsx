import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Summarizer.css";
const { Configuration, OpenAIApi } = require("openai");

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const prompt = "私はメールを読むのが嫌いなので、以下のメールでいらない部分を削って重点を\n・日時\n・内容\n・その他関係する内容\nで200文字以内で要約してください。例:Alice様 ご返信いただき、ありがとうございます。 ○○大学学園祭実行委員会のBobです。 ミーティング日時につきましては、5/11(木)15:00~ にお願いしてもよろしいでしょうか。 過去の打ち合わせや学園祭当日の流れをお聞かせいただきたく存じます。 また、こちらからゲスト担当の委員(2,3名ほど)もミーティングに)参加する予定ですが、よろしいでしょうか。 よろしくお願いいたします。\n要約:  日時: 5/11(木) 15:00~ \n内容: 過去の打ち合わせや学園祭当日の流れについて話す\nその他関係する内容: ゲスト担当の委員が2,3名ミーティングに参加予定";

  async function gpt(text) {
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt + text,
      temperature: 0,
      max_tokens: 200,
    });

    return response;
  }

  const summarizeText = async () => {
    // show loading
    setSummary("Loading...");
    try {
      const response = await gpt(text);
        console.log(response);  
      setSummary(response.data.choices[0].text.trim());
    } catch (error) {
      console.error("Error while summarizing the text: ", error);
    }
  };

  return (
    <div className="container">
        <h1>Summarizer</h1>
        <p>Currently Only Supporting Japanese</p>
      <div className="form-group">
        <label htmlFor="text">Text to Summarize</label>
        <textarea
          className="form-control"
          id="text"
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

      </div>
      <button className="btn btn-primary" onClick={summarizeText}>
        Summarize
      </button>
      
      {summary && (
        <motion.div
          className="mt-3"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.0 }}
        >
          <h3>Summary</h3>
          <div className="card">
            <div className="card-body">
                <pre>{summary}</pre>
            </div> 
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Summarizer;
