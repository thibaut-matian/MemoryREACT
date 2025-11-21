import {useEffect, useState } from 'react'
import Title from './components/Title'  
import Button from './components/Button'
import Card from './components/Card'
import './App.css'

function App() {
  // 1. Ta liste d'images
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

  // 2. Fonction pour créer le plateau de jeu (Mélangé !)
  const generateDeck = () => {
    const deck = [...images, ...images]
    
    // Le mélange
    const shuffledDeck = deck.sort(() => Math.random() - 0.5) 

    // La création des objets cartes
    return shuffledDeck.map((img, index) => ({
      id: index,
      image: img,
      isFlipped: false,
      isMatched: false 
    }))
  }

  // 3. LES STATES (Mémoires du jeu)
  const [cards, setCards] = useState(generateDeck())
  const [choiceOne, setChoiceOne] = useState(null) // Choix 1
  const [choiceTwo, setChoiceTwo] = useState(null) // Choix 2


  const handleRestart = () => {
    setChoiceOne(null) 
    setChoiceTwo(null)
    setCards(generateDeck()) 
    console.log("Nouvelle partie lancée !");
  }


  const handleCardClick = (card) => {
    if (choiceOne && choiceTwo || card.isFlipped) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    
    setCards(prevCards => {
      return prevCards.map(c => {
        if (c.id === card.id) {
          return { ...c, isFlipped: true }
        }
        return c
      })
    })
  }

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(prevCards => {
      return prevCards.map(card => {
        // Si la carte est validée (matched), on ne touche à rien.
        if (card.isMatched) {
          return card 
        } else {
          // Sinon, on la retourne face cachée.
          return { ...card, isFlipped: false }
        }
      })
    })
  }

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      
      // CAS 1 : Les images sont identiques 
      if (choiceOne.image === choiceTwo.image) {
        console.log("Bravo ! Paire trouvée")
        
        // On met à jour le tableau pour dire que ces cartes sont "matchées" (validées)
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.image === choiceOne.image) {
              return { ...card, isMatched: true }
            }
            return card
          })
        })
        
        resetTurn()
        
      } else {
        // CAS 2 : Les images sont différentes (RATE !)
        console.log("Raté...")
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  return (
    <div className="App">
      <Title text="One Piece Memory" />
      
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

      <Button text="Nouvelle partie" action={handleRestart} />
    </div>
  )
}

export default App