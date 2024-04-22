class Graph {
  constructor(ctx) {
    this.points = [];
    this.segments = [];
    this.selectedPoint = null;
    this.isDragging = false;
    this.ctx = ctx;
    this.path=[]
  }

  async dijsktra(startid, endid) {
    console.log(startid, endid);
    let start = this.points.find((point) => point.id == startid);
    let end = this.points.find((point) => point.id == endid);
    console.log(start, end);
    let visited = [];
    let distance = [];
    let parent = [];
    let queue = [];
    let path = [];
    let current = start;
    let min = 0;
    let minIndex = 0;
    for (let i = 0; i < this.points.length; i++) {
      visited.push(false);
      distance.push(Infinity);
      parent.push(-1);
    }
    distance[start.id - 1] = 0;
    queue.push(start);

    while (queue.length > 0) {
      current = queue.shift();
      visited[current.id - 1] = true;
      for (let i = 0; i < this.segments.length; i++) {
        if (this.segments[i].point1 == current) {
            this.segments[i].drawsearcg(this.ctx, true);
          if (
            distance[this.segments[i].point2.id - 1] >
            distance[current.id - 1] + this.segments[i].weight
          ) {
            distance[this.segments[i].point2.id - 1] =
              distance[current.id - 1] + this.segments[i].weight;
            parent[this.segments[i].point2.id - 1] = current.id;
            queue.push(this.segments[i].point2);
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    let temp = end.id;
    while (temp != -1) {
      path.push(temp);
      temp = parent[temp - 1];
    }
    path.reverse();
    console.log(path);
    let result = "";
    for (let i = 0; i < path.length; i++) {
      if (i == path.length - 1) {
        result += path[i];
      } else {
        result += path[i] + "->";
      }
    }
    console.log(result);

    let totalDistance = distance[end.id - 1];
    console.log(totalDistance);
    this.path= path
  }

  drawPath(path) {
    
  }
  removePoint(pointToRemove) {
    // Remove the point from the points array
    this.points = this.points.filter((point) => point !== pointToRemove);

    // Remove any segments connected to this point
    this.segments = this.segments.filter(
      (segment) =>
        segment.point1 !== pointToRemove && segment.point2 !== pointToRemove
    );
  }
  addPointOnClick(canvas, ctx) {
    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // Prevent the context menu from showing up
      const { offsetX: x, offsetY: y } = event;
      const clickedPoint = this.isNearPoint(x, y);
      if (clickedPoint) {
        this.removePoint(clickedPoint); // You need to implement this function
        this.draw(ctx); // Redraw the graph without the removed point
      }
    });
    canvas.addEventListener("click", (event) => {
      // Only add a point if we're not currently dragging (to avoid creating a point when releasing a drag)
      if (!this.isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if the click is near an existing point
        const existingPoint = this.isNearPoint(x, y);
        if (!existingPoint) {
          // If not near any point, add new point
          this.addPoint(x, y);
          this.draw(ctx); // Redraw the graph with the new point
        }
      }
    });
  }

  isNearSegment(x, y) {
    const threshold = 5; // Adjust this value based on how close the cursor needs to be to consider it "near" the segment
    for (let segment of this.segments) {
      const dx = segment.point2.x - segment.point1.x;
      const dy = segment.point2.y - segment.point1.y;
      const distance =
        Math.abs(
          dy * x -
            dx * y +
            segment.point2.x * segment.point1.y -
            segment.point2.y * segment.point1.x
        ) / Math.sqrt(dx * dx + dy * dy);
      if (distance < threshold) return segment;
    }
    return null;
  }

  removeSegment(segmentToRemove) {
    this.segments = this.segments.filter(
      (segment) => segment !== segmentToRemove
    );
  }

  handleCreateSegmentOnClick(canvas, ctx) {
    let startPoint = null;
    let clickedPoint = null;
    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // Prevent the default action
      const { offsetX: x, offsetY: y } = event;
      const clickedSegment = this.isNearSegment(x, y);
      if (clickedSegment) {
        const weight = Number.parseInt(prompt("Enter a weight for this edge:"));
        if (weight) {
          clickedSegment.weight = weight;
          this.draw(ctx); // Redraw the graph with the updated weight
        }
      }
    });
    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // Prevent the context menu from showing up
      startPoint = null; // Reset the starting point
      this.draw(ctx); // Redraw the graph without the temporary edge
    });
    canvas.addEventListener("mousemove", (event) => {
      if (startPoint) {
        // If a starting point is selected, draw a line from the starting point to the current cursor position
        const { offsetX: x, offsetY: y } = event;
        this.draw(ctx);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });

    canvas.addEventListener("click", (event) => {
      const { offsetX: x, offsetY: y } = event;
      if (!startPoint) {
        startPoint = this.isNearPoint(x, y);
      } else {
        clickedPoint = this.isNearPoint(x, y);
        if (clickedPoint && startPoint !== clickedPoint) {
          this.addSegment(startPoint, clickedPoint);
          startPoint = null;
        }
      }
    });
  }
  addSegment(point1, point2) {
    // Check if the starting and ending points are the same
    if (point1 !== point2) {
      const segment = new Segment(point1, point2);
      this.segments.push(segment);
      return segment;
    } else {
      // If the points are the same, do not add a segment and possibly log a message or handle as appropriate
      console.log(
        "Cannot create a self-edge. The starting and ending points are the same."
      );
      return null; // Return null or handle as appropriate for your application
    }
  }
  isNearPoint(x, y, threshold = 8) {
    return this.points.find((point) => {
      const dx = point.x - x;
      const dy = point.y - y;
      return Math.sqrt(dx * dx + dy * dy) < threshold;
    });
  }
  // Method to handle mouse down event
  handleMouseDown(canvas, ctx) {
    canvas.addEventListener("mousedown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const clickedPoint = this.isNearPoint(x, y, 8);

      if (clickedPoint) {
        this.selectedPoint = clickedPoint;
        this.isDragging = true;
        // Redraw with selection
        this.draw(ctx);
        this.selectedPoint.drawSelectionIndicator(ctx);
      }
    });
  }

  // Method to handle mouse movement over the canvas
  handleMouseMove(canvas, ctx) {
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (this.isDragging && this.selectedPoint) {
        // Update the selected point's position
        this.selectedPoint.x = x;
        this.selectedPoint.y = y;
      }

      // Clear the canvas and redraw the graph
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.draw(ctx);

      if (this.selectedPoint) {
        // Draw selection indicator on the selected point
        this.selectedPoint.drawSelectionIndicator(ctx);
      } else {
        // Check if near any point to draw yellow ring
        const nearPoint = this.isNearPoint(x, y, 16);
        if (nearPoint) {
          nearPoint.drawRing(ctx);
        }
      }
    });
  }

  handleMouseUp(canvas, ctx) {
    canvas.addEventListener("mouseup", (event) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.selectedPoint = null;
        // Redraw without selection
        this.draw(ctx);
      }
    });
  }

  addPoint(x, y) {
    const point = new Point(x, y);
    this.points.push(point);
    return point;
  }

  addSegment(point1, point2) {
    const segment = new Segment(point1, point2);
    this.segments.push(segment);
    return segment;
  }

  draw(ctx) {

   

    //console.log(this.segments);
    this.segments.forEach((segment) => {
      segment.draw(ctx); // Ensure this method is correctly called for each segment
    });

    // Draw all points
    this.points.forEach((point) => {
      point.draw(ctx); // Ensure this method is correctly called for each point
    });
    if(this.path.length>0){
        for(let i=0;i<this.path.length-1;i++){
          let start=this.points.find((point)=>point.id==this.path[i]);
          let end=this.points.find((point)=>point.id==this.path[i+1]);
          let segment=this.segments.find((segment)=>segment.point1==start && segment.point2==end);
          segment.drawsearcg(ctx,true);
        }
      }
  }

}
