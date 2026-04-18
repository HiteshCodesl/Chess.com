import { useContext, useEffect, useState } from "react"
import { Chess } from "chess.js"
import { SocketContext } from "../../context/useSocketContext";
import { toast } from "sonner";
import Square from "./Square";

function Board() {
  const socket = useContext(SocketContext);
  const [board, setBoard] = useState(() => new Chess().board());
  const [gameId, setGameId] = useState("");
  const [game, setGame] = useState<Chess | null>(null);
  const [playerRole, setPlayerRole] = useState<'w' | 'b'>();
  const [selected, setSelected] = useState<string | null>(null);

  console.log("Inside the board");
  console.log("GameId", gameId)
  console.log("Current player Move", playerRole);

  useEffect(() => {
  if (!socket) return;
  console.log("Render Board", board);

  const handler = (event: MessageEvent) => {
    const message = JSON.parse(event.data);

    console.log("MESSAGE:", message);

    if (message.event === "INIT_JOIN") {
      const newGame = new Chess();
      setGame(newGame);
      setBoard(newGame.board());
      setPlayerRole(message.turn);
    }

    if(message.event === "MATCH_RESUMED"){
        const newGame = new Chess(message.fen);
        setGameId(message.gameId);
        setGame(newGame);
        setPlayerRole(message.turn);
      const newBoard = newGame.board();

      console.log("NEW BOARD:", newBoard);
      
      setBoard(newGame.board());
    }

    if (message.event === "MATCH_FOUND") {
      setGameId(message.gameId);
      setPlayerRole(message.turn);
      toast(`Match Found, Your Role : ${message.role}`, {
        position: "top-center",
      });
    }

    if (message.event === "MOVE") {
      console.log("FEN:", message.fen);

      const newGame = new Chess(message.fen);
      const newBoard = newGame.board();
      setGame(newGame);
      setPlayerRole(message.turn);

      console.log("NEW BOARD:", newGame);
      
      setBoard(newBoard.map(row => [...row]));  
 }
  };

  socket.addEventListener("message", handler);

  return () => {
    socket.removeEventListener("message", handler);
  };
}, [socket]);


  function handleClick(square: string){
    if(!game) return;
     if(!selected){
        setSelected(square);
      return;
     }

     const turn = game.turn();

  if (
    (turn === "w" && playerRole !== "w") ||
    (turn === "b" && playerRole !== "b")
  ) {
    toast("Not your turn");
    setSelected(null);
    return;
  }

     socket?.send(JSON.stringify({
        "type" :  "MOVE",
        "data": {
          "from" : selected,
          "to" : square,
          "gameId": gameId,
        }
     }))

     setSelected(null);
  }

  return (
    <div className="grid grid-cols-8 w-[500px] h-[500px]">
      {board.map((row, i) =>
        row.map((square, j) => {
          const squareName =
            String.fromCharCode(97 + j) + (8 - i);

          return (
            <Square
              key={squareName}
              piece={square}
              square={squareName}
              onClick={handleClick} 
            />
          );
        })
      )}
    </div>
  )
}

export default Board