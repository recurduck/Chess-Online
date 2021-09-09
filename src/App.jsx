import { HashRouter as Router, Route } from 'react-router-dom'
import {routes} from './routes.js'
import './style/style.scss';
import { Header } from './cmps/Header.jsx';

function App() {
  return (
    <Router>
      <Header />
      <main>
        {routes.map((route) => (
          <Route key={route.path} exact component={route.component} path={route.path} />
        ))}
      </main>
    </Router>
  );
}

export default App;
