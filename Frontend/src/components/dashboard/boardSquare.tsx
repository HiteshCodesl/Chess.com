import { PieceMap } from "../../utils/Peice";
export default  function BoardSquare({ piece, square, onClick, isPossibleMove, isSelected }: any) {
  const isBlack = (square.charCodeAt(0) + Number(square[1])) % 2 === 0;

  return (
    <div
      onClick={() => onClick(square)}
      className={`relative flex items-center justify-center text-5xl w-16 h-16 ${
        isSelected
          ? "bg-yellow-400"
          : isBlack
          ? "bg-green-700"
          : "bg-white"
      }`}
    >
      {/* Dot for empty squares, ring for capturable pieces */}
      {isPossibleMove && !piece && (
        <div className="absolute w-4 h-4 rounded-full bg-black/30 pointer-events-none z-10" />
      )}
      {isPossibleMove && piece && (
        <div className="absolute inset-0 border-4 border-black/30 rounded-sm pointer-events-none z-10" />
      )}

{piece ? PieceMap[`${piece.type}${piece.color}` as keyof typeof PieceMap] : null}
    </div>
  );
}