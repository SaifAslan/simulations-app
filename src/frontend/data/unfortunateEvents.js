// data/unfortunateEvents.js
const unfortunateEvents = {
    'Arts District': [
      { name: 'Art Festival Cancellation', probability: 0.05, deduction: 0.8 }, // Catastrophic
      { name: 'Street Closure', probability: 0.1, deduction: 0.3 } // Less severe
    ],
    'Downtown': [
      { name: 'Major Power Outage', probability: 0.05, deduction: 0.85 }, // Catastrophic
      { name: 'Unexpected Rain', probability: 0.1, deduction: 0.25 } // Less severe
    ],
    'Train station': [
      { name: 'Train Strike', probability: 0.05, deduction: 0.9 }, // Catastrophic
      { name: 'Delayed Trains', probability: 0.1, deduction: 0.35 } // Less severe
    ],
    'City Market': [
      { name: 'Market Fire', probability: 0.05, deduction: 0.8 }, // Catastrophic
      { name: 'Vendor Dispute', probability: 0.1, deduction: 0.2 } // Less severe
    ],
    'University': [
      { name: 'Campus Lockdown', probability: 0.05, deduction: 0.95 }, // Catastrophic
      { name: 'Exam Period', probability: 0.1, deduction: 0.3 } // Less severe
    ],
    'Beach': [
      { name: 'Oil Spill', probability: 0.05, deduction: 0.85 }, // Catastrophic
      { name: 'Jellyfish Invasion', probability: 0.1, deduction: 0.25 } // Less severe
    ]
  };
  
  export default unfortunateEvents;