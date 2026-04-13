import { PieceMap, type PieceKey } from "../../utils/Peice"; // adjust path

function Square({ piece, square, onClick }: any) {
  const isBlack =
    (square.charCodeAt(0) + Number(square[1])) % 2 === 0;

  return (
    <div
      onClick={() => onClick(square)}
      className={`w-16 h-16 flex items-center justify-center text-5xl ${
        isBlack ? "bg-green-700" : "bg-white"
      }`}
    >
      {piece ? PieceMap[`${piece.type}${piece.color}` as PieceKey] : null}
    </div>
  );
}

export default Square;