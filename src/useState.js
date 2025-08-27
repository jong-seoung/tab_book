// usestate 구현
export function useState(initialValue) {
  let value = initialValue;
  const listeners = [];

  const get = () => value;
  const set = (newValue) => {
    value = newValue;
    listeners.forEach((fn)=> fn(value));
  }
  const subscribe = (fn) => listeners.push(fn);

  return [get, set, subscribe];
};

export const [getCategories, setCategories, subscribeCategory] = useState([
  "기본",
]);
export const [getSavedUrls, setSavedUrls, subscribeSavedUrls] = useState({});
export const [getActiveCategory, setActiveCategory, subscribeActiveCategory] =
  useState("기본");
export const [getUserActive, setUserActive, subscribeUserActive] =
  useState(false);