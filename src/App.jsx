import { HashRouter as Router, Route } from 'react-router-dom'
import {routes} from './routes.js'
import './style/style.scss';
import { Header } from './cmps/Header.jsx';
import { useEffect } from 'react';

function App() {

  // useEffect(() => {
  //   //dispatch(loadUser()) // Go to sessionStorage and check for exist user
  //   //
  // }, []);
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
