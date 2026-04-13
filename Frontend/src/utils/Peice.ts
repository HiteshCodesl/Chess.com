export const PieceMap = {
  pw: "♙",
  pb: "♟",
  rw: "♖",
  rb: "♜",
  nw: "♘",
  nb: "♞",
  bw: "♗",
  bb: "♝",
  qw: "♕",
  qb: "♛",
  kw: "♔",
  kb: "♚",
} as const;

export type PieceKey = keyof typeof PieceMap;