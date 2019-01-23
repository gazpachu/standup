import React from 'react';

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>The Standup app aims at solving some of the challenges of running Scrum standup sessions remotely. At the same time, it helps to make the experience more interactive and fun!</p>
      <p>The app uses a technology called WebRTC to reproduce a videoconference interface similar to Google Hangouts. In the back-end, a service provider called Xirsys, and a signalling server called SignalMaster help to overcome common network hickups like NATs, Firewalls and VPNs.</p>
      <p>The app is currently under development but we hope to arrive to a point where it could be used in production mode. Stay tuned!</p>
    </div>
  );
}
