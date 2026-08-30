import AntarcticMap from './components/AntarcticMap';

/**
 * App component functions as the root container.
 * In React, App is the starting point of our component tree, rendering the main AntarcticMap.
 */
function App() {
  return (
    <div className="app-container">
      <AntarcticMap />
    </div>
  );
}

export default App;

