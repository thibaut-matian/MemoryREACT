import {useEffect, useState } from 'react'
import Title from './components/Title'  
import Button from './components/Button'
import Card from './components/Card'
import './App.css'

function App() {
  // 1. Ta liste d'images complète
  const images = [
    "/img/Monkey_D_Luffy.png",
    "/img/Roronoa_Zoro.png",
    "/img/Nami_face.png",
    "/img/Sanji.png",
    "/img/Nico_Robin_3Fe_de_27_ans.png",
    "/img/boa.png",
    "/img/kuma.png",
    "/img/Newgate.png",
    "/img/Marshall_D._Teach_Anime_Post_Ellipse_Infobox.png",
    "/img/Kaidou_Anime_Infobox.png",
    "/img/Rocks.png",
    "/img/kizaru.png"
  ];

  // 2. State pour le nombre de paires
  const [numberOfPairs, setNumberOfPairs] = useState(4);

  // 3. State pour la victoire
  const [gameWon, setGameWon] = useState(false);
  const [showVictoryMessage, setShowVictoryMessage] = useState(false);

  // 4. Fonction pour créer le plateau de jeu avec un nombre donné de paires
  const generateDeck = (pairs = numberOfPairs) => {
    const selectedImages = images.slice(0, pairs);
    const deck = [...selectedImages, ...selectedImages];
    const shuffledDeck = deck.sort(() => Math.random() - 0.5);

    return shuffledDeck.map((img, index) => ({
      id: index,
      image: img,
      isFlipped: false,
      isMatched: false 
    }));
  };

  const [cards, setCards] = useState(generateDeck());
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);

  const playVictorySound = () => {
    const audio = new Audio('/sounds/victory.mp3'); 
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.log('Erreur lors de la lecture du son:', error);
    });
  };

  const handlePairsChange = (newPairsCount) => {
    setNumberOfPairs(newPairsCount);
    setChoiceOne(null);
    setChoiceTwo(null);
    setGameWon(false);
    setShowVictoryMessage(false);
    setCards(generateDeck(newPairsCount));
  };

  const handleRestart = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setGameWon(false);
    setShowVictoryMessage(false);
    setCards(generateDeck());
    console.log(`Nouvelle partie lancée avec ${numberOfPairs} paires !`);
  };

  const handleCardClick = (card) => {
    if (choiceOne && choiceTwo || card.isFlipped || gameWon) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    
    setCards(prevCards => {
      return prevCards.map(c => {
        if (c.id === card.id) {
          return { ...c, isFlipped: true };
        }
        return c;
      });
    });
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.isMatched) {
          return card;
        } else {
          return { ...card, isFlipped: false };
        }
      });
    });
  };

  const checkVictory = (updatedCards) => {
    const allMatched = updatedCards.every(card => card.isMatched);
    if (allMatched && !gameWon) {
      setGameWon(true);
      setShowVictoryMessage(true);
      playVictorySound();
      console.log(" VICTOIRE ! Toutes les paires ont été trouvées !");
      
      setTimeout(() => {
        setShowVictoryMessage(false);
      }, 4000);
    }
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.image === choiceTwo.image) {
        console.log("Bravo ! Paire trouvée");
        
        setCards(prevCards => {
          const updatedCards = prevCards.map(card => {
            if (card.image === choiceOne.image) {
              return { ...card, isMatched: true };
            }
            return card;
          });
          
          checkVictory(updatedCards);
          
          return updatedCards;
        });
        
        resetTurn();
        
      } else {
        console.log("Raté...");
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo, gameWon]);
  return (
    <div className="App">
      <Title text="One Piece Memory" />
      
      {/* Sélecteur du nombre de paires */}
      <div className="difficulty-selector">
        <h3>Nombre de paires :</h3>
        <div className="difficulty-buttons">
          {[4, 6, 8, 10, 12].map(pairs => (
            <button 
              key={pairs}
              className={`difficulty-btn ${numberOfPairs === pairs ? 'active' : ''}`}
              onClick={() => handlePairsChange(pairs)}
              disabled={gameWon}
            >
              {pairs}
            </button>
          ))}
        </div>
      </div>

      {/* Message de victoire */}
      {showVictoryMessage && (
        <div className="victory-message">
          <div className="victory-content">
            <h2> FÉLICITATIONS ! </h2>
            <p>Vous avez trouvé toutes les {numberOfPairs} paires !</p>
            <p>Excellent travail, Nakama ! </p>
          </div>
        </div>
      )}
      
      <div className="cards-grid">
         {cards.map((card) => (
           <Card 
             key={card.id} 
             image={card.image} 
             isFlipped={card.isFlipped} 
             action={() => handleCardClick(card)} 
           />
         ))}
      </div>

      <Button 
        text={gameWon ? "Nouvelle partie" : "Recommencer"} 
        action={handleRestart} 
      />
      
      {gameWon && (
        <p className="victory-text">
          🏆 Partie terminée en {numberOfPairs} paires ! 🏆
        </p>
      )}
    </div>
  );
}

export default App;