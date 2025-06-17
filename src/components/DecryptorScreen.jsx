import React, { useState } from 'react';

/**
 * Decryptor utility supporting Caesar and Base64 ciphers.
 */
const DecryptorScreen = () => {
  const [method, setMethod] = useState('caesar');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const decrypt = () => {
    if (method === 'base64') {
      try {
        setOutput(atob(input));
      } catch {
        setOutput('Invalid base64');
      }
    } else {
      const shift = 3;
      const result = input.replace(/[a-z]/gi, (c) => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(
          ((c.charCodeAt(0) - base - shift + 26) % 26) + base
        );
      });
      setOutput(result);
    }
  };

  return (
    <div className="p-4 space-y-2" data-testid="decryptor-screen">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="bg-gray-800 border border-green-500/30 rounded p-1"
      >
        <option value="caesar">Caesar</option>
        <option value="base64">Base64</option>
      </select>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ciphertext"
        className="w-full h-20 bg-gray-800 border border-green-500/30 rounded p-1"
      />
      <button
        onClick={decrypt}
        className="border border-green-500 text-green-400 rounded px-3 py-1"
      >
        Decrypt
      </button>
      {output && <div className="text-green-400 break-words">{output}</div>}
    </div>
  );
};

export default DecryptorScreen;
