import { useEffect, useState } from 'react';
import useAvlTree from '@/utils/useAvlTree';
import TreeVisualizer from '@/components/TreeVisualizer';

export default function Home() {
  const tree = useAvlTree();
  const [inputVal, setInputVal] = useState('');
  const [json, setJson] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (tree) {
      try {
        const t = tree.getTreeJSON();
        if (t) setJson(t);
      } catch (e) {
        console.warn("Failed to parse tree JSON:", e);
      }
    }
  }, [tree]);

  const updateTree = (action, val) => {
    if (!tree || val === "") return;
    const parsed = parseInt(val);

    if (action === "insert") {
      tree.insert(parsed);
      setDescription(`Inserted ${parsed}`);
    } else if (action === "delete") {
      tree.deleteKey(parsed);
      setDescription(`Deleted ${parsed}`);
    } else if (action === "search") {
      const found = tree.search(parsed);
      const result = found ? "✅ Found" : "❌ Not Found";
      setSearchResult(result);
      setDescription(`Searched for ${parsed}: ${result}`);
    }

    setJson(tree.getTreeJSON());
    setInputVal('');
  };

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 p-6 bg-gray-10 border-r space-y-4">
        <h1 className="text-xl font-bold">AVL Tree Controls</h1>

        <input
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter value"
          className="w-full p-2 border rounded"
        />

        <button onClick={() => updateTree("insert", inputVal)} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Insert Node
        </button>
        <button onClick={() => updateTree("delete", inputVal)} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
          Delete Node
        </button>
        <button onClick={() => updateTree("search", inputVal)} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Search Node
        </button>

        {searchResult && <p className="text-lg font-semibold">{searchResult}</p>}
      </div>

      {/* Tree + Description Panel */}
      <div className="flex-1 p-6 space-y-6">
        <TreeVisualizer data={json} />

        <div className="bg-gray-10 p-4 shadow rounded">
          <h2 className="font-bold mb-2">🔍 Operation Description</h2>
          <p>{description || "Perform an operation to see the result."}</p>
        </div>

        <div className="bg-gray-10 p-4 rounded max-h-64 overflow-auto">
          <h2 className="font-bold mb-2">🧠 Tree JSON</h2>
          <pre>{json}</pre>
        </div>
      </div>
    </main>
  );
}
