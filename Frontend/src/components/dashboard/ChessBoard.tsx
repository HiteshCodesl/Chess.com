import { IoFlash } from "react-icons/io5";
import { LiaRobotSolid } from "react-icons/lia";
import { IoPeople } from "react-icons/io5";
import { FaChessKnight } from "react-icons/fa6";
import { useSocketContext } from "../../context/useSocketContext";
import getUserDetails from "../../context/getUserDetailsContext";


function ChessBoard() {
  const socket = useSocketContext();
  const {user}  = getUserDetails();
 console.log(user);
  return (
    <div className="min-h-screen flex justify-center bg-[#302f2c]">

      <div className="w-full max-w-6xl grid grid-cols-3 gap-6 p-6">

        <div className="col-span-2 bg-[#302f2c]">

        </div>

        <div className="col-span-1 bg-[#262522] flex flex-col gap-4 p-4">
          <div className="text-center text-2xl mb-4 text-white font-bold flex items-center gap-3"><FaChessKnight size={40} color='white' /> Play Chess</div>
          <button onClick={() => {
            console.log("Join Room Message Sent")
            socket?.send(JSON.stringify({
              "type": "INIT_JOIN",
              "data": {
                "id": user?.id,
                "name": user?.username
              }
            }))
          }} className="bg-[#383734] text-white gap-3 font-semibold text-xl py-4 p-3 rounded flex items-center">
            <IoFlash size={40} color='yellow' /> Play Online
          </button>
          <button className="bg-[#383734] text-white font-semibold text-xl py-4 p-3 rounded flex items-center gap-2">
            <LiaRobotSolid size={40} color="yellow" /> Play With Bots
          </button>
          <button className="bg-[#383734] gap-3 text-white font-semibold text-xl py-4 p-3 rounded flex items-center">
            <IoPeople size={40} color="yellow" /> Play With Freinds
          </button>
        </div>

      </div>
    </div>
  )
}

export default ChessBoard