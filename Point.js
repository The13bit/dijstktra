class Point {
    static totalPoints = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = ++Point.totalPoints; // Increment totalPoints and assign it to this.id
      }
    drawRing(ctx, distance = 8, color = 'yellow', lineWidth = 3) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, distance, 0, Math.PI * 2, true);
        ctx.stroke();
      }
      drawSelectionIndicator(ctx, radius = 4, color = 'blue') {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
      }
    draw(ctx, size=10, color='black') {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.fillStyle = 'red';
    
      ctx.fillText(this.id.toString(), this.x, this.y);
    }
  }