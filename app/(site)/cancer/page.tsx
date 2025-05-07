"use client";

import React from 'react';
import { Button } from '@/components/Button/Button'; // Assuming you have shadcn/ui
import { motion } from 'framer-motion';

const CancerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black flex flex-col">
      {/* Introduction Section */}
      <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center gap-8">
        <div className="md:w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Understanding Cancer
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
            Cancer is a major global health challenge, but knowledge is power.  This page provides key information about
            cancer, its causes, prevention, and treatment.  We aim to empower you with the latest findings and resources.
          </p>
        </div>
        <div className="w-full">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src="https://as2.ftcdn.net/v2/jpg/01/95/27/65/1000_F_195276507_HdfUKAigcJMIfmyDWiqCPGajmss7hcIo.jpg"
            alt="Cancer Cells"
            className="rounded-xl shadow-2xl w-full max-w-4xl mx-auto border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Cancer Information Section */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">What is Cancer?</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Cancer is not a single disease, but a group of diseases characterized by the uncontrolled growth and spread
              of abnormal cells.  These cells can invade and damage surrounding tissues, forming tumors.  If the spread is
              not controlled, it can be fatal.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Causes and Risk Factors</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-lg space-y-3">
              <li><strong>Genetic Mutations:</strong> Changes in DNA can be inherited or acquired.</li>
              <li><strong>Carcinogens:</strong> Exposure to substances like tobacco smoke, radiation, and certain chemicals.</li>
              <li><strong>Lifestyle Factors:</strong> Diet, lack of exercise, obesity, and excessive alcohol consumption.</li>
              <li><strong>Infections:</strong> Some viruses and bacteria can increase cancer risk.</li>
              <li><strong>Age:</strong> The risk of cancer increases with age.</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Prevention and Early Detection</h2>
            <ul className="list-check list-inside text-gray-700 dark:text-gray-300 text-lg space-y-3">
              <li><strong>Healthy Lifestyle:</strong> Balanced diet, regular exercise, and maintaining a healthy weight.</li>
              <li><strong>Avoid Tobacco:</strong> Smoking is a leading cause of many cancers.</li>
              <li><strong>Vaccinations:</strong> Vaccines can prevent some virus-related cancers (e.g., HPV).</li>
              <li><strong>Regular Check-ups:</strong> Screenings and early detection tests can catch cancer early.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Advances in Treatment</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Cancer treatment has advanced significantly.  Options include surgery, chemotherapy, radiation therapy,
              targeted therapy, immunotherapy, and hormone therapy.  Personalized medicine is tailoring treatments to
              individual patients.
            </p>
          </div>
        </div>
      </div>

      {/* Redirect Button */}
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
       <button
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-12 py-4 rounded-full shadow-lg transition-all duration-300 text-xl font-semibold"
            onClick={() => window.open("https://cancer-keras.streamlit.app/", "_blank", "noopener,noreferrer")}
            >
            Explore Cancer Prediction App
            </button>

        </motion.div>
      </div>
      <style jsx global>{`
        .list-check {
          list-style-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/><path d="m9 12 2 2 4-4"/></svg>');
        }
        .list-disc {
            list-style-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Ccircle cx='4' cy='4' r='4' fill='%23000000' /%3E%3C/svg%3E");
        }
        .dark .list-disc {
            list-style-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Ccircle cx='4' cy='4' r='4' fill='%23FFFFFF' /%3E%3C/svg%3E");
        }
        .list-inside {
          padding-left: 0;
        }
        .list-inside li {
          padding-left: 0.5em;
        }
      `}</style>
    </div>
  );
};

export default CancerPage;
