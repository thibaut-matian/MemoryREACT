import './Card.css'
export default function Card({ image, emoji, isFlipped, action }) {
  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''}`} 
      onClick={action}
    >
      <div className="card-content">
        {isFlipped ? (
          image ? (
            <img src={image} alt="Memory card" className="card-image" />
          ) : (
            emoji
          )
        ) : (
          "?"
        )}
      </div>
    </div>
  )
}