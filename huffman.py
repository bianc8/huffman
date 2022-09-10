import heapq

class node:
  def __init__(self, prob, symbol, left=None, right=None):
    self.prob = prob  # probability of symbol
    self.symbol = symbol  # symbol name (symbol)
    self.left = left  # node left of current node
    self.right = right  # node right of current node
    self.huff = ''  # tree direction (0/1)
        
  def __lt__(self, nxt):
    return self.prob < nxt.prob
         
# utility function
def printNodes(node, val=''): 
  global sumLengths
  newVal = val + str(node.huff) # huffman code for current node

  # if node isnt edge node -> traverse inside it
  if(node.left):
    printNodes(node.left, newVal)
  if(node.right):
    printNodes(node.right, newVal)

  # if node is edge node -> display its huffman code & calc median length
  if(not node.left and not node.right):
    print(f"{node.symbol} -> {newVal} | l={len(newVal)}")
    sumLengths += len(newVal) * mapSymbols[node.symbol]
 
# for median length
sumLengths = 0.0
# symbols for huffman tree
mapSymbols = {
  'a': 0.1,
  'b': 0.5,
  'c': 0.2,
  'd': 0.04,
  'e': 0.16
}
# list containing unused nodes
nodes = []
 
# converting symbols and frequencies into huffman tree nodes
keys = list(mapSymbols.keys())
for x in range(len(mapSymbols)):
  heapq.heappush(nodes, node(mapSymbols[keys[x]], keys[x]))

while len(nodes) > 1:
  left = heapq.heappop(nodes)
  right = heapq.heappop(nodes)
  print(f'Pick {left.symbol} prob {str(left.prob)} - {right.symbol} prob {str(right.prob)} Create {left.symbol+right.symbol}')
  
  # assign directional value to these nodes
  left.huff = 0
  right.huff = 1
 
  # combine the 2 smallest nodes to create new node as their parent
  newNode = node(left.prob+right.prob, left.symbol+right.symbol, left, right)
  heapq.heappush(nodes, newNode)

print("\nFinal results")
printNodes(nodes[0])
print(f'Median Length Ly = {sumLengths} b.')