"use client";

import React from "react";

const ContactForm = () => {
  return (
    <form
      action="http://localhost:3000/api/submit?form_id=3mw9j9"
      method="POST"
      className="flex flex-col max-w-md mx-auto gap-4 bg-white shadow-md rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold text-center text-indigo-600">Contact Us</h2>

      <input
        name="name"
        placeholder="Name"
        required
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        name="mobile"
        placeholder="Mobile"
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <textarea
        name="remark"
        placeholder="Message"
        className="border border-gray-300 rounded-lg p-2 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      ></textarea>

      <button
        type="submit"
        className="bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-all"
      >
        Submit
      </button>
    </form>
  );
};

export default ContactForm;
