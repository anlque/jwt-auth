import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {StrictMode} from "react";
import Store from "./store/store";
import {createContext} from "react";

interface State {
    store: Store;
}

const store = new Store();

export const Context = createContext<State>({store});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
      <Context.Provider value={{store}}>
        <App />
      </Context.Provider>
  </StrictMode>
);

// reportWebVitals(console.log)
reportWebVitals();
