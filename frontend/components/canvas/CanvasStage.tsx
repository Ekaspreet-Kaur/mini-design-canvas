"use client";

import { useEffect, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage, Text, Transformer } from "react-konva";
import type Konva from "konva";
import type { CanvasElement } from "../../types/canvas";

interface Props {
  width: number;
  height: number;
  elements: CanvasElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, changes: Partial<CanvasElement>) => void;
  onCommit: () => void;
}

export default function CanvasStage({
  width,
  height,
  elements,
  selectedId,
  onSelect,
  onChange,
  onCommit,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Node | null>>({});
  const transformerRef = useRef<Konva.Transformer | null>(null);

  const [containerWidth, setContainerWidth] = useState(width);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerWidth(container.clientWidth);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const scale = Math.min(
    1,
    Math.max(0.1, (containerWidth - 32) / width),
  );

  useEffect(() => {
    const node = selectedId ? shapeRefs.current[selectedId] : null;
    const transformer = transformerRef.current;

    if (!transformer) return;

    transformer.nodes(node ? [node] : []);
    transformer.getLayer()?.batchDraw();
  }, [selectedId, elements]);

  const handleTransformEnd = (element: CanvasElement) => {
    const node = shapeRefs.current[element.id];

    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = Math.max(10, element.width * scaleX);
    const newHeight = Math.max(10, element.height * scaleY);

    node.scaleX(1);
    node.scaleY(1);

    if (element.type === "circle") {
      onChange(element.id, {
        x: node.x() - newWidth / 2,
        y: node.y() - newHeight / 2,
        width: newWidth,
        height: newHeight,
        rotation: node.rotation(),
      });
    } else {
      onChange(element.id, {
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight,
        rotation: node.rotation(),
      });
    }

    onCommit();
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-4 shadow-inner"
    >
      <div
        className="mx-auto"
        style={{
          width: width * scale,
          height: height * scale,
        }}
      >
        <Stage
          width={width}
          height={height}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={(event) => {
            if (event.target === event.target.getStage()) {
              onSelect(null);
            }
          }}
        >
          <Layer>
            {elements.map((element) => {
              if (element.type === "circle") {
                const circleSize = Math.min(element.width, element.height);

                return (
                  <Circle
                    key={element.id}
                    ref={(node) => {
                      shapeRefs.current[element.id] = node;
                    }}
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2}
                    radius={circleSize / 2}
                    scaleX={element.width / circleSize}
                    scaleY={element.height / circleSize}
                    rotation={element.rotation}
                    fill={element.fill}
                    draggable
                    onClick={() => onSelect(element.id)}
                    onTap={() => onSelect(element.id)}
                    onDragEnd={(event) => {
                      onChange(element.id, {
                        x: event.target.x() - element.width / 2,
                        y: event.target.y() - element.height / 2,
                      });
                      onCommit();
                    }}
                    onTransformEnd={() => handleTransformEnd(element)}
                  />
                );
              }

              if (element.type === "text") {
                return (
                  <Text
                    key={element.id}
                    ref={(node) => {
                      shapeRefs.current[element.id] = node;
                    }}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    rotation={element.rotation}
                    text={element.text ?? "Text"}
                    fontSize={element.fontSize ?? 28}
                    fill={element.fill}
                    verticalAlign="middle"
                    padding={4}
                    draggable
                    onClick={() => onSelect(element.id)}
		    onTap={() => onSelect(element.id)}
		    onDblClick={() => {
  			const currentText = element.text ?? "Text";
 			 const nextText = window.prompt("Edit text", currentText);

  			if (nextText !== null && nextText.trim() !== "") {
   				 onChange(element.id, { text: nextText });
   			 onCommit();
  }
}}
	          onDblTap={() => {
 		 const currentText = element.text ?? "Text";
  		const nextText = window.prompt("Edit text", currentText);

 		 if (nextText !== null && nextText.trim() !== "") {
    onChange(element.id, { text: nextText });
    onCommit();
  }
}}
onDragEnd={(event) => {
                      onChange(element.id, {
                        x: event.target.x(),
                        y: event.target.y(),
                      });
                      onCommit();
                    }}
                    onTransformEnd={() => handleTransformEnd(element)}
                  />
                );
              }

              return (
                <Rect
                  key={element.id}
                  ref={(node) => {
                    shapeRefs.current[element.id] = node;
                  }}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  rotation={element.rotation}
                  fill={element.fill}
                  cornerRadius={8}
                  draggable
                  onClick={() => onSelect(element.id)}
                  onTap={() => onSelect(element.id)}
                  onDragEnd={(event) => {
                    onChange(element.id, {
                      x: event.target.x(),
                      y: event.target.y(),
                    });
                    onCommit();
                  }}
                  onTransformEnd={() => handleTransformEnd(element)}
                />
              );
            })}

            <Transformer
              ref={transformerRef}
              rotateEnabled
              keepRatio={false}
              enabledAnchors={[
                "top-left",
                "top-center",
                "top-right",
                "middle-right",
                "bottom-right",
                "bottom-center",
                "bottom-left",
                "middle-left",
              ]}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}