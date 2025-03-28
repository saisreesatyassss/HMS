 
"use client"
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface DietItem {
  food: string;
  servingSize: string;
}
const Diet = () => {
  const [formData, setFormData] = useState({
    age: 25,
    gender: "male",
    activityLevel: "moderately-active",
    weight: 150,
    height: 68,
    goal: "lose-weight",
    allergies: "",
    likedFood: "chicken,rice,broccoli",
    dislikedFood: "fish,eggs,mushrooms",
  });
  const [dietPlan, setDietPlan] = useState("");

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyCuJ2v83jWF_zhBY7NJLLYuP78GX6veKC0";

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const generationConfig = {
      temperature: 0.1,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
 
    const parts = [
      { text:  `Generate a personalized diet plan for a ${formData.age} year old ${formData.gender}. ` +
      `Their activity level is ${formData.activityLevel}, weight is ${formData.weight} lbs, and height is ${formData.height} inches. ` +
      `Their goal is to ${formData.goal}. ` +
      `They are allergic to ${formData.allergies}. ` +
      `They like ${formData.likedFood} and dislike ${formData.dislikedFood}. ` +
      `Include a variety of foods and serving sizes. ` },
    ];

     const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
     });
 
    const response = result.response;
    // Sample response data

const formatResponse = (response: string) => {
  // Remove asterisks and clean up formatting
  let formattedResponse = response.replace(/[\*]{1,2}/g, '');
  
  // Split by numbered sections and format
  const sectionPattern = /(\d+\.\s*[^0-9]+)(?=\d+\.|$)/g;
  const sections: string[] = [];
  
  // Explicitly type the match variable
  let match: RegExpExecArray | null = null;
  
  while ((match = sectionPattern.exec(formattedResponse)) !== null) {
    // Safely access the second capture group
    if (match[1]) {
      sections.push(match[1].trim());
    }
  }
  
  // If no sections found, return original response
  return sections.length > 0 
    ? sections.map((section) => `${section}\n`).join('\n').trim()
    : formattedResponse;
};
    setDietPlan(formatResponse(response.text())); 

// // Formatted response
// const formattedResponse = formatResponse(rawResponse);

  };

  return (
    <div className="pt-20 pb-15 md:pt-40 md:pb-30 mx-10 md:mx-20 flex flex-row gap-7">
        <div className="flex flex-col w-3/4">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold text-black dark:text-white ">Personalized Diet Plan</h1>
                <p>
                  Enter your personal information and we will generate a personalized diet plan
                  tailored to your needs and goals.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-5">
                <div className="flex flex-row items-center gap-2">
                    <label htmlFor="age" className="">Age:</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="appearance-none w-fit border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500"
                    />
                </div>
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="gender" className=" form-label ">Gender:</label>
                        <select name="gender" value={formData.gender} className="appearance-none w-fit border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500" onChange={handleChange}>
                          <option value="male" className="">Male</option>
                          <option value="female" className="">Female</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="activity-level" className="">Activity Level:</label>
                        <select
                          name="activityLevel"
                          value={formData.activityLevel}
                          onChange={handleChange}
                          className="appearance-none border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500"
                        >
                          <option value="sedentary">Sedentary</option>
                          <option value="lightly-active">Lightly Active</option>
                          <option value="moderately-active">Moderately Active</option>
                          <option value="very-active">Very Active</option>
                          <option value="extremely-active">Extremely Active</option>
                        </select>
                    </div>
            
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="weight" className="">Weight (lbs):</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="appearance-none border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="height" className="form-label">Height (inches):</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          className="appearance-none border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="goal" className="form-label">Goal:</label>
                        <select name="goal" value={formData.goal} onChange={handleChange} className="appearance-none border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500">
                          <option value="lose-weight">Lose Weight</option>
                          <option value="gain-weight">Gain Weight</option>
                          <option value="maintain-weight">Maintain Weight</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="allergies" className="">Allergies (comma-separated):</label>
                        <input
                          type="text"
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleChange}
                          className="appearance-none border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="liked-food" className="form-label">Liked Foods:</label>
                        <input
                          type="text"
                          name="likedFood"
                          value={formData.likedFood}
                          onChange={handleChange}
                          className="appearance-none border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="disliked-food" className="">Disliked Foods:</label>
                        <input
                          type="text"
                          name="dislikedFood"
                          value={formData.dislikedFood}
                          onChange={handleChange}
                          className="appearance-none border border-slate-700 rounded-md py-2 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500"
                        />
                    </div>
                  </div>
            
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit">Generate Diet Plan</button>
              </form>
            </div>
        </div>
        <div className="bg-[#1c2136] border-slate-700 border rounded-md w-full p-3 whitespace-pre-wrap" >{dietPlan}</div>
    </div>
  );
};

export default Diet;
