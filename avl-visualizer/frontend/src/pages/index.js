import { useEffect, useState } from 'react';
import useAvlTree from '@/utils/useAvlTree';
import TreeVisualizer from '@/components/TreeVisualizer';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function Home() {
  const tree = useAvlTree();
  const [inputVal, setInputVal] = useState('');
  const [json, setJson] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [logLines, setLogLines] = useState([]);

  useEffect(() => {
    if (tree) {
      const t = tree.getTreeJSON();
      if (t) setJson(t);
    }
  }, [tree]);

  const updateTree = (action, val) => {
    if (!tree || val === '') return;
    const parsed = parseInt(val);
    let message = '';

    if (action === 'insert') {
      tree.insert(parsed);
      message = `🔵 Inserting ${parsed}`;
    } else if (action === 'delete') {
      tree.deleteKey(parsed);
      message = `🔴 Deleting ${parsed}`;
    } else if (action === 'search') {
      const found = tree.search(parsed);
      message = found ? `✅ Found ${parsed}` : `❌ ${parsed} not found`;
      setSearchResult(found ? '✅ Found' : '❌ Not Found');
    }

    setLogLines((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev]);
    setJson(tree.getTreeJSON());
    setInputVal('');
  };

  return (
    <main className="flex h-screen overflow-hidden font-mono bg-[#111827] text-white">
      {/* Sidebar */}
      <div className="w-[320px] shrink-0 bg-[#1f2937] border-r border-gray-700 p-5 space-y-6">
        <h1 className="text-3xl font-bold text-white">🌳 AVL Tree</h1>

        <input
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter value"
          className="w-full p-2 bg-[#374151] border border-gray-600 rounded text-white placeholder-gray-400"
        />

        <div className="space-y-2">
          <button onClick={() => updateTree('insert', inputVal)} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
            ➕ Insert
          </button>
          <button onClick={() => updateTree('delete', inputVal)} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded">
            🗑️ Delete
          </button>
          <button onClick={() => updateTree('search', inputVal)} className="w-full bg-green-600 hover:bg-green-700 py-2 rounded">
            🔍 Search
          </button>
        </div>

        {searchResult && <p className="text-lg font-semibold text-center">{searchResult}</p>}
      </div>

      {/* Main Section */}
      <div className="flex flex-col flex-1 p-4 space-y-4 overflow-hidden">
        <div className="flex-1 rounded border border-gray-600 bg-[#1e293b] overflow-hidden">
          <TreeVisualizer data={json} />
        </div>

        <div className="bg-[#1f2937] border border-gray-600 p-4 rounded h-[200px] overflow-auto">
          <h2 className="font-bold mb-2 text-white text-lg">📜 Operation Log</h2>
          <div className="text-sm space-y-1 max-h-[160px] overflow-y-auto pr-2">
            {logLines.length === 0 ? (
              <p className="text-gray-400 italic">No operations yet.</p>
            ) : (
              logLines.map((line, idx) => (
                <p key={idx} className="text-gray-300">{line}</p>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
