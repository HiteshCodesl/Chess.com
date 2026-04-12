import { useEffect, useState } from "react"
import { Chess } from "chess.js"
import { useSocketContext } from "../../context/useSocketContext";
import { toast } from "sonner";
import Square from "./Square";

const game = new Chess();

function Board() {
  const socket = useSocketContext();
  const [board, setBoard] = useState(game.board());
  const [gameId, setGameId] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  console.log("Inside the board");
  console.log("Socket inside Board", socket);

  useEffect(() => {
      console.log("Inside useEffect");
    
    if(!socket){
      console.log("websocket is not Availble")
      return;
    }

   socket.onmessage = (event) => {
    console.log("Inside Message Handler in Board");
    const message = JSON.parse(event.data);

    console.log("Message from The Websocket", message);
    if(message.type === "INIT_JOIN"){
        game.reset();
        setBoard([...game.board()]);
    }

    if(message.type === "matchfound"){
      //send a notification
      console.log(message);
      setGameId(message.gameId);
      toast(`Your color: ${message.color}`);
      console.log(message.event);
    }

    if(message.type === "MOVE"){
      game.move({
        from: message.from,
        to: message.to
      })

      setBoard([...game.board()]);
    }

   }
  }, [socket]);

  function handleClick(square: string){
     if(!selected){
      setSelected(square);
      return;
     }

     socket?.send(JSON.stringify({
        "type" :  "MOVE",
        "data": {
          "from" : selected,
          "to" : square,
          "gameId": gameId,
          "ws": socket
        }
     }))

     setSelected(null);
  }

  return (
    <div className="grid grid-cols-8 w-[550px] h-[400px]">
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