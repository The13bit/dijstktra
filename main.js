


// Set up the canvas and context from the existing code
const canvas = document.getElementById("canvas");
canvas.width = 900;
canvas.height = 900;
let start;
let end;
const ctx = canvas.getContext("2d");
const input=document.getElementById("input");
const btn=document.getElementById("btn");
const graph = new Graph(ctx);
// Add point on canvas click
graph.addPointOnClick(canvas, ctx);
graph.handleMouseDown(canvas, ctx);
graph.handleMouseMove(canvas, ctx);
graph.handleMouseUp(canvas, ctx);
graph.handleCreateSegmentOnClick(canvas, ctx);

input.addEventListener("change",(e)=>{
    console.log(e.target.value);
    let arr=e.target.value.split(",");
    console.log(arr);
    start=arr[0];
    end=arr[1];

})
btn.addEventListener("click",()=>{
    graph.dijsktra(start,end);
})
// Define the render function
function render() {
  // Clear the canvas before redrawing
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the entire graph
  graph.draw(ctx);
}



// Initial render
requestAnimationFrame(render)