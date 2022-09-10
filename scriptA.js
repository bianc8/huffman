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

// createTable with headers
var tableDiv = document.getElementById("myTable");
var table = document.createElement("table");
var trH = document.createElement("tr");
var th1 = document.createElement("th");
th1.appendChild(document.createTextNode("Symbol"));
trH.appendChild(th1);
var th2 = document.createElement("th");
th2.appendChild(document.createTextNode("Coding"));
trH.appendChild(th2);
var th3 = document.createElement("th");
th3.appendChild(document.createTextNode("Length"));
trH.appendChild(th3);
var tBody = document.createElement("tbody");
table.appendChild(trH);
table.appendChild(tBody);

// recursive get huffman-code through the tree traversal.
function getHuffmanCode(node, value='') { 
  let newVal = value + node.huff
  if (node.left !== null) {
    getHuffmanCode(node.left, newVal);
  }
  if (node.right !== null) {
    getHuffmanCode(node.right, newVal);
  }
  if (node.left == null && node.right == null) {
    node.coding = newVal;
    node.codingLength = newVal.length;
    sumLengths += node.codingLength * node.prob;
    
    // write info to table
    var tr = document.createElement("tr");
    tBody.appendChild(tr);
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    td1.appendChild(document.createTextNode(node.symbol));
    tr.appendChild(td1);
    td2.appendChild(document.createTextNode(node.coding));
    tr.appendChild(td2);
    td3.appendChild(document.createTextNode(node.codingLength));
    tr.appendChild(td3);
  }
}
// add table to dom
tableDiv.appendChild(table);
 
// map symbol and probability
let mapSymbols = {
  'a': 0.2,
  'b': 0.2,
  'c': 0.2,
  'd': 0.2,
  'e': 0.2
}
let sumLengths = 0.0

// min priority queue PQ (min-heap).
let PQ = [];
for (const [key, value] of Object.entries(mapSymbols)) {
  let node = new HuffmanNode(key, value);
  PQ.push(node);
}

let root = null;
let trees = [];
let savedTrees = [];

// huffman algorithm
while (PQ.length > 1) {
  PQ.sort(function(a,b){return a.prob-b.prob;});

  let lx = PQ[0]; // first min extract.
  PQ.shift();
  let rx = PQ[0]; // second min extract.
  PQ.shift();

  lx.huff = '0';
  rx.huff = '1';

  let newNode = new HuffmanNode(lx.symbol+'-'+rx.symbol, lx.prob+rx.prob, lx, rx);
  root = newNode;
  PQ.push(newNode);

  // d3 tree
  trees.push({
    "name": root.symbol,
    "value": root.prob.toFixed(4),
    "children": [
      {
        "name": lx.symbol,
        "value": lx.prob.toFixed(4),
        "huff": lx.huff,
      },
      {
        "name": rx.symbol,
        "value": rx.prob.toFixed(4),
        "huff": rx.huff,
      }
    ]
  });
  // update d3 trees
  updateTrees(trees)
  // save merged trees 
  savedTrees.push(JSON.parse(JSON.stringify(trees)));
}
// final update & merge
updateTrees(trees);
savedTrees.push(JSON.parse(JSON.stringify(trees)));

// now we have all the info let's display it
document.body.append(document.createElement("br"));
getHuffmanCode(root);
document.write("Median Length <br> Ly = "+sumLengths.toFixed(4)+" bit");
document.body.append(document.createElement("br"));

// slideshow of all trees
for (let i=0; i<savedTrees.length; i++) {
  savedTrees[i].forEach(tree => {
    paintTree(tree, i+1)
  });
};

// merge tree with same root
function updateTrees(trees) {
  for (let i=0; i<trees.length; i++) {
    let rootName = trees[i].name; // iterate root names
    for (let j=i+1; j<trees.length; j++) {  // iterate all other root names
      if (trees[j] != undefined && trees[j].name.includes(rootName)) { // if rootName is sub-tree of another root
        for (let c=0; c < trees[j].children.length; c++) {  // find the children to substitute
          if (trees[j].children != undefined && trees[j].children[c].name == rootName) {
            trees[i].huff = trees[j].children[c].huff;  // copy huffman code from the tree that will be removed
            trees[j].children[c] = trees[i];  // copy sub-tree rootName as a children of another root
            trees.splice(i, 1); // remove sub-tree rootName from global trees
            break;
          }
        }
      }
    }
  }
}

function paintTree(treeSymbols, n) {
  // set the dimensions and margins of the diagram
  const margin = {top: 20, right: 90, bottom: 30, left: 90};
  const width  = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  
  // declares a tree layout and assigns the size
  const treemap = d3.tree().size([height, width]);

  //  assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(treeSymbols, d => d.children);

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // append the svg object to the body of the page
  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add links between nodes
  const link = g.selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .style("stroke", "steelblue")
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

  // add little circle to node
  node.append("circle")
    .attr("r", 3)
    .style("stroke", "red")
    .style("fill", "#fff");
    
  // add symbol to node
  node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => (String(d.data.name).length))
    .attr("y", d => (String(d.data.name).length + 15)*-1)
    .style("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name);

  // add probability to node
  node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => (String(d.data.prob).length - 10)*-1)
    .attr("y", d => (String(d.data.prob).length - 25)*-1)
    .style('fill', 'blue')
    .text(d => d.data.value);

  // add huffman to node
  node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => (String(d.data.prob).length + 10)*-1)
    .attr("y", d => (String(d.data.prob).length - 25)*-1)
    .style('fill', 'red')
    .text(d => d.data.huff);
}