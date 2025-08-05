// data/fortunateEvents.js
const fortunateEvents = {
    'Arts District': [
      { name: 'Local Art Festival', probability: 0.05, increase: 0.2 }, // fortunate
      { name: 'Celebrity Endorsement', probability: 0.1, increase: 0.5 } // very fortunate
    ],
    'Downtown': [
      { name: 'Tech Conference', probability: 0.05, increase: 0.25 }, // fortunate 
      { name: 'Corporate Event', probability: 0.1, increase: 0.6 } // very fortunate
    ],
    'Train station': [
      { name: 'Train Delay', probability: 0.05, increase: 0.2 }, // fortunate
      { name: 'Free Transit Day', probability: 0.1, increase: 0.55 } // very furtunate
    ],
    'City Market': [
      { name: 'Farmers Market Day', probability: 0.05, increase: 0.15 }, // fortunate 
      { name: 'Food Festival', probability: 0.1, increase: 0.45 } // very fortunate
    ],
    'University': [
      { name: 'Sports Event', probability: 0.05, increase: 0.2 }, // fortunate
      { name: 'Graduation Ceremony', probability: 0.1, increase: 0.65 } // very fortunate
    ],
    'Beach': [
      { name: 'Beach Cleanup Day', probability: 0.05, increase: 0.1 }, // fortunate
      { name: 'Summer Festival', probability: 0.1, increase: 0.5 } // very fortunate
    ]
  };
  
  export default fortunateEvents;