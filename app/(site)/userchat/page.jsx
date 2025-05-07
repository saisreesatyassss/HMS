"use client";

import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsResponse = await fetch(
          'https://medicalchat-backend-mongodb.vercel.app/patients/doctors-view'
        );
        if (!patientsResponse.ok) {
          console.error('Error fetching patients:', patientsResponse.status, patientsResponse.statusText);
          throw new Error(`HTTP error! Status: ${patientsResponse.status}`);
        }
        const patientsData = await patientsResponse.json();
        console.log('Patients Data:', patientsData);

        setPatients(patientsData.map(patient => ({
          id: patient.name,
          name: patient.name,
        })));
        console.log('Patients State:', patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setMessages((prev) => [
          ...prev,
          { type: 'bot', content: 'Failed to fetch patient list.', isInitial: false },
        ]);
      }
    };

    fetchPatients();
  }, []);

  const formatMedicalResponse = (data) => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    let formatted = '';
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        formatted += `${data[key]}\n`;
      }
    }
    return formatted.trim();
  };

  const handlePatientSelect = (event) => {
    const patientName = event.target.value;
    if (event.target.checked) {
      setSelectedPatients((prev) => [...prev, patientName]);
    } else {
      setSelectedPatients((prev) => prev.filter((pat) => pat !== patientName));
    }
    console.log('Selected Patients:', selectedPatients);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', content: message }]);
    setInput('');
    setIsMessageLoading(true);
    console.log('Sending message:', message, 'with selected patients:', selectedPatients);

    try {
      const patientsResponse = await fetch(
        'https://medicalchat-backend-mongodb.vercel.app/patients/doctors-view'
      );
      if (!patientsResponse.ok) {
        console.error('Error fetching patients for analysis:', patientsResponse.status, patientsResponse.statusText);
        throw new Error(`HTTP error! Status: ${patientsResponse.status}`);
      }
      const patientsData = await patientsResponse.json();
      console.log('Patients Data for Analysis:', patientsData);

      const response = await fetch(
        `https://medicalchat-tau.vercel.app/medical_analysis/${encodeURIComponent(message)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patients: patientsData, selectedDoctors: selectedPatients }),
        }
      );
      if (!response.ok) {
        console.error('Error sending analysis request:', response.status, response.statusText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Analysis Response:', data);
      const formattedContent = data.formatted_response || 'No response.';

      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: formattedContent, isInitial: false },
      ]);
    } catch (error) {
      console.error('Error processing chat:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: 'Sorry, there was an error processing your request.', isInitial: false },
      ]);
    } finally {
      setIsMessageLoading(false);
      console.log('Message processing complete, loading state:', isMessageLoading);
    }

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    console.log('Input changed:', e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className={`mt-14 font-sans flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-4 right-4 p-2 rounded-md shadow-md ${
          isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 z-10`}
      >
        {isDarkMode ? 'Light' : 'Dark'}
      </button>

      <div className="flex-grow flex flex-col md:flex-row p-4 md:p-6 gap-4">
        {/* Patient Selection Sidebar */}
        <aside className={`w-full md:w-1/3 lg:w-1/4 p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold mb-3">Select Patients</h3>
          <div className="overflow-y-auto h-64 md:h-auto">
            {patients.map((patient) => (
              <div key={patient.id} className="mb-2 flex items-center">
                <input
                  type="checkbox"
                  id={`patient-${patient.id}`}
                  value={patient.name}
                  onChange={handlePatientSelect}
                  className={`mr-2 rounded focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-blue-400 focus:ring-offset-gray-800' : 'border-gray-300 text-blue-600'}`}
                />
                <label htmlFor={`patient-${patient.id}`} className="text-sm">{patient.name}</label>
              </div>
            ))}
            {patients.length === 0 && <p className="text-sm text-gray-500">No patients available.</p>}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-grow flex flex-col rounded-md shadow-md overflow-hidden">
          <div className={`bg-gray-100 p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'border-gray-200'}`}>
            <h2 className="text-xl font-semibold">Chat</h2>
          </div>
          <div ref={chatContainerRef} className={`flex-grow overflow-y-auto p-4 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 p-3 rounded-lg break-words max-w-3/4 shadow-sm ${
                  msg.type === 'user'
                    ? isDarkMode ? 'bg-green-700 text-gray-100 self-end' : 'bg-green-100 text-gray-800 self-end'
                    : isDarkMode ? 'bg-gray-700 text-gray-100 self-start' : 'bg-gray-200 text-gray-800 self-start'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isMessageLoading && <div className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Loading...</div>}
          </div>
          <div className={`p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                rows={1}
                className={`flex-grow p-3 rounded-md border ${
                  isDarkMode ? 'border-gray-700 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatInterface;