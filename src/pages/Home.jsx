import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className='hero flex column justify-center align-center'>
      <Link to="/gamerooms"><h1>Welcome to Chess online</h1></Link>

    </div>
  )
}
