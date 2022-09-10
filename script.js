class HuffmanNode {
  constructor(symbol, prob, left=null, right=null) {
    this.symbol = symbol; // symbol
    this.prob = prob; // frequency/probability of symbol
    this.left = left; // left node
    this.right = right; // right node
    this.huff = ''; // tree direction right=1 or left=0
    this.coding = '';
    this.codingLength = '';
  }
}
 
// recursive print huffman-code through the tree traversal.
function printNodes(node, value='') { 
  let newVal = value + node.huff
  if (node.left !== null) {
    printNodes(node.left, newVal);
  }
  if (node.right !== null) {
    printNodes(node.right, newVal);
  }
  if (node.left == null && node.right == null) {
    node.coding = newVal;
    node.codingLength = newVal.length;
    document.write(node.symbol + ":" + node.coding+"<br>");
    sumLengths += node.codingLength * node.prob;
  }
}
     
let mapSymbols = {
  'a': 0.2,
  'b': 0.2,
  'c': 0.2,
  'd': 0.2,
  'e': 0.2
}
let treeSymbols = {}
let sumLengths = 0.0

let PQ = [];  // min priority queue PQ (min-heap).
for (const [key, value] of Object.entries(mapSymbols)) {
  let node = new HuffmanNode(key, value);
  PQ.push(node);
}

let root = null;
while (PQ.length > 1) {
  PQ.sort(function(a,b){return a.prob-b.prob;});

  let lx = PQ[0]; // first min extract.
  PQ.shift();
  let rx = PQ[0]; // second min extract.
  PQ.shift();

  lx.huff = '0'
  rx.huff = '1'

  let newNode = new HuffmanNode(lx.symbol+'-'+rx.symbol, lx.prob+rx.prob, lx, rx);
  root = newNode;
  PQ.push(newNode);

  // generate tree d3
  treeSymbols = {
    "name": root.symbol,
    "value": Math.round(root.prob),
    "type": "black",
    "level": "white",
    "children": [
      {
        "name": lx.symbol,
        "value": Math.round(lx.prob),
        "type": "black",
        "level": "red",
      },
      {
        "name": rx.symbol,
        "value": Math.round(rx.prob),
        "type": "black",
        "level": "red",
      }
    ]
  };
  updateTree(treeSymbols)
}

// print the codes by traversing the tree
printNodes(root);
document.write(sumLengths)


function updateTree(treeSymbols) {
  // set the dimensions and margins of the diagram
  const margin = {top: 20, right: 90, bottom: 30, left: 90};
  const width  = 660 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // declares a tree layout and assigns the size
  const treemap = d3.tree().size([height, width]);

  //  assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(treeSymbols, d => d.children);

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // adds the links between the nodes
  const link = g.selectAll(".link")
    .data( nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .style("stroke", d => d.data.level)
    .attr("d", d => {
      return "M" + d.y + "," + d.x
        + "C" + (d.y + d.parent.y) / 2 + "," + d.x
        + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
        + " " + d.parent.y + "," + d.parent.x;
      });

  // adds each node as a group
  const node = g.selectAll(".node")
    .data(nodes.descendants())
    .enter().append("g")
    .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
    .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

  // adds the circle to the node
  node.append("circle")
    .attr("r", d => d.data.value)
    .style("stroke", d => d.data.type)
    .style("fill", d => d.data.level);
    
  // adds the text to the node
  node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => d.children ? (d.data.value + 5) * -1 : d.data.value + 5)
    .attr("y", d => d.children && d.depth !== 0 ? -(d.data.value + 5) : d)
    .style("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name);
}