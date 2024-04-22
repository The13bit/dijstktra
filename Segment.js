class Segment {
    constructor(point1, point2) {
      this.point1 = point1;
      this.point2 = point2;
      this.weight=0;
    }
    drawsearcg(context, isSearching = false) {
        context.beginPath();
        context.moveTo(this.point1.x, this.point1.y);
        context.lineTo(this.point2.x, this.point2.y);
        context.strokeStyle = isSearching ? 'yellow' : 'red';
        context.stroke();
      }
    
    draw(ctx, color = 'black', width = 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(this.point1.x, this.point1.y);
        ctx.lineTo(this.point2.x, this.point2.y);
        ctx.stroke();
    
        // Draw the weight
        const midX = (this.point1.x + this.point2.x) / 2;
        const midY = (this.point1.y + this.point2.y) / 2;
        ctx.fillStyle = 'red'; // Change this to the color you want for the weight
        ctx.font = '16px Arial'; // Change this to the font you want for the weight
        ctx.fillText(this.weight.toString(), midX, midY);
      }
  }