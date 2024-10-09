import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const initialNodes = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 300, y: 200 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 500, y: 300 } },
];

const BasicNode = ({ data }) => {
  return (
    <div css={css`
      padding: 10px;
      border-radius: 5px;
      background: ${({ theme }) => theme.nodeBackground};
      color: ${({ theme }) => theme.nodeText};
      border: 2px solid ${({ theme }) => theme.nodeBorder};
      font-weight: bold;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
      }
    `}>
      {data.label}
    </div>
  );
};

const nodeTypes = {
  basicNode: BasicNode,
};

const Sidebar = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 4;
  background: ${({ theme }) => theme.sidebarBackground};
  color: ${({ theme }) => theme.text};
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 200px;
`;

const ThemeToggle = styled.button`
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 4;
  padding: 10px;
  background: ${({ theme }) => theme.toggleBackground};
  color: ${({ theme }) => theme.toggleText};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const lightTheme = {
  background: '#f3f4f6',
  text: '#1f2937',
  nodeBackground: 'linear-gradient(45deg, #6b7280, #4b5563)',
  nodeText: '#ffffff',
  nodeBorder: '#9ca3af',
  sidebarBackground: 'rgba(255, 255, 255, 0.9)',
  toggleBackground: '#4b5563',
  toggleText: '#ffffff',
};

const darkTheme = {
  background: '#1f2937',
  text: '#f3f4f6',
  nodeBackground: 'linear-gradient(45deg, #4b5563, #374151)',
  nodeText: '#ffffff',
  nodeBorder: '#6b7280',
  sidebarBackground: 'rgba(31, 41, 55, 0.9)',
  toggleBackground: '#9ca3af',
  toggleText: '#1f2937',
};

const BasicFlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onNodeDragStop = useCallback((event, node) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          n.position = node.position;
        }
        return n;
      })
    );
    setSelectedNode(node);
  }, [setNodes]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <div style={{ width: '100vw', height: '100vh', background: theme.background }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
      >
        <Background variant="dots" gap={12} size={1} color={theme.text} />
        <Controls />
        <MiniMap style={{ height: 120 }} zoomable pannable />
      </ReactFlow>
      <Sidebar theme={theme}>
        {selectedNode ? (
          <>
            <h3>Selected Node</h3>
            <p>ID: {selectedNode.id}</p>
            <p>Position: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</p>
          </>
        ) : (
          <p>Select a node to see its details</p>
        )}
      </Sidebar>
      <ThemeToggle onClick={toggleTheme} theme={theme}>
        {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
      </ThemeToggle>
    </div>
  );
};

export default BasicFlowEditor;