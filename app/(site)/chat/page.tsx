 
// "use client";
// import { useState, useEffect } from "react";
// import { auth, db } from "@/components/Auth/firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const MODEL_NAME = "gemini-pro";
// const API_KEY = "AIzaSyDcYKeMNWinAMk4GHGaN-WuhLsDMltRHds";

// const ChatbotPage = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<any>(null);
//   const [messages, setMessages] = useState<{ role: string; text: string }[]>([
//     {
//       role: "bot", 
//       text: "Welcome to your AI Medical Assistant. I'm here to provide preliminary medical guidance. Please remember that I cannot replace a professional medical consultation. Describe your symptoms or medical concerns in detail."
//     }
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);

//         // Fetch user data
//         const docRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setUserData(docSnap.data());
//         } else {
//           console.log("No user data found!");
//         }
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

// // Function to format Gemini AI response
// const formatResponse = (response: string) => {
//   // Remove all asterisk markers (single and double)
//   let formattedResponse = response.replace(/[\*]{1,2}/g, '');
  
//   // Replace newline-like patterns with actual newlines
//   formattedResponse = formattedResponse.replace(/(\n|\r\n|\r)/g, '\n')
//     .split(/(\n|(?<=\.)\s+)/)
//     .map(line => line.trim())
//     .filter(line => line.length > 0)
//     .join('\n');
  
//   return formattedResponse;
// };

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//     // Prepare patient context
//     const basicData = userData
//       ? `Patient Profile:
// - Name: ${userData.name}
// - Age: ${userData.age}
// - Blood Group: ${userData.bloodGroup}
// - Medical History: ${userData.medicalHistory}`
//       : "No detailed patient history available.";

//     // More structured medical prompt
//     const medicalPrompt = `You are a professional medical AI assistant. 
// Provide a structured medical assessment based on the following:

// ${basicData}

// Patient's Current Concern: ${input}

// Please respond with:
// 1. Possible medical interpretations
// 2. Recommended immediate actions
// 3. Potential warning signs
// 4. Suggestion for further medical consultation if necessary

// Maintain a professional, empathetic tone. Avoid diagnosing serious conditions definitively. Recommend seeing a healthcare professional for comprehensive evaluation.`;

//     // Update messages and clear input
//     setMessages((prev) => [...prev, { role: "user", text: input }]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const result = await model.generateContent({
//         contents: [{ role: "user", parts: [{ text: medicalPrompt }] }],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.9,
//           maxOutputTokens: 2048,
//         }
//       });

//     //   const response = formatResponse(result.response.text());
//       const response = formatResponse(result.response.text());

//       setMessages((prev) => [
//         ...prev, 
//         { role: "bot", text: response }
//       ]);
//       setIsLoading(false);

//     } catch (error) {
//       console.error(error);
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", text: "I'm experiencing technical difficulties. Please try again or consult a healthcare professional." }
//       ]);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen p-4">
//       <h1 className="text-2xl font-semibold mb-4">AI Medical Assistant</h1>
//       <div className="flex-grow overflow-y-auto p-4 border rounded-lg bg-gray-100">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`p-2 my-2 rounded-lg ${
//               message.role === "user"
//                 ? "bg-blue-500 text-white self-end"
//                 : "bg-gray-200 text-black self-start"
//             }`}
//           >
//             {message.text}
//           </div>
//         ))}
//         {isLoading && (
//           <div className="p-2 my-2 rounded-lg bg-gray-200 text-black self-start">
//             Processing your request...
//           </div>
//         )}
//       </div>
//       <div className="mt-4 flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Describe your symptoms or medical concerns..."
//           className="flex-grow p-2 border rounded-lg mr-2"
//           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//         />
//         <button
//           onClick={handleSendMessage}
//           disabled={isLoading}
//           className={`px-4 py-2 text-white rounded-lg ${
//             isLoading ? 'bg-gray-400' : 'bg-green-500'
//           }`}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatbotPage;

"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/components/Auth/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyDcYKeMNWinAMk4GHGaN-WuhLsDMltRHds";

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
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data
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
  // Advanced response formatter
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
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Prepare patient context
    const basicData = userData
      ? `Patient Profile:
- Name: ${userData.name}
- Age: ${userData.age}
- Blood Group: ${userData.bloodGroup}
- Medical History: ${userData.medicalHistory}`
      : "No detailed patient history available.";

    // More structured medical prompt
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

    // Update messages and clear input
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
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">AI Medical Assistant</h1>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div 
              className={`
                max-w-[80%] p-3 rounded-lg 
                ${message.role === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white text-gray-800 border"}
              `}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-3 rounded-lg border">
              <p>Typing...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your medical concern..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg text-white transition-colors 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;