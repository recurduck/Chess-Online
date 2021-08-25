import { Link } from 'react-router-dom'

export function Admin() {
  return (
    <div>
      <h1>Admin page!</h1>

      <Link to='/cars'>Cars</Link>
    </div>
  )
}
