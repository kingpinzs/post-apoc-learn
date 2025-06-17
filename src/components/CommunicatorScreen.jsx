import React, { useState } from 'react';

/**
 * Simple encrypted messaging interface. Players can send messages and attempt
 * to decrypt intercepted transmissions using a basic ROT13 cipher.
 */
const CommunicatorScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState('');

  const intercepted = 'Guvf vf n frperg zrffntr';

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), text: input }]);
    setInput('');
  };

  const decode = () => {
    const rot13 = (str) =>
      str.replace(/[A-Za-z]/g, (c) =>
        "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm"[
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c)
        ]
      );
    setDecoded(rot13(intercepted));
  };

  return (
    <div className="p-4 space-y-4" data-testid="communicator-screen">
      <div className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type encoded message"
          className="w-full h-20 bg-gray-800 border border-green-500/30 rounded p-1"
        />
        <button
          onClick={sendMessage}
          className="border border-green-500 text-green-400 rounded px-3 py-1"
        >
          Send
        </button>
      </div>
      {messages.length > 0 && (
        <div className="space-y-1 text-green-400" data-testid="message-log">
          {messages.map((m) => (
            <div key={m.id}>&gt; {m.text}</div>
          ))}
        </div>
      )}
      <div className="space-y-2" data-testid="intercepted">
        <div className="text-green-200">Intercepted: {intercepted}</div>
        <button
          onClick={decode}
          className="border border-green-500 text-green-400 rounded px-3 py-1"
        >
          Decrypt
        </button>
        {decoded && <div className="text-green-400">{decoded}</div>}
      </div>
    </div>
  );
};

export default CommunicatorScreen;
