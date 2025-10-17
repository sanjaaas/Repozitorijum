import React from 'react';

export default function PromoBanner({ onSve, onKategorije, onAkcija }) {
  return (
    <>
      <button onClick={onSve}>Sve knjige</button>
      <button onClick={onKategorije}>Kategorije</button>
      <button onClick={onAkcija}>Akcija</button>
    </>
  );
}