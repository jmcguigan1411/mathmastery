import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function InteractiveGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slope, setSlope] = useState([1]);
  const [intercept, setIntercept] = useState([0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 20;

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    for (let i = -10; i <= 10; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, height);
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(width, centerY + i * scale);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = "#475569";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";

    // X-axis numbers
    for (let i = -10; i <= 10; i += 2) {
      if (i !== 0) {
        ctx.fillText(i.toString(), centerX + i * scale, centerY + 15);
      }
    }

    // Y-axis numbers
    ctx.textAlign = "right";
    for (let i = -10; i <= 10; i += 2) {
      if (i !== 0) {
        ctx.fillText(i.toString(), centerX - 5, centerY - i * scale + 4);
      }
    }

    // Draw function line: y = mx + b
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    ctx.beginPath();

    const m = slope[0];
    const b = intercept[0];

    const startX = -width / 2 / scale;
    const endX = width / 2 / scale;

    const startY = m * startX + b;
    const endY = m * endX + b;

    ctx.moveTo(centerX + startX * scale, centerY - startY * scale);
    ctx.lineTo(centerX + endX * scale, centerY - endY * scale);
    ctx.stroke();

    // Highlight y-intercept point
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(centerX, centerY - b * scale, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Add axis labels
    ctx.fillStyle = "#475569";
    ctx.font = "14px Inter";
    ctx.textAlign = "center";
    ctx.fillText("x", width - 20, centerY - 10);
    ctx.fillText("y", centerX + 15, 20);

    // Add origin label
    ctx.fillText("0", centerX - 10, centerY + 15);
  }, [slope, intercept]);

  const resetGraph = () => {
    setSlope([1]);
    setIntercept([0]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3">
        <canvas
          ref={canvasRef}
          className="w-full h-80 border border-slate-300 rounded-lg cursor-crosshair"
          style={{ height: "320px" }}
        />
        <div className="mt-2 text-sm text-slate-500 text-center">
          Interactive graph showing y = {slope[0]}x + {intercept[0]}
        </div>
      </div>

      <div className="lg:w-1/3">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Adjust Parameters</h3>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  Slope (m): {slope[0]}
                </Label>
                <Slider
                  value={slope}
                  onValueChange={setSlope}
                  max={5}
                  min={-5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  Y-Intercept (b): {intercept[0]}
                </Label>
                <Slider
                  value={intercept}
                  onValueChange={setIntercept}
                  max={10}
                  min={-10}
                  step={1}
                  className="w-full"
                />
              </div>

              <Card className="bg-slate-50">
                <CardContent className="p-3">
                  <div className="text-sm font-medium text-slate-700 mb-2">Current Equation:</div>
                  <div className="text-lg font-mono text-primary">
                    y = {slope[0]}x + {intercept[0]}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={resetGraph} variant="outline" className="w-full">
                Reset Graph
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
