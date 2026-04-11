import { useNavigate } from 'react-router-dom'

function LandingPage() {
    const navigate = useNavigate();

  return (
    <div> 
        <button className='bg-red-400' onClick={() => navigate('/chess-board')}>Navigate to Chess Board</button>
        
    </div>
  )
}

export default LandingPage