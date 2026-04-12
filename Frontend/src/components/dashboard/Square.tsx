
function Square({piece, square, onClick}:any) {
    const isBlack = (square.charCodeAt(0) + Number(square[1])) % 2 === 0;

  return (
    <div
      onClick={() => onClick(square)}
      className={`w-18 h-14 flex items-center justify-center ${
        isBlack ? "bg-green-700" : "bg-white"
      }`}
    >
      {piece && piece.type}
    </div>
  )
}

export default Square