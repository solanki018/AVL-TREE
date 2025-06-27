import { useEffect, useState } from 'react';

export default function useAvlTree() {
  const [instance, setInstance] = useState(null);

  useEffect(() => {    if (window.Module || window.AVLModule) return;

    const script = document.createElement('script');
    script.src = '/wasm/avl.js'; 
    script.async = true;

    script.onload = () => {
    const factory = window.Module || window.AVLModule;
      if (typeof factory === 'function') {
        factory().then((mod) => {
          const tree = new mod.AVLTree();
          setInstance(tree);
        });
      } else {
        console.error('WASM module factory not found');
      }
    };

    script.onerror = () => {
      console.error('Failed to load avl.js script');
    };

    document.body.appendChild(script);
  }, []);

  return instance;
}