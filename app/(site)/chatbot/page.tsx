// import BlogData from "@/components/Blog/blogData";
// import BlogItem from "@/components/Blog/BlogItem";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Blog Page  ",
//   description: "This is Blog page ",
//   // other metadata
// };

// const BlogPage = async () => {
//   return (
//     <>
//       {/* <!-- ===== Blog Grid Start ===== --> */}
//       <section className="py-20 lg:py-25 xl:py-30">
//         <div className="mx-auto mt-15 max-w-c-1280 px-4 md:px-8 xl:mt-20 xl:px-0">
//           <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
//             {BlogData.map((post, key) => (
//               <BlogItem key={key} blog={post} />
//             ))}
//           </div>
//         </div>
//       </section>
//       {/* <!-- ===== Blog Grid End ===== --> */}
//     </>
//   );
// };

// export default BlogPage;
"use client";
import React from "react";
import SectionHeader from "./SectionHeader";

import { motion } from "framer-motion";
import Image from "next/image";
const BlogPage = () => {
 const arr = ["I want to schedule an appointment with a physician","What is the cost for Prescription Drugs","I want to see someone for vision"];

  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section id="features" className="py-20 lg:py-25 xl:py-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: "Medical Assistant Chatbot",
              subtitle: "Streamlining Appointments and Medical Consultations",
              description: `Welcome to our Medical Assistant Chatbot, your one-stop solution for scheduling medical appointments, booking consultations, and receiving real-time medical assistance. Whether you need to book an appointment with a healthcare professional or seek medical advice, our chatbot is here to assist you. Say goodbye to long waiting times on the phone or struggling to find available appointments. Let our chatbot simplify your healthcare journey.`,
            }}
          />
        </div>
      </section>

            <section className="overflow-hidden pb-20 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
          <div className="flex items-center gap-8 lg:gap-32.5">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: -20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left relative mx-auto hidden aspect-[588/526.5] md:block md:w-1/2"
            >
              <Image
                src="/images/blog/chatbot.jpg"
                alt="Chatbot"
                className="dark:hidden"
                 height={600}
                 width={500}
              />
              <Image
                src="/images/blog/chatbot1.jpg"
                alt="Chatbot"
                className="hidden dark:block"
                fill
              />
          <div className='d-flex flex-column gap-3'>
            {/* <img className='img-fluid' width={550} height={250}  src={img}/> */}
            <div className=' d-flex flex-wrap gap-3 text-center '>
                {
                    arr.map((x)=>(
                        <div className='form-control'>
                            {x}
                        </div>
                    ))
                }
            </div>
        </div>
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: 20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right md:w-1/2"
            >
              <span className="font-medium uppercase text-black dark:text-white">
                <span className="mb-4 mr-4 inline-flex rounded-full bg-meta px-4.5 py-1 text-metatitle uppercase text-white ">
                  Bot
                </span>{" "}
                Medical Assistant Chatbot
              </span>
              <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                A Complete Solution for
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark">
                  Medical Support
                </span>
              </h2>
              

              
                <iframe width="500"
            height="700"
            src= "https://saisreesatyassss.github.io/test/"
            // src= "https://nextjs-zegocloud-uikits-cdgb.vercel.app/"
            title="GeeksforGeeks" > 
             </iframe> 
            </motion.div>
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default BlogPage;
