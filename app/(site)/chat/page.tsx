

"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/components/Auth/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  Microscope, 
  Brain, 
  Bolt, 
  Activity 
} from 'lucide-react';

const MODEL_NAME = process.env.NEXT_PUBLIC_MODEL_NAME;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY is missing in environment variables");
}
if (!MODEL_NAME) {
  throw new Error("API_KEY is missing in environment variables");
}
// console.log(MODEL_NAME, API_KEY);


const ChatbotPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: string; text: string; timestamp: number }[]>([
    {
      role: "bot", 
      text: "Welcome to your AI Medical Assistant. I'm here to provide preliminary medical guidance. Please remember that I cannot replace a professional medical consultation. Describe your symptoms or medical concerns in detail.",
      timestamp: Date.now()
    }
  ]);

  const themes = {
    base: {
      bg: 'bg-gradient-to-br from-[#F0F4F8] via-[#E1E5F0] to-[#D1D9E6] dark:from-[#0A2342] dark:via-[#1F2041] dark:to-[#4B0082]',
      accent: 'text-[#0077BE] dark:text-[#00FFD4]',
      glow: 'shadow-[0_0_50px_rgba(0,119,190,0.3)] dark:shadow-[0_0_30px_rgba(0,255,212,0.2)]',
      border: 'border-[#0077BE]/30 dark:border-[#00FFD4]/30'
    }
  };

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user data found!");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatResponse = (response: string) => {
    let formattedResponse = response.replace(/[\*]{1,2}/g, '');
    
    const sectionPattern = /(\d+\.\s*[^0-9]+)(?=\d+\.|$)/g;
    const sections: string[] = [];
    
    let match: RegExpExecArray | null = null;
    
    while ((match = sectionPattern.exec(formattedResponse)) !== null) {
      if (match[1]) {
        sections.push(match[1].trim());
      }
    }
    
    return sections.length > 0 
      ? sections.map((section) => `${section}\n`).join('\n').trim()
      : formattedResponse;
  };


  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const basicData = userData
      ? `Patient Profile:
- Name: ${userData.name}
- Age: ${userData.age}
- Blood Group: ${userData.bloodGroup}
- Medical History: ${userData.medicalHistory}`
      : "No detailed patient history available.";

    const medicalPrompt = `You are a professional medical AI assistant. 
Provide a structured medical assessment based on the following:

${basicData}

Patient's Current Concern: ${input}

Please respond with:
1. Possible medical interpretations
2. Recommended immediate actions
3. Potential warning signs
4. Suggestion for further medical consultation if necessary

Maintain a professional, empathetic tone. Avoid diagnosing serious conditions definitively. Recommend seeing a healthcare professional for comprehensive evaluation.`;

    setMessages((prev) => [
      ...prev, 
      { 
        role: "user", 
        text: input,
        timestamp: Date.now()
      }
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: medicalPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 2048,
        }
      });

      const response = formatResponse(result.response.text());

      setMessages((prev) => [
        ...prev, 
        { 
          role: "bot", 
          text: response,
          timestamp: Date.now()
        }
      ]);
      setIsLoading(false);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "bot", 
          text: "I'm experiencing technical difficulties. Please try again or consult a healthcare professional.",
          timestamp: Date.now()
        }
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div className={`
      flex flex-col h-screen overflow-hidden
      ${themes.base.bg} ${themes.base.accent}
      transition-all duration-500 pt-25 
    `}>
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          flex justify-between items-center p-4 
          bg-black/20 dark:bg-white/10 backdrop-blur-md
        `}
      >
        <div className="flex items-center space-x-3">
          <Cpu className="w-10 h-10 animate-pulse" />
          <h1 className="text-3xl font-extralight tracking-widest uppercase">
            QUANTUM MEDICAL AI
          </h1>
        </div>
      </motion.header>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
              flex ${message.role === "user" ? "justify-end" : "justify-start"}
              relative z-10
            `}
          >
            <div 
              className={`
                max-w-[80%] p-4 rounded-2xl 
                ${message.role === "user" 
                  ? 'bg-[#0077BE]/20 dark:bg-[#00FFD4]/20 text-[#0077BE] dark:text-[#00FFD4]' 
                  : 'bg-white/20 dark:bg-black/30 text-gray-800 dark:text-white'}
                ${themes.base.glow}
                font-mono tracking-wider
              `}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <Zap className="animate-spin text-[#0077BE] dark:text-[#00FFD4]" />
            <div className="bg-white/20 dark:bg-black/30 p-3 rounded-2xl text-gray-800 dark:text-white">
              DIAGNOSTIC SCAN IN PROGRESS
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          p-4 bg-white/10 dark:bg-black/30 backdrop-blur-md
          border-t ${themes.base.border}
        `}
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="INPUT MEDICAL DIAGNOSTIC PARAMETERS"
            className={`
              flex-grow p-3 rounded-xl 
              bg-white/10 dark:bg-black/30 backdrop-blur-md
              ${themes.base.accent}
              focus:outline-none focus:ring-2
              uppercase tracking-widest
            `}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`
              p-3 rounded-full 
              ${isLoading 
                ? 'opacity-50' 
                : 'bg-[#0077BE] dark:bg-[#00FFD4] hover:opacity-80'}
              transition-all
            `}
          >
            <Bolt className="text-white dark:text-black" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatbotPage;
