// src/app/components/MemoryGame.tsx

"use client"; // Asegúrate de que esto esté presente para habilitar el cliente de React

import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClfqH7KFyKAsTVhlU6CK8FYfk6umrUvRE",
  authDomain: "memorama-9f1c0.firebaseapp.com",
  projectId: "memorama-9f1c0",
  storageBucket: "memorama-9f1c0.appspot.com",
  messagingSenderId: "668917619120",
  appId: "1:668917619120:web:9ec19ce3068b9fff841e75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cardNames = ['Calavera', 'Cempasúchil', 'Pan de Muerto', 'Ofrenda'];

interface MemoryCardProps {
  cardName: string;
  isFlipped: boolean;
  onClick: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ cardName, isFlipped, onClick }) => {
  return (
    <div
      className={`w-24 h-32 border-2 border-gray-500 flex items-center justify-center cursor-pointer ${
        isFlipped ? 'bg-white' : 'bg-purple-500'
      }`}
      onClick={onClick}
    >
      {isFlipped ? <span>{cardName}</span> : <span>?</span>}
    </div>
  );
};

const MemoryGame: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [scores, setScores] = useState<{ name: string; time: number }[]>([]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (startTime && !endTime) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (endTime && timerInterval) {
      clearInterval(timerInterval);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [startTime, endTime]);

  useEffect(() => {
    shuffleCards();
    fetchScores(); // Carga los puntajes al iniciar
  }, []);

  const shuffleCards = () => {
    const shuffled = [...cardNames, ...cardNames]
      .sort(() => Math.random() - 0.5)
      .map((name) => name);
    setCards(shuffled);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2) return;

    setFlippedCards((prev) => [...prev, index]);

    if (flippedCards.length === 1) {
      const firstIndex = flippedCards[0];
      const secondIndex = index;

      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedCards((prev) => [...prev, cards[firstIndex]]);
      }

      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }

    if (matchedCards.length === cards.length / 2 - 1 && flippedCards.length === 1) {
      const now = new Date();
      setEndTime(now);
      setGameWon(true);

      // Guardar el puntaje del jugador
      if (startTime) {
        const completionTime = (now.getTime() - startTime.getTime()) / 1000; // tiempo en segundos
        const newScore = { name: playerName, time: completionTime };
        console.log("Guardando nuevo puntaje:", newScore); // Añadido para depuración
        saveScore(newScore); // Guarda el puntaje en Firestore
      }
    }
  };

  const handleStartGame = () => {
    setStartTime(new Date());
    setEndTime(null);
    setGameWon(false);
    setMatchedCards([]);
    shuffleCards();
    setTimer(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const saveScore = async (score: { name: string; time: number }) => {
    try {
      const scoresCollection = collection(db, "scores");
      await addDoc(scoresCollection, score);
      console.log("Puntaje guardado exitosamente"); // Añadido para depuración
      fetchScores(); // Recargar puntajes después de guardar
    } catch (error) {
      console.error("Error al guardar el puntaje: ", error);
    }
  };

  const fetchScores = async () => {
    try {
      const scoresCollection = collection(db, "scores");
      const scoresSnapshot = await getDocs(scoresCollection);
      const scoresList = scoresSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Puntaje recuperado:", data); // Añadido para depuración
        return { id: doc.id, name: data.name, time: data.time }; // Asegúrate de extraer correctamente los datos
      }) as { name: string; time: number }[];
      
      console.log("Lista de puntajes:", scoresList); // Añadido para depuración
      setScores(scoresList.sort((a, b) => a.time - b.time)); // Ordenar por tiempo
    } catch (error) {
      console.error("Error al recuperar los puntajes: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-3xl font-bold mb-4">Juego de Memoria - Día de Muertos</h1>

      {startTime ? (
        <>
          <div className="mb-4">
            <p className="text-xl">Jugador: {playerName}</p>
            <p>¡Empieza a hacer coincidir las cartas!</p>
            <p>Tiempo: {timer} segundos</p> {/* Temporizador */}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <MemoryCard
                key={index}
                cardName={card}
                isFlipped={flippedCards.includes(index) || matchedCards.includes(card)}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
          {gameWon && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">¡Ganaste!</h2>
              <p>Tiempo total: {timer} segundos</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleStartGame}
              >
                Jugar otra vez
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={playerName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleStartGame}
          >
            Iniciar Juego
          </button>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Puntajes</h2>
        {scores.length === 0 ? (
          <p>No hay puntajes disponibles.</p>
        ) : (
          <ul>
            {scores.map((score) => (
              <li key={score.name} className="flex justify-between">
                <span>{score.name}</span>
                <span>{score.time} segundos</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
