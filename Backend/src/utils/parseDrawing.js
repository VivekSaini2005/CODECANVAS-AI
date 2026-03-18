// src/utils/parseDrawing.js

function separateElements(elements) {
  const nodes = []
  const arrows = []

  elements.forEach(el => {
    if (el.type === "rectangle" || el.type === "ellipse") {
      nodes.push(el)
    }
    if (el.type === "arrow") {
      arrows.push(el)
    }
  })

  return { nodes, arrows }
}

function extractNodeValues(nodes) {
  return nodes.map(node => ({
    id: node.id,
    value: isNaN(node.text) ? node.text : Number(node.text),
    x: node.x,
    y: node.y
  }))
}

function buildConnections(arrows) {
  return arrows.map(arrow => ({
    from: arrow.startBinding?.elementId,
    to: arrow.endBinding?.elementId
  }))
}

// 🔥 Detect Linked List
function detectLinkedList(nodes, connections) {
  if (connections.length !== nodes.length - 1) return false

  const fromSet = new Set(connections.map(c => c.from))
  const toSet = new Set(connections.map(c => c.to))

  const head = [...fromSet].find(id => !toSet.has(id))

  return !!head
}

// 🔥 Build Linked List
function buildLinkedList(nodes, connections) {
  const nodeMap = {}
  nodes.forEach(n => nodeMap[n.id] = n)

  const nextMap = {}
  connections.forEach(c => {
    nextMap[c.from] = c.to
  })

  const toSet = new Set(connections.map(c => c.to))
  const head = nodes.find(n => !toSet.has(n.id))

  const result = []
  let current = head?.id

  while (current) {
    result.push(nodeMap[current].value)
    current = nextMap[current]
  }

  return {
    type: "linked_list",
    nodes: result
  }
}

// 🔥 Detect Array
function detectArray(nodes) {
  const sorted = [...nodes].sort((a, b) => a.x - b.x)

  let aligned = true
  for (let i = 1; i < sorted.length; i++) {
    if (Math.abs(sorted[i].y - sorted[i - 1].y) > 20) {
      aligned = false
      break
    }
  }

  return aligned ? sorted : null
}

// 🔥 MAIN FUNCTION
function parseDrawing(elements) {
  const { nodes, arrows } = separateElements(elements)
  const nodeData = extractNodeValues(nodes)
  const connections = buildConnections(arrows)

  // Linked List
  if (detectLinkedList(nodeData, connections)) {
    return buildLinkedList(nodeData, connections)
  }

  // Array
  const arrayNodes = detectArray(nodeData)
  if (arrayNodes) {
    return {
      type: "array",
      values: arrayNodes.map(n => n.value)
    }
  }

  return {
    type: "unknown",
    raw: elements
  }
}

module.exports = { parseDrawing }