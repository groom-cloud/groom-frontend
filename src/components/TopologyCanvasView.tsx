import React, { useState, useRef, useEffect } from 'react';
import {
  Database,
  Plus,
  LayoutGrid,
  Save,
  Code2,
  Layers,
  X,
  Check,
  CheckCircle2,
  Server,
  Globe,
  Cpu,
  HardDrive,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Download,
  RotateCcw,
  SquareDashed,
  Workflow,
  Monitor,
  Settings,
  PanelRightClose
} from 'lucide-react';
import type {
  UxScreenNode,
  UxFlowEdge,
  ErdTableNode,
  ErdRelation,
  ArchNode,
  ArchEdge,
  StepId,
  TableColumn,
  PortSide,
  CanvasZone
} from '../mockData';

interface TopologyCanvasViewProps {
  currentStep: StepId;
  uxNodes: UxScreenNode[];
  setUxNodes: React.Dispatch<React.SetStateAction<UxScreenNode[]>>;
  uxEdges: UxFlowEdge[];
  setUxEdges: React.Dispatch<React.SetStateAction<UxFlowEdge[]>>;
  uxZones: CanvasZone[];
  setUxZones: React.Dispatch<React.SetStateAction<CanvasZone[]>>;
  erdTables: ErdTableNode[];
  setErdTables: React.Dispatch<React.SetStateAction<ErdTableNode[]>>;
  erdRelations: ErdRelation[];
  setErdRelations: React.Dispatch<React.SetStateAction<ErdRelation[]>>;
  erdZones: CanvasZone[];
  setErdZones: React.Dispatch<React.SetStateAction<CanvasZone[]>>;
  archNodes: ArchNode[];
  setArchNodes: React.Dispatch<React.SetStateAction<ArchNode[]>>;
  archEdges: ArchEdge[];
  setArchEdges: React.Dispatch<React.SetStateAction<ArchEdge[]>>;
  archZones: CanvasZone[];
  setArchZones: React.Dispatch<React.SetStateAction<CanvasZone[]>>;
  onSendCanvasUpdateToChat: (summary: string) => void;
  theme?: 'light' | 'dark';
  onCollapsePane?: () => void;
  onConfirmStep?: (step: StepId) => void;
  isConfirmed?: boolean;
}

interface NodeBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

const PORT_SIDES: PortSide[] = ['top', 'right', 'bottom', 'left'];

function getUxNodeBounds(node: UxScreenNode): NodeBounds {
  return {
    x: node.x,
    y: node.y,
    w: 240,
    h: 104
  };
}

function getErdNodeBounds(table: ErdTableNode): NodeBounds {
  return {
    x: table.x,
    y: table.y,
    w: 276,
    h: 48 + table.columns.length * 26
  };
}

function getArchNodeBounds(node: ArchNode): NodeBounds {
  return {
    x: node.x,
    y: node.y,
    w: 228,
    h: 118
  };
}

function getPortPoint(bounds: NodeBounds, side: PortSide): { x: number; y: number } {
  switch (side) {
    case 'top':
      return { x: bounds.x + bounds.w / 2, y: bounds.y };
    case 'right':
      return { x: bounds.x + bounds.w, y: bounds.y + bounds.h / 2 };
    case 'bottom':
      return { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h };
    case 'left':
      return { x: bounds.x, y: bounds.y + bounds.h / 2 };
  }
}

function inferBestPorts(
  src: NodeBounds,
  tgt: NodeBounds
): { sourcePort: PortSide; targetPort: PortSide } {
  const srcCenter = { x: src.x + src.w / 2, y: src.y + src.h / 2 };
  const tgtCenter = { x: tgt.x + tgt.w / 2, y: tgt.y + tgt.h / 2 };
  const dx = tgtCenter.x - srcCenter.x;
  const dy = tgtCenter.y - srcCenter.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourcePort: 'right', targetPort: 'left' }
      : { sourcePort: 'left', targetPort: 'right' };
  }
  return dy >= 0
    ? { sourcePort: 'bottom', targetPort: 'top' }
    : { sourcePort: 'top', targetPort: 'bottom' };
}

function findClosestPortOnBounds(bounds: NodeBounds, wx: number, wy: number): PortSide {
  let best: PortSide = 'left';
  let minDist = Infinity;
  for (const side of PORT_SIDES) {
    const pt = getPortPoint(bounds, side);
    const d = Math.hypot(wx - pt.x, wy - pt.y);
    if (d < minDist) {
      minDist = d;
      best = side;
    }
  }
  return best;
}

function buildPortBezier(
  p1: { x: number; y: number },
  s1: PortSide,
  p2: { x: number; y: number },
  s2: PortSide
): { path: string; midX: number; midY: number } {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.hypot(dx, dy);

  // Smart offset: don't overshoot half distance on facing ports
  let offset: number;
  const isFacingH =
    (s1 === 'right' && s2 === 'left' && dx > 0) ||
    (s1 === 'left' && s2 === 'right' && dx < 0);
  const isFacingV =
    (s1 === 'bottom' && s2 === 'top' && dy > 0) ||
    (s1 === 'top' && s2 === 'bottom' && dy < 0);

  if (isFacingH) {
    offset = Math.max(12, Math.min(100, Math.abs(dx) * 0.45));
  } else if (isFacingV) {
    offset = Math.max(12, Math.min(100, Math.abs(dy) * 0.45));
  } else {
    offset = Math.max(16, Math.min(80, dist * 0.35));
  }

  const dir = (s: PortSide) => {
    if (s === 'top') return { x: 0, y: -1 };
    if (s === 'right') return { x: 1, y: 0 };
    if (s === 'bottom') return { x: 0, y: 1 };
    return { x: -1, y: 0 };
  };

  const n1 = dir(s1);
  const n2 = dir(s2);
  const cx1 = p1.x + n1.x * offset;
  const cy1 = p1.y + n1.y * offset;
  const cx2 = p2.x + n2.x * offset;
  const cy2 = p2.y + n2.y * offset;

  const midX = 0.125 * p1.x + 0.375 * cx1 + 0.375 * cx2 + 0.125 * p2.x;
  const midY = 0.125 * p1.y + 0.375 * cy1 + 0.375 * cy2 + 0.125 * p2.y;

  return {
    path: `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`,
    midX,
    midY
  };
}

export const TopologyCanvasView: React.FC<TopologyCanvasViewProps> = ({
  currentStep,
  uxNodes,
  setUxNodes,
  uxEdges,
  setUxEdges,
  uxZones,
  setUxZones,
  erdTables,
  setErdTables,
  erdRelations,
  setErdRelations,
  erdZones,
  setErdZones,
  archNodes,
  setArchNodes,
  archEdges,
  setArchEdges,
  archZones,
  setArchZones,
  onSendCanvasUpdateToChat,
  theme = 'light',
  onCollapsePane,
  onConfirmStep,
  isConfirmed = false
}) => {
  // Step 08 = UX Flow, Step 10 = ERD, Step 11 = System Architecture
  const canvasMode: 'ux' | 'erd' | 'arch' =
    currentStep === 'step8' ? 'ux' : currentStep === 'step10' ? 'erd' : 'arch';
  const isUx = canvasMode === 'ux';
  const isErd = canvasMode === 'erd';
  const isArch = canvasMode === 'arch';

  // Canvas View Transform (Zoom + Pan)
  const [viewTransform, setViewTransform] = useState<{
    zoom: number;
    panX: number;
    panY: number;
  }>({
    zoom: 1,
    panX: 0,
    panY: 0
  });
  const { zoom, panX, panY } = viewTransform;
  const canvasViewportRef = useRef<HTMLDivElement | null>(null);

  // Canvas UI States
  const [showGroupBox, setShowGroupBox] = useState(true);
  const [subViewMode, setSubViewMode] = useState<'canvas' | 'code' | 'ia_table'>('canvas');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Inspector Selection (All null initially so no edit modal pops up on load!)
  const [selectedUxId, setSelectedUxId] = useState<string | null>(null);
  const [selectedErdId, setSelectedErdId] = useState<string | null>(null);
  const [selectedArchId, setSelectedArchId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const didDragRef = useRef(false);

  // New column / element input inside inspectors
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState('VARCHAR(50)');

  // Port Drag-and-Drop & Edge Configuration Modal State
  const [portDrag, setPortDrag] = useState<{
    sourceId: string;
    sourcePort: PortSide;
    startX: number;
    startY: number;
    currX: number;
    currY: number;
    hoverTargetId: string | null;
    hoverTargetPort: PortSide | null;
  } | null>(null);

  const [edgeModal, setEdgeModal] = useState<{
    mode: 'create' | 'edit';
    edgeId?: string;
    sourceId: string;
    sourcePort: PortSide;
    targetId: string;
    targetPort: PortSide;
    // UX fields
    triggerLabel: string;
    guardCondition: string;
    // ERD fields
    cardinality: '1:N' | '1:1' | 'N:M';
    sourceCol: string;
    targetCol: string;
    label: string;
    autoCreateFk: boolean;
    // Arch fields
    protocol: string;
    port: string;
    isOptionalV15: boolean;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 2400);
  };

  const screenToWorld = (clientX: number, clientY: number) => {
    const rect = canvasViewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - panX) / zoom,
      y: (clientY - rect.top - panY) / zoom
    };
  };

  // Native Mouse Wheel Zoom
  useEffect(() => {
    const el = canvasViewportRef.current;
    if (!el || subViewMode !== 'canvas') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const step = e.deltaY < 0 ? 0.08 : -0.08;

      setViewTransform((prev) => {
        const nextZoom = Math.min(2.0, Math.max(0.4, +(prev.zoom + step).toFixed(2)));
        if (nextZoom === prev.zoom) return prev;
        const ratio = nextZoom / prev.zoom;
        const nextPanX = Math.round(mouseX - (mouseX - prev.panX) * ratio);
        const nextPanY = Math.round(mouseY - (mouseY - prev.panY) * ratio);
        return { zoom: nextZoom, panX: nextPanX, panY: nextPanY };
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [subViewMode]);

  // Clear selections and reset subViewMode on step switch
  useEffect(() => {
    setSelectedUxId(null);
    setSelectedErdId(null);
    setSelectedArchId(null);
    setSelectedZoneId(null);
    setEdgeModal(null);
    setPortDrag(null);
    setSubViewMode('canvas');
  }, [currentStep]);

  // Escape key closes active modal or inspector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEdgeModal(null);
        setPortDrag(null);
        setSelectedUxId(null);
        setSelectedErdId(null);
        setSelectedArchId(null);
        setSelectedZoneId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const interactionRef = useRef<
    | {
        kind: 'node';
        nodeType: 'ux' | 'erd' | 'arch';
        id: string;
        startClientX: number;
        startClientY: number;
        origX: number;
        origY: number;
      }
    | {
        kind: 'zone-move';
        id: string;
        startClientX: number;
        startClientY: number;
        origX: number;
        origY: number;
      }
    | {
        kind: 'zone-resize';
        id: string;
        startClientX: number;
        startClientY: number;
        origW: number;
        origH: number;
      }
    | {
        kind: 'pan';
        startClientX: number;
        startClientY: number;
        origPanX: number;
        origPanY: number;
      }
    | null
  >(null);

  const activeZones = isUx ? uxZones : isErd ? erdZones : archZones;
  const setActiveZones = isUx ? setUxZones : isErd ? setErdZones : setArchZones;

  const handlePortMouseDown = (
    e: React.MouseEvent,
    nodeId: string,
    side: PortSide,
    bounds: NodeBounds
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const anchor = getPortPoint(bounds, side);
    setPortDrag({
      sourceId: nodeId,
      sourcePort: side,
      startX: anchor.x,
      startY: anchor.y,
      currX: anchor.x,
      currY: anchor.y,
      hoverTargetId: null,
      hoverTargetPort: null
    });
  };

  const handleMouseDownNode = (
    e: React.MouseEvent,
    nodeType: 'ux' | 'erd' | 'arch',
    id: string,
    origX: number,
    origY: number
  ) => {
    e.stopPropagation();
    didDragRef.current = false;

    interactionRef.current = {
      kind: 'node',
      nodeType,
      id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX,
      origY
    };
  };

  const handleMouseDownZone = (e: React.MouseEvent, zone: CanvasZone) => {
    e.stopPropagation();
    didDragRef.current = false;

    interactionRef.current = {
      kind: 'zone-move',
      id: zone.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: zone.x,
      origY: zone.y
    };
  };

  const handleMouseDownZoneResize = (e: React.MouseEvent, zone: CanvasZone) => {
    e.stopPropagation();
    e.preventDefault();
    didDragRef.current = true;
    interactionRef.current = {
      kind: 'zone-resize',
      id: zone.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origW: zone.width,
      origH: zone.height
    };
  };

  const handleCanvasBackgroundMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setSelectedZoneId(null);
    setSelectedUxId(null);
    setSelectedErdId(null);
    setSelectedArchId(null);

    interactionRef.current = {
      kind: 'pan',
      startClientX: e.clientX,
      startClientY: e.clientY,
      origPanX: panX,
      origPanY: panY
    };
  };

  // Pinch-to-zoom & Mobile Touch Gesture State
  const pinchStateRef = useRef<{
    initialDist: number;
    initialZoom: number;
    initialPanX: number;
    initialPanY: number;
    centerClientX: number;
    centerClientY: number;
  } | null>(null);

  const handleTouchStartNode = (
    e: React.TouchEvent,
    nodeType: 'ux' | 'erd' | 'arch',
    id: string,
    origX: number,
    origY: number
  ) => {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    didDragRef.current = false;
    const t = e.touches[0];
    interactionRef.current = {
      kind: 'node',
      nodeType,
      id,
      startClientX: t.clientX,
      startClientY: t.clientY,
      origX,
      origY
    };
  };

  const handleTouchStartZone = (e: React.TouchEvent, zone: CanvasZone) => {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    didDragRef.current = false;
    const t = e.touches[0];
    interactionRef.current = {
      kind: 'zone-move',
      id: zone.id,
      startClientX: t.clientX,
      startClientY: t.clientY,
      origX: zone.x,
      origY: zone.y
    };
  };

  const handleTouchStartZoneResize = (e: React.TouchEvent, zone: CanvasZone) => {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    didDragRef.current = true;
    interactionRef.current = {
      kind: 'zone-resize',
      id: zone.id,
      startClientX: t.clientX,
      startClientY: t.clientY,
      origW: zone.width,
      origH: zone.height
    };
  };

  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      pinchStateRef.current = null;
      setSelectedZoneId(null);
      setSelectedUxId(null);
      setSelectedErdId(null);
      setSelectedArchId(null);

      const t = e.touches[0];
      interactionRef.current = {
        kind: 'pan',
        startClientX: t.clientX,
        startClientY: t.clientY,
        origPanX: panX,
        origPanY: panY
      };
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      pinchStateRef.current = {
        initialDist: dist,
        initialZoom: zoom,
        initialPanX: panX,
        initialPanY: panY,
        centerClientX: midX,
        centerClientY: midY
      };
      interactionRef.current = null;
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStateRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scale = dist / pinchStateRef.current.initialDist;
      const nextZoom = Math.min(
        2.0,
        Math.max(0.4, Number((pinchStateRef.current.initialZoom * scale).toFixed(2)))
      );

      const vp = canvasViewportRef.current?.getBoundingClientRect();
      const originX = vp ? pinchStateRef.current.centerClientX - vp.left : 0;
      const originY = vp ? pinchStateRef.current.centerClientY - vp.top : 0;
      const factor = nextZoom / pinchStateRef.current.initialZoom;
      const nextPanX = originX - (originX - pinchStateRef.current.initialPanX) * factor;
      const nextPanY = originY - (originY - pinchStateRef.current.initialPanY) * factor;

      setViewTransform({
        zoom: nextZoom,
        panX: Math.round(nextPanX),
        panY: Math.round(nextPanY)
      });
      return;
    }

    if (e.touches.length === 1) {
      const t = e.touches[0];
      const active = interactionRef.current;
      if (!active) return;

      if (active.kind === 'pan') {
        const dx = t.clientX - active.startClientX;
        const dy = t.clientY - active.startClientY;
        setViewTransform((prev) => ({
          ...prev,
          panX: active.origPanX + dx,
          panY: active.origPanY + dy
        }));
        return;
      }

      const rawDx = t.clientX - active.startClientX;
      const rawDy = t.clientY - active.startClientY;
      if (Math.hypot(rawDx, rawDy) >= 4) {
        didDragRef.current = true;
      }

      const dx = rawDx / zoom;
      const dy = rawDy / zoom;

      if (active.kind === 'node') {
        const nextX = Math.round(active.origX + dx);
        const nextY = Math.round(active.origY + dy);
        if (active.nodeType === 'ux') {
          setUxNodes((prev) =>
            prev.map((n) => (n.id === active.id ? { ...n, x: nextX, y: nextY } : n))
          );
        } else if (active.nodeType === 'erd') {
          setErdTables((prev) =>
            prev.map((t) => (t.id === active.id ? { ...t, x: nextX, y: nextY } : t))
          );
        } else {
          setArchNodes((prev) =>
            prev.map((n) => (n.id === active.id ? { ...n, x: nextX, y: nextY } : n))
          );
        }
      } else if (active.kind === 'zone-move') {
        const nextX = Math.round(active.origX + dx);
        const nextY = Math.round(active.origY + dy);
        setActiveZones((prev) =>
          prev.map((z) => (z.id === active.id ? { ...z, x: nextX, y: nextY } : z))
        );
      } else if (active.kind === 'zone-resize') {
        const nextW = Math.max(180, Math.round(active.origW + dx));
        const nextH = Math.max(140, Math.round(active.origH + dy));
        setActiveZones((prev) =>
          prev.map((z) => (z.id === active.id ? { ...z, width: nextW, height: nextH } : z))
        );
      }
    }
  };

  const handleCanvasTouchEnd = () => {
    pinchStateRef.current = null;
    interactionRef.current = null;
    setPortDrag(null);
  };

  const getBoundsById = (id: string): NodeBounds | null => {
    if (isUx) {
      const n = uxNodes.find((item) => item.id === id);
      return n ? getUxNodeBounds(n) : null;
    }
    if (isErd) {
      const t = erdTables.find((item) => item.id === id);
      return t ? getErdNodeBounds(t) : null;
    }
    const a = archNodes.find((item) => item.id === id);
    return a ? getArchNodeBounds(a) : null;
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (portDrag) {
      const world = screenToWorld(e.clientX, e.clientY);
      let hoverTargetId: string | null = null;
      let hoverTargetPort: PortSide | null = null;

      const candidateIds = isUx
        ? uxNodes.map((n) => n.id)
        : isErd
        ? erdTables.map((t) => t.id)
        : archNodes.map((n) => n.id);

      for (const cid of candidateIds) {
        if (cid === portDrag.sourceId) continue;
        const b = getBoundsById(cid);
        if (!b) continue;
        if (
          world.x >= b.x - 18 &&
          world.x <= b.x + b.w + 18 &&
          world.y >= b.y - 18 &&
          world.y <= b.y + b.h + 18
        ) {
          hoverTargetId = cid;
          hoverTargetPort = findClosestPortOnBounds(b, world.x, world.y);
          break;
        }
      }

      let currX = world.x;
      let currY = world.y;
      if (hoverTargetId && hoverTargetPort) {
        const tgtBounds = getBoundsById(hoverTargetId);
        if (tgtBounds) {
          const snapPt = getPortPoint(tgtBounds, hoverTargetPort);
          currX = snapPt.x;
          currY = snapPt.y;
        }
      }

      setPortDrag((prev) =>
        prev
          ? {
              ...prev,
              currX,
              currY,
              hoverTargetId,
              hoverTargetPort
            }
          : null
      );
      return;
    }

    const active = interactionRef.current;
    if (!active) return;

    if (active.kind === 'pan') {
      const dx = e.clientX - active.startClientX;
      const dy = e.clientY - active.startClientY;
      setViewTransform((prev) => ({
        ...prev,
        panX: active.origPanX + dx,
        panY: active.origPanY + dy
      }));
      return;
    }

    const rawDx = e.clientX - active.startClientX;
    const rawDy = e.clientY - active.startClientY;
    if (Math.hypot(rawDx, rawDy) >= 4) {
      didDragRef.current = true;
    }

    const dx = rawDx / zoom;
    const dy = rawDy / zoom;

    if (active.kind === 'node') {
      const nextX = Math.round(active.origX + dx);
      const nextY = Math.round(active.origY + dy);
      if (active.nodeType === 'ux') {
        setUxNodes((prev) =>
          prev.map((n) => (n.id === active.id ? { ...n, x: nextX, y: nextY } : n))
        );
      } else if (active.nodeType === 'erd') {
        setErdTables((prev) =>
          prev.map((t) => (t.id === active.id ? { ...t, x: nextX, y: nextY } : t))
        );
      } else {
        setArchNodes((prev) =>
          prev.map((n) => (n.id === active.id ? { ...n, x: nextX, y: nextY } : n))
        );
      }
    } else if (active.kind === 'zone-move') {
      const nextX = Math.round(active.origX + dx);
      const nextY = Math.round(active.origY + dy);
      setActiveZones((prev) =>
        prev.map((z) => (z.id === active.id ? { ...z, x: nextX, y: nextY } : z))
      );
    } else if (active.kind === 'zone-resize') {
      const nextW = Math.max(180, Math.round(active.origW + dx));
      const nextH = Math.max(140, Math.round(active.origH + dy));
      setActiveZones((prev) =>
        prev.map((z) => (z.id === active.id ? { ...z, width: nextW, height: nextH } : z))
      );
    }
  };

  const openCreateEdgeModal = (
    sourceId: string,
    sourcePort: PortSide,
    targetId: string,
    targetPort: PortSide
  ) => {
    if (isUx) {
      setEdgeModal({
        mode: 'create',
        sourceId,
        sourcePort,
        targetId,
        targetPort,
        triggerLabel: '버튼 클릭 전환',
        guardCondition: '유효성 검증 통과',
        cardinality: '1:N',
        sourceCol: '',
        targetCol: '',
        label: '',
        autoCreateFk: false,
        protocol: '',
        port: '',
        isOptionalV15: false
      });
    } else if (isErd) {
      const srcTable = erdTables.find((t) => t.id === sourceId);
      const pkCol = srcTable?.columns.find((c) => c.isPk)?.name || 'id';
      const suggestedFk = `${(srcTable?.name || sourceId).replace(/s$/, '')}_id`;
      setEdgeModal({
        mode: 'create',
        sourceId,
        sourcePort,
        targetId,
        targetPort,
        triggerLabel: '',
        guardCondition: '',
        cardinality: '1:N',
        sourceCol: pkCol,
        targetCol: suggestedFk,
        label: `${srcTable?.logicalName || sourceId} 참조 (1:N)`,
        autoCreateFk: true,
        protocol: '',
        port: '',
        isOptionalV15: false
      });
    } else {
      setEdgeModal({
        mode: 'create',
        sourceId,
        sourcePort,
        targetId,
        targetPort,
        triggerLabel: '',
        guardCondition: '',
        cardinality: '1:N',
        sourceCol: '',
        targetCol: '',
        label: '',
        autoCreateFk: false,
        protocol: 'HTTPS REST / JSON',
        port: '443 -> 8080',
        isOptionalV15: false
      });
    }
  };

  const handleCanvasMouseUp = () => {
    if (portDrag) {
      if (portDrag.hoverTargetId && portDrag.hoverTargetPort) {
        openCreateEdgeModal(
          portDrag.sourceId,
          portDrag.sourcePort,
          portDrag.hoverTargetId,
          portDrag.hoverTargetPort
        );
      }
      setPortDrag(null);
    }
    interactionRef.current = null;
  };

  const handleOpenEditUxEdge = (
    edge: UxFlowEdge,
    resolvedSrcPort: PortSide,
    resolvedTgtPort: PortSide
  ) => {
    setEdgeModal({
      mode: 'edit',
      edgeId: edge.id,
      sourceId: edge.source,
      sourcePort: edge.sourcePort || resolvedSrcPort,
      targetId: edge.target,
      targetPort: edge.targetPort || resolvedTgtPort,
      triggerLabel: edge.triggerLabel,
      guardCondition: edge.guardCondition,
      cardinality: '1:N',
      sourceCol: '',
      targetCol: '',
      label: '',
      autoCreateFk: false,
      protocol: '',
      port: '',
      isOptionalV15: false
    });
  };

  const handleOpenEditErdRelation = (
    rel: ErdRelation,
    resolvedSrcPort: PortSide,
    resolvedTgtPort: PortSide
  ) => {
    setEdgeModal({
      mode: 'edit',
      edgeId: rel.id,
      sourceId: rel.source,
      sourcePort: rel.sourcePort || resolvedSrcPort,
      targetId: rel.target,
      targetPort: rel.targetPort || resolvedTgtPort,
      triggerLabel: '',
      guardCondition: '',
      cardinality: rel.cardinality,
      sourceCol: rel.sourceCol,
      targetCol: rel.targetCol,
      label: rel.label,
      autoCreateFk: false,
      protocol: '',
      port: '',
      isOptionalV15: false
    });
  };

  const handleOpenEditArchEdge = (
    edge: ArchEdge,
    resolvedSrcPort: PortSide,
    resolvedTgtPort: PortSide
  ) => {
    setEdgeModal({
      mode: 'edit',
      edgeId: edge.id,
      sourceId: edge.source,
      sourcePort: edge.sourcePort || resolvedSrcPort,
      targetId: edge.target,
      targetPort: edge.targetPort || resolvedTgtPort,
      triggerLabel: '',
      guardCondition: '',
      cardinality: '1:N',
      sourceCol: '',
      targetCol: '',
      label: '',
      autoCreateFk: false,
      protocol: edge.protocol,
      port: edge.port,
      isOptionalV15: Boolean(edge.isOptionalV15)
    });
  };

  const handleSaveEdgeModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeModal) return;

    if (isUx) {
      const finalTrigger = edgeModal.triggerLabel.trim() || '화면 이동';
      if (edgeModal.mode === 'create') {
        const created: UxFlowEdge = {
          id: `uxe_${Date.now()}`,
          source: edgeModal.sourceId,
          target: edgeModal.targetId,
          sourcePort: edgeModal.sourcePort,
          targetPort: edgeModal.targetPort,
          triggerLabel: finalTrigger,
          guardCondition: edgeModal.guardCondition.trim() || '조건 없음'
        };
        setUxEdges((prev) => [...prev, created]);
        showToast(`화면 전환 동선(${finalTrigger})이 연결되었습니다`);
      } else if (edgeModal.edgeId) {
        setUxEdges((prev) =>
          prev.map((item) =>
            item.id === edgeModal.edgeId
              ? {
                  ...item,
                  sourcePort: edgeModal.sourcePort,
                  targetPort: edgeModal.targetPort,
                  triggerLabel: finalTrigger,
                  guardCondition: edgeModal.guardCondition
                }
              : item
          )
        );
        showToast('화면 전환 동선이 수정되었습니다');
      }
    } else if (isErd) {
      const finalLabel =
        edgeModal.label.trim() || `${edgeModal.cardinality} (${edgeModal.targetCol})`;

      if (edgeModal.mode === 'create') {
        const newRel: ErdRelation = {
          id: `rel_${Date.now()}`,
          source: edgeModal.sourceId,
          target: edgeModal.targetId,
          sourcePort: edgeModal.sourcePort,
          targetPort: edgeModal.targetPort,
          sourceCol: edgeModal.sourceCol.trim() || 'id',
          targetCol: edgeModal.targetCol.trim() || 'ref_id',
          cardinality: edgeModal.cardinality,
          label: finalLabel
        };
        setErdRelations((prev) => [...prev, newRel]);

        if (edgeModal.autoCreateFk && edgeModal.targetCol.trim()) {
          const fkName = edgeModal.targetCol.trim();
          setErdTables((prev) =>
            prev.map((t) => {
              if (t.id !== edgeModal.targetId) return t;
              if (t.columns.some((c) => c.name === fkName)) return t;
              return {
                ...t,
                columns: [
                  ...t.columns,
                  {
                    id: `col_fk_${Date.now()}`,
                    name: fkName,
                    type: 'BIGINT',
                    isPk: false,
                    isFk: true,
                    nullable: false
                  }
                ]
              };
            })
          );
        }
        showToast(`관계선(${finalLabel})이 연결되었습니다`);
      } else if (edgeModal.edgeId) {
        setErdRelations((prev) =>
          prev.map((r) =>
            r.id === edgeModal.edgeId
              ? {
                  ...r,
                  sourcePort: edgeModal.sourcePort,
                  targetPort: edgeModal.targetPort,
                  cardinality: edgeModal.cardinality,
                  sourceCol: edgeModal.sourceCol,
                  targetCol: edgeModal.targetCol,
                  label: finalLabel
                }
              : r
          )
        );
        showToast('관계선 설정이 수정되었습니다');
      }
    } else {
      const finalProto = edgeModal.protocol.trim() || 'HTTPS REST';
      if (edgeModal.mode === 'create') {
        const newEdge: ArchEdge = {
          id: `edge_${Date.now()}`,
          source: edgeModal.sourceId,
          target: edgeModal.targetId,
          sourcePort: edgeModal.sourcePort,
          targetPort: edgeModal.targetPort,
          protocol: finalProto,
          port: edgeModal.port.trim() || '443',
          isOptionalV15: edgeModal.isOptionalV15
        };
        setArchEdges((prev) => [...prev, newEdge]);
        showToast(`아키텍처 간선(${finalProto})이 연결되었습니다`);
      } else if (edgeModal.edgeId) {
        setArchEdges((prev) =>
          prev.map((item) =>
            item.id === edgeModal.edgeId
              ? {
                  ...item,
                  sourcePort: edgeModal.sourcePort,
                  targetPort: edgeModal.targetPort,
                  protocol: finalProto,
                  port: edgeModal.port,
                  isOptionalV15: edgeModal.isOptionalV15
                }
              : item
          )
        );
        showToast('아키텍처 간선 설정이 수정되었습니다');
      }
    }

    setEdgeModal(null);
  };

  const handleDeleteEdgeFromModal = () => {
    if (!edgeModal || !edgeModal.edgeId) return;
    if (isUx) {
      setUxEdges((prev) => prev.filter((e) => e.id !== edgeModal.edgeId));
    } else if (isErd) {
      setErdRelations((prev) => prev.filter((r) => r.id !== edgeModal.edgeId));
    } else {
      setArchEdges((prev) => prev.filter((e) => e.id !== edgeModal.edgeId));
    }
    setEdgeModal(null);
    showToast('간선이 삭제되었습니다');
  };

  // Toolbar Actions
  const handleAddNode = () => {
    setSubViewMode('canvas');
    setSelectedZoneId(null);

    if (isUx) {
      const newId = `ux_screen_${Date.now().toString().slice(-3)}`;
      const newScreen: UxScreenNode = {
        id: newId,
        name: '마감 알림 구독 모달',
        route: '/bakeries/:id/subscribe',
        screenType: 'Modal',
        authLevel: 'Member',
        auth: 'Member',
        summary: '단골 빵집의 오후 8시 마감 할인 오픈 즉시 푸시 알림을 받도록 설정하는 화면',
        subComponents: ['알림 희망 시간대 선택', '선호 빵 카테고리 체크', '구독 완료 토스트'],
        keyElements: ['알림 희망 시간대 선택', '선호 빵 카테고리 체크', '구독 완료 토스트'],
        stateQueryParams: ['store_id', 'user_token'],
        backendApiEndpoint: 'POST /v1/bakeries/:id/subscribe',
        nextRouteActions: [{ label: '구독 완료', targetRoute: '/bakeries/:id' }],
        uxMetric: '구독 전환율 42%',
        x: Math.round((200 - panX) / zoom),
        y: Math.round((380 - panY) / zoom)
      };
      setUxNodes((prev) => [...prev, newScreen]);
      setSelectedUxId(newId);
      showToast(`새 화면 노드(${newScreen.name})가 추가되었습니다`);
    } else if (isErd) {
      const suffix = erdTables.length + 1;
      const newId = `pickup_reviews_${suffix}`;
      const newTable: ErdTableNode = {
        id: newId,
        name: suffix === 5 ? 'pickup_reviews' : newId,
        logicalName: '픽업 완료 후기',
        domainGroup: 'Order & Settlement',
        x: Math.round((160 - panX) / zoom),
        y: Math.round((120 - panY) / zoom),
        columns: [
          { id: `c_${Date.now()}_1`, name: 'id', type: 'BIGSERIAL', isPk: true, nullable: false },
          {
            id: `c_${Date.now()}_2`,
            name: 'reservation_id',
            type: 'BIGINT',
            isFk: true,
            nullable: false
          },
          { id: `c_${Date.now()}_3`, name: 'rating_score', type: 'SMALLINT', nullable: false },
          { id: `c_${Date.now()}_4`, name: 'review_text', type: 'TEXT', nullable: true }
        ]
      };
      setErdTables((prev) => [...prev, newTable]);
      setSelectedErdId(newId);
      showToast(`새 테이블(${newTable.name})이 추가되었습니다`);
    } else {
      const newId = `node_${Date.now().toString().slice(-3)}`;
      const newArch: ArchNode = {
        id: newId,
        name: 'AWS S3 Media Storage',
        category: 'External',
        techStack: 'Amazon S3 + CloudFront',
        spec: 'Presigned URL Upload',
        zone: 'Private Data Zone',
        x: Math.round((180 - panX) / zoom),
        y: Math.round((140 - panY) / zoom),
        status: 'active',
        metrics: {
          latency: 'PUT < 45ms',
          throughput: 'Direct Upload',
          note: '빵집 마감 품목 썸네일 이미지 업로드 시 서버 I/O 부하 분리'
        }
      };
      setArchNodes((prev) => [...prev, newArch]);
      setSelectedArchId(newId);
      showToast(`새 인프라 노드(${newArch.name})가 추가되었습니다`);
    }
  };

  const handleAddZone = () => {
    setSubViewMode('canvas');
    setShowGroupBox(true);
    const nextIdx = activeZones.length + 1;
    const newZone: CanvasZone = {
      id: `zone_${Date.now()}`,
      title: isUx
        ? `신규 사용자 퍼널 영역 ${nextIdx}`
        : isErd
        ? `신규 도메인 영역 ${nextIdx}`
        : `신규 서브넷 영역 ${nextIdx}`,
      subtitle: isUx
        ? 'User Journey Stage'
        : isErd
        ? 'Bounded Context'
        : `10.20.${30 + nextIdx}.0/24`,
      x: Math.round((120 - panX) / zoom),
      y: Math.round((90 - panY) / zoom),
      width: 310,
      height: 300,
      tone: 'accent'
    };
    setActiveZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newZone.id);
    setSelectedUxId(null);
    setSelectedErdId(null);
    setSelectedArchId(null);
    showToast(`새 영역(${newZone.title})이 생성되었습니다`);
  };

  const handleDeleteZone = (zoneId: string) => {
    setActiveZones((prev) => prev.filter((z) => z.id !== zoneId));
    if (selectedZoneId === zoneId) setSelectedZoneId(null);
    showToast('영역이 삭제되었습니다');
  };

  const handleDeleteSelectedNode = () => {
    if (isUx && selectedUxId) {
      setUxNodes((prev) => prev.filter((n) => n.id !== selectedUxId));
      setUxEdges((prev) =>
        prev.filter((e) => e.source !== selectedUxId && e.target !== selectedUxId)
      );
      setSelectedUxId(null);
      showToast('화면 노드와 연결된 전환 동선이 삭제되었습니다');
    } else if (isErd && selectedErdId) {
      setErdTables((prev) => prev.filter((t) => t.id !== selectedErdId));
      setErdRelations((prev) =>
        prev.filter((r) => r.source !== selectedErdId && r.target !== selectedErdId)
      );
      setSelectedErdId(null);
      showToast('테이블과 연결된 관계선이 삭제되었습니다');
    } else if (isArch && selectedArchId) {
      setArchNodes((prev) => prev.filter((n) => n.id !== selectedArchId));
      setArchEdges((prev) =>
        prev.filter((e) => e.source !== selectedArchId && e.target !== selectedArchId)
      );
      setSelectedArchId(null);
      showToast('인프라 노드와 연결된 간선이 삭제되었습니다');
    }
  };

  const handleSaveDiagram = () => {
    showToast('다이어그램 변경사항이 저장되었습니다');
    if (isUx) {
      onSendCanvasUpdateToChat(
        `화면 흐름 캔버스(${uxNodes.length}개 화면, ${uxEdges.length}개 전환 동선) 구성이 저장되었습니다.`
      );
    } else if (isErd) {
      onSendCanvasUpdateToChat(
        `ERD 캔버스(${erdTables.length}개 테이블, ${erdRelations.length}개 관계선) 스키마 구성이 저장되었습니다.`
      );
    } else {
      onSendCanvasUpdateToChat(
        `시스템 아키텍처(${archNodes.length}개 노드, ${archEdges.length}개 간선) 토폴로지 구성이 저장되었습니다.`
      );
    }
  };

  // Inspector Selection Resolvers
  const selectedZone = activeZones.find((z) => z.id === selectedZoneId) || null;
  const selectedUxNode =
    !selectedZone && isUx ? uxNodes.find((n) => n.id === selectedUxId) || null : null;
  const selectedErdTable =
    !selectedZone && isErd ? erdTables.find((t) => t.id === selectedErdId) || null : null;
  const selectedArchNode =
    !selectedZone && isArch ? archNodes.find((n) => n.id === selectedArchId) || null : null;

  const handleAddColumnToSelected = () => {
    if (!selectedErdTable || !newColName.trim()) return;
    const newCol: TableColumn = {
      id: `col_${Date.now()}`,
      name: newColName.trim().toLowerCase().replace(/\s+/g, '_'),
      type: newColType,
      isPk: false,
      isFk: newColName.endsWith('_id'),
      nullable: true
    };
    setErdTables((prev) =>
      prev.map((t) =>
        t.id === selectedErdTable.id ? { ...t, columns: [...t.columns, newCol] } : t
      )
    );
    setNewColName('');
  };

  const handleUpdateColumn = (tableId: string, colId: string, patch: Partial<TableColumn>) => {
    setErdTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              columns: t.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c))
            }
          : t
      )
    );
  };

  const handleDeleteColumn = (tableId: string, colId: string) => {
    setErdTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, columns: t.columns.filter((c) => c.id !== colId) } : t
      )
    );
  };

  // Code Builders (Mermaid / SQL DDL / Terraform)
  const buildMermaidFromUx = (nodes: UxScreenNode[], edges: UxFlowEdge[]) => {
    const nodeLines = nodes.map(
      (n) => `  ${n.id}["[${n.screenType}] ${n.name} (${n.route})"]`
    );
    const edgeLines = edges.map(
      (e) => `  ${e.source} -->|"${e.triggerLabel}"| ${e.target}`
    );
    return `%% Groom Step 03 UI/UX Screen Transition Flowchart\nflowchart LR\n${nodeLines.join(
      '\n'
    )}\n\n${edgeLines.join('\n')}`;
  };

  const buildSqlDdlFromTables = (tables: ErdTableNode[]) =>
    tables
      .map((table) => {
        const colLines = table.columns.map((c) => {
          const pk = c.isPk ? ' PRIMARY KEY' : '';
          const fk = c.isFk ? ' REFERENCES' : '';
          const nn = c.nullable ? '' : ' NOT NULL';
          return `  ${c.name.padEnd(18, ' ')} ${c.type}${pk}${fk}${nn}`;
        });
        return `-- Table: ${table.name} (${table.logicalName})\nCREATE TABLE ${table.name} (\n${colLines.join(',\n')}\n);`;
      })
      .join('\n\n');

  const buildTerraformFromNodes = (nodes: ArchNode[], edges: ArchEdge[]) =>
    `# BreadAlert AWS VPC Infrastructure Specification (ap-northeast-2)\nresource "aws_vpc" "breadalert_main_vpc" {\n  cidr_block           = "10.20.0.0/16"\n  enable_dns_hostnames = true\n  tags = { Name = "breadalert-prod-vpc" }\n}\n\n# Active Nodes (${nodes.length})\n${nodes
      .map(
        (n) =>
          `# [${n.category}] ${n.name} (${n.id})\nresource "groom_node" "${n.id}" {\n  name       = "${n.name}"\n  category   = "${n.category}"\n  tech_stack = "${n.techStack}"\n  zone       = "${n.zone}"\n  latency    = "${n.metrics.latency}"\n  throughput = "${n.metrics.throughput}"\n}`
      )
      .join('\n\n')}\n\n# Connections (${edges.length})\n${edges
      .map((e) => `# ${e.source} -> ${e.target} (${e.protocol})`)
      .join('\n')}`;

  const [uxCodeText, setUxCodeText] = useState(() => buildMermaidFromUx(uxNodes, uxEdges));
  const [sqlCodeText, setSqlCodeText] = useState(() => buildSqlDdlFromTables(erdTables));
  const [tfCodeText, setTfCodeText] = useState(() => buildTerraformFromNodes(archNodes, archEdges));
  const [isUxDirty, setIsUxDirty] = useState(false);
  const [isSqlDirty, setIsSqlDirty] = useState(false);
  const [isTfDirty, setIsTfDirty] = useState(false);

  useEffect(() => {
    if (!isUxDirty) setUxCodeText(buildMermaidFromUx(uxNodes, uxEdges));
  }, [uxNodes, uxEdges, isUxDirty]);

  useEffect(() => {
    if (!isSqlDirty) setSqlCodeText(buildSqlDdlFromTables(erdTables));
  }, [erdTables, isSqlDirty]);

  useEffect(() => {
    if (!isTfDirty) setTfCodeText(buildTerraformFromNodes(archNodes, archEdges));
  }, [archNodes, archEdges, isTfDirty]);

  const handleApplyUxCodeToCanvas = () => {
    const nodeRegex = /^\s*([a-zA-Z0-9_]+)\["(?:\[([^\]]+)\]\s*)?([^"(]+)(?:\(([^)]*)\))?"\]/gm;
    const parsedNodes: UxScreenNode[] = [];
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = nodeRegex.exec(uxCodeText)) !== null) {
      const id = match[1].trim();
      const rawType = (match[2] || 'Page').trim();
      const validType = (
        ['Page', 'Modal', 'Workspace', 'Drawer'].includes(rawType) ? rawType : 'Page'
      ) as UxScreenNode['screenType'];
      const name = match[3].trim();
      const route = (match[4] || '/').trim();
      const existing = uxNodes.find((n) => n.id === id);

      parsedNodes.push({
        id,
        name,
        route,
        screenType: validType,
        authLevel: existing?.authLevel || 'Public',
        auth: existing?.auth || 'Public',
        summary: existing?.summary || '플로우차트 코드로부터 동기화된 화면 노드입니다.',
        subComponents: existing?.subComponents || ['핵심 컴포넌트'],
        keyElements: existing?.keyElements || ['핵심 컴포넌트'],
        stateQueryParams: existing?.stateQueryParams || [],
        backendApiEndpoint: existing?.backendApiEndpoint || `GET ${route}`,
        nextRouteActions: existing?.nextRouteActions || [],
        uxMetric: existing?.uxMetric || '전환 추적 중',
        x: existing ? existing.x : 56 + (idx % 4) * 284,
        y: existing ? existing.y : 112 + Math.floor(idx / 4) * 220
      });
      idx++;
    }

    if (parsedNodes.length > 0) {
      setUxNodes(parsedNodes);
      setIsUxDirty(false);
      showToast(`${parsedNodes.length}개 화면 노드가 캔버스에 반영되었습니다`);
    } else {
      showToast('변경된 플로우 코드가 저장되었습니다');
    }
  };

  const handleApplySqlToCanvas = () => {
    const blocks = sqlCodeText.split(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?/i).slice(1);
    if (blocks.length === 0) {
      showToast('유효한 CREATE TABLE 구문을 찾지 못했습니다');
      return;
    }

    const parsedTables: ErdTableNode[] = [];
    blocks.forEach((block, idx) => {
      const headerMatch = block.match(/^([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)\s*;/);
      if (!headerMatch) return;
      const tableName = headerMatch[1].trim();
      const bodyLines = headerMatch[2]
        .split(/,\s*\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('--'));

      const existing = erdTables.find((t) => t.name === tableName || t.id === tableName);
      const commentRegex = new RegExp(`--\\s*Table:\\s*${tableName}\\s*\\(([^)]+)\\)`, 'i');
      const logicalMatch = sqlCodeText.match(commentRegex);

      const columns: TableColumn[] = bodyLines.map((line, cIdx) => {
        const clean = line.replace(/,$/, '').trim();
        const tokens = clean.split(/\s+/);
        const colName = tokens[0] || `col_${cIdx}`;
        const colType = tokens[1] || 'VARCHAR(50)';
        const upper = clean.toUpperCase();
        const isPk = upper.includes('PRIMARY KEY');
        const isFk = upper.includes('REFERENCES') || (!isPk && colName.endsWith('_id'));
        const nullable = !upper.includes('NOT NULL') && !isPk;
        return {
          id: `col_${tableName}_${cIdx}_${Date.now()}`,
          name: colName,
          type: colType,
          isPk,
          isFk,
          nullable
        };
      });

      parsedTables.push({
        id: existing ? existing.id : tableName,
        name: tableName,
        logicalName: logicalMatch ? logicalMatch[1].trim() : existing?.logicalName || tableName,
        domainGroup: existing?.domainGroup || 'Order & Settlement',
        x: existing ? existing.x : 80 + (idx % 3) * 320,
        y: existing ? existing.y : 70 + Math.floor(idx / 3) * 260,
        columns
      });
    });

    if (parsedTables.length > 0) {
      setErdTables(parsedTables);
      setIsSqlDirty(false);
      showToast(`${parsedTables.length}개 테이블 스키마가 캔버스에 반영되었습니다`);
    }
  };

  const handleApplyTfToCanvas = () => {
    const resourceRegex = /resource\s+"groom_node"\s+"([^"]+)"\s*\{([\s\S]*?)\}/g;
    const parsedNodes: ArchNode[] = [];
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = resourceRegex.exec(tfCodeText)) !== null) {
      const nodeId = match[1].trim();
      const body = match[2];
      const getAttr = (key: string, fallback: string) => {
        const m = body.match(new RegExp(`${key}\\s*=\\s*"([^"]*)"`));
        return m ? m[1] : fallback;
      };
      const existing = archNodes.find((n) => n.id === nodeId);
      const rawCat = getAttr('category', existing?.category || 'Application');
      const validCat = (
        ['Client', 'Application', 'Database', 'Cache', 'External'].includes(rawCat)
          ? rawCat
          : 'Application'
      ) as ArchNode['category'];

      const rawZone = getAttr('zone', existing?.zone || 'Private App Zone');
      const validZone = (
        ['Public Zone', 'Private App Zone', 'Private Data Zone'].includes(rawZone)
          ? rawZone
          : 'Private App Zone'
      ) as ArchNode['zone'];

      parsedNodes.push({
        id: nodeId,
        name: getAttr('name', existing?.name || nodeId),
        category: validCat,
        techStack: getAttr('tech_stack', existing?.techStack || 'Docker Container'),
        spec: existing?.spec || 'Standard Node',
        zone: validZone,
        x: existing ? existing.x : 100 + (idx % 3) * 270,
        y: existing ? existing.y : 120 + Math.floor(idx / 3) * 180,
        status: existing?.status || 'active',
        metrics: {
          latency: getAttr('latency', existing?.metrics.latency || '< 15ms'),
          throughput: getAttr('throughput', existing?.metrics.throughput || '1.2k rps'),
          note: existing?.metrics.note || '인프라 명세 코드로부터 동기화된 노드입니다.'
        }
      });
      idx++;
    }

    if (parsedNodes.length > 0) {
      setArchNodes(parsedNodes);
      setIsTfDirty(false);
      showToast(`${parsedNodes.length}개 인프라 노드가 캔버스에 반영되었습니다`);
    } else {
      showToast('변경된 코드가 저장되었습니다');
    }
  };

  const handleDownloadCodeFile = () => {
    const content = isUx ? uxCodeText : isErd ? sqlCodeText : tfCodeText;
    const fileName = isUx
      ? '08_ui_screen_flow.mmd'
      : isErd
      ? '10_schema_postgresql.sql'
      : '11_main_vpc_topology.tf';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`${fileName} 파일 다운로드가 시작되었습니다`);
  };

  const renderNodePorts = (nodeId: string, bounds: NodeBounds, isNodeHoveredTarget: boolean) => {
    const posClass: Record<PortSide, string> = {
      top: 'left-1/2 -translate-x-1/2 -top-2',
      right: '-right-2 top-1/2 -translate-y-1/2',
      bottom: 'left-1/2 -translate-x-1/2 -bottom-2',
      left: '-left-2 top-1/2 -translate-y-1/2'
    };

    return PORT_SIDES.map((side) => {
      const isActiveSource =
        portDrag?.sourceId === nodeId && portDrag?.sourcePort === side;
      const isHoveredTargetPort =
        portDrag?.hoverTargetId === nodeId && portDrag?.hoverTargetPort === side;

      return (
        <button
          key={side}
          type="button"
          aria-label={`${side} 방향 간선 연결 포인터`}
          title="드래그하여 다른 노드로 간선을 연결하세요"
          onMouseDown={(e) => handlePortMouseDown(e, nodeId, side, bounds)}
          className={`absolute ${posClass[side]} w-3.5 h-3.5 rounded-full border-2 z-30 transition-transform cursor-crosshair ${
            isActiveSource || isHoveredTargetPort
              ? 'bg-accent border-surface scale-125'
              : isNodeHoveredTarget || portDrag
              ? 'bg-surface border-accent scale-110'
              : 'bg-surface border-line-strong opacity-75 group-hover:opacity-100 group-hover:border-accent hover:scale-125 hover:bg-accent'
          }`}
        />
      );
    });
  };

  const getZoneToneClasses = (tone: CanvasZone['tone'], isSelected: boolean) => {
    if (isSelected) {
      return 'border-2 border-accent bg-accent-soft';
    }
    switch (tone) {
      case 'accent':
        return 'border border-dashed border-accent-line bg-accent-soft/50 hover:border-accent';
      case 'ok':
        return 'border border-dashed border-ok-line bg-ok-soft/50 hover:border-ok';
      case 'warn':
        return 'border border-dashed border-warn-line bg-warn-soft/50 hover:border-warn';
      default:
        return 'border border-dashed border-line-strong bg-surface/50 hover:border-ink-2';
    }
  };

  const findNodeDisplayName = (id: string) => {
    if (isUx) return uxNodes.find((n) => n.id === id)?.name || id;
    if (isErd) return erdTables.find((t) => t.id === id)?.name || id;
    return archNodes.find((n) => n.id === id)?.name || id;
  };

  return (
    <div className="@container relative flex-1 flex flex-col h-full bg-paper overflow-hidden select-none">
      {/* Floating Toast */}
      {toastNotice && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 text-ok shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Top Single-Line Canvas Toolbar (Container-Query Adaptive) */}
      <div className="h-12 px-3 @xl:px-4 bg-surface border-b border-line flex items-center justify-between gap-2 overflow-x-auto shrink-0 z-20">
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden @xl:flex items-center gap-1.5 text-xs">
            {isUx ? (
              <Workflow className="w-3.5 h-3.5 text-muted" />
            ) : isErd ? (
              <Database className="w-3.5 h-3.5 text-muted" />
            ) : (
              <Layers className="w-3.5 h-3.5 text-muted" />
            )}
            <span className="font-semibold text-ink whitespace-nowrap">
              {isUx ? '화면 흐름 및 UI/UX' : isErd ? 'ERD 스키마 캔버스' : '시스템 아키텍처'}
            </span>
          </div>

          <div className="flex items-center bg-well p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setSubViewMode('canvas')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                subViewMode === 'canvas'
                  ? 'bg-surface text-ink font-medium shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isUx ? '캔버스 뷰 (Flow)' : '캔버스'}</span>
            </button>
            {isUx && (
              <button
                type="button"
                onClick={() => setSubViewMode('ia_table')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  subViewMode === 'ia_table'
                    ? 'bg-surface text-ink font-medium shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>IA 라우팅 테이블 뷰</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSubViewMode('code')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                subViewMode === 'code'
                  ? 'bg-surface text-ink font-medium shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden @2xl:inline">
                {isUx
                  ? 'Mermaid 플로우 에디터'
                  : isErd
                  ? 'SQL DDL 에디터'
                  : 'Terraform 에디터'}
              </span>
              <span className="@2xl:hidden">
                {isUx ? 'Mermaid' : isErd ? 'SQL DDL' : 'Terraform'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleAddNode}
            className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isUx ? '화면 추가' : isErd ? '테이블' : '노드'}</span>
          </button>

          <button
            type="button"
            onClick={handleAddZone}
            className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            title="이동 및 크기 조절이 가능한 새 영역 생성"
          >
            <SquareDashed className="w-3.5 h-3.5" />
            <span className="hidden @xl:inline">영역 추가</span>
            <span className="@xl:hidden">영역</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDiagram}
            className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5 text-muted" />
            <span>저장</span>
          </button>

          {onConfirmStep && (
            isConfirmed ? (
              <button
                type="button"
                onClick={() => onConfirmStep(currentStep)}
                className="group bg-ok-soft text-ok border border-ok/30 hover:bg-danger-soft hover:text-danger hover:border-danger/30 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5"
                title="클릭하여 단계 확정을 취소하고 작업 중으로 되돌립니다"
              >
                <CheckCircle2 className="w-3.5 h-3.5 group-hover:hidden" />
                <span className="group-hover:hidden">확정 완료</span>
                <RotateCcw className="w-3.5 h-3.5 hidden group-hover:inline" />
                <span className="hidden group-hover:inline">확정 취소</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onConfirmStep(currentStep)}
                className="px-3 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
                title="현재 단계의 산출물을 확정합니다"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>단계 확정</span>
              </button>
            )
          )}

          {onCollapsePane && (
            <button
              type="button"
              aria-label="문서 영역 접기"
              title="문서 영역 접기"
              onClick={onCollapsePane}
              className="hidden lg:inline-flex p-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* IA Routing Table Sub-View for Step 07 Screen Flow */}
      {subViewMode === 'ia_table' ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-ink">정보 구조도 & 프론트엔드 라우팅 테이블 (IA)</h3>
              <p className="text-xs text-muted mt-0.5">전체 화면 목록, 진입 권한, 하위 UI 컴포넌트 및 API 매핑 명세</p>
            </div>
            <button
              type="button"
              onClick={() => setSubViewMode('canvas')}
              className="px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
            >
              캔버스 뷰로 보기
            </button>
          </div>

          <div className="rounded-xl border border-line overflow-hidden bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-well border-b border-line text-muted">
                  <tr>
                    <th className="px-3.5 py-2.5 font-medium whitespace-nowrap">화면명</th>
                    <th className="px-3.5 py-2.5 font-medium whitespace-nowrap">프론트 라우트</th>
                    <th className="px-3.5 py-2.5 font-medium whitespace-nowrap">권한 (Auth)</th>
                    <th className="px-3.5 py-2.5 font-medium">하위 UI 컴포넌트 목록</th>
                    <th className="px-3.5 py-2.5 font-medium">주요 State 및 파라미터</th>
                    <th className="px-3.5 py-2.5 font-medium whitespace-nowrap">호출 백엔드 API</th>
                    <th className="px-3.5 py-2.5 font-medium">다음 이동 라우트</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {uxNodes.map((screen, sIdx) => (
                    <tr
                      key={screen.id}
                      onClick={() => {
                        setSelectedUxId(screen.id);
                        setSubViewMode('canvas');
                      }}
                      className="hover:bg-well/40 transition-colors cursor-pointer"
                    >
                      <td className="px-3.5 py-3 font-semibold text-ink whitespace-nowrap">
                        0{sIdx + 1}. {screen.name}
                      </td>
                      <td className="px-3.5 py-3 font-mono text-accent whitespace-nowrap font-medium">
                        {screen.route}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            screen.auth === 'Guest'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {screen.auth || 'Member'}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-ink-2 max-w-[220px]">
                        <div className="flex flex-wrap gap-1">
                          {(screen.subComponents || screen.keyElements || []).map((c, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-well text-[10px] text-ink-2 border border-line"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3.5 py-3 font-mono text-muted text-[11px] max-w-[180px]">
                        {(screen.stateQueryParams || []).join(', ') || '-'}
                      </td>
                      <td className="px-3.5 py-3 font-mono text-accent text-[11px] whitespace-nowrap">
                        {screen.backendApiEndpoint || '-'}
                      </td>
                      <td className="px-3.5 py-3 text-[11px] text-muted">
                        {(screen.nextRouteActions || []).map((a, i) => (
                          <div key={i} className="whitespace-nowrap">
                            {a.action} ➔ <span className="font-mono text-accent">{a.targetRoute}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : subViewMode === 'code' ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface select-text">
          <div className="max-w-3xl mx-auto border border-line rounded-xl overflow-hidden bg-well">
            <div className="px-4 py-2.5 border-b border-line flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <code className="font-mono text-ink font-semibold">
                  {isUx
                    ? '03_ui_screen_flow.mmd'
                    : isErd
                    ? '04_schema_postgresql.sql'
                    : '05_main_vpc_topology.tf'}
                </code>
                <span className="text-muted">(코드를 수정한 뒤 캔버스에 반영할 수 있습니다)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isUx) {
                      setIsUxDirty(false);
                      setUxCodeText(buildMermaidFromUx(uxNodes, uxEdges));
                    } else if (isErd) {
                      setIsSqlDirty(false);
                      setSqlCodeText(buildSqlDdlFromTables(erdTables));
                    } else {
                      setIsTfDirty(false);
                      setTfCodeText(buildTerraformFromNodes(archNodes, archEdges));
                    }
                    showToast('캔버스 기준으로 코드를 초기화했습니다');
                  }}
                  className="px-2.5 py-1 rounded-md bg-surface hover:bg-control text-muted hover:text-ink flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>초기화</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCodeFile}
                  className="px-2.5 py-1 rounded-md bg-surface hover:bg-control text-ink flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>다운로드</span>
                </button>

                <button
                  type="button"
                  onClick={
                    isUx
                      ? handleApplyUxCodeToCanvas
                      : isErd
                      ? handleApplySqlToCanvas
                      : handleApplyTfToCanvas
                  }
                  className="px-3 py-1 rounded-md bg-ink hover:opacity-90 text-paper font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>캔버스에 반영</span>
                </button>
              </div>
            </div>

            <textarea
              aria-label="다이어그램 명세 코드 편집기"
              value={isUx ? uxCodeText : isErd ? sqlCodeText : tfCodeText}
              onChange={(e) => {
                if (isUx) {
                  setUxCodeText(e.target.value);
                  setIsUxDirty(true);
                } else if (isErd) {
                  setSqlCodeText(e.target.value);
                  setIsSqlDirty(true);
                } else {
                  setTfCodeText(e.target.value);
                  setIsTfDirty(true);
                }
              }}
              rows={22}
              className="w-full p-5 text-xs font-mono text-ink leading-relaxed bg-surface focus:outline-none resize-y"
            />
          </div>
        </div>
      ) : (
        /* Interactive Infinite Canvas */
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <div
            ref={canvasViewportRef}
            onMouseDown={handleCanvasBackgroundMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onTouchStart={handleCanvasTouchStart}
            onTouchMove={handleCanvasTouchMove}
            onTouchEnd={handleCanvasTouchEnd}
            onTouchCancel={handleCanvasTouchEnd}
            style={{
              backgroundPosition: `${panX}px ${panY}px`,
              backgroundSize: `${Math.max(10, Math.round(20 * zoom))}px ${Math.max(
                10,
                Math.round(20 * zoom)
              )}px`
            }}
            className="flex-1 canvas-dot-grid relative overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div
              style={{
                transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                transformOrigin: '0 0',
                width: '2400px',
                height: '1600px'
              }}
              className="relative"
            >
              {/* 1. Interactive Zones */}
              {showGroupBox &&
                activeZones.map((zone) => {
                  const isZoneSelected = selectedZoneId === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onMouseDown={(e) => handleMouseDownZone(e, zone)}
                      onTouchStart={(e) => handleTouchStartZone(e, zone)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setSelectedZoneId(zone.id);
                        setSelectedUxId(null);
                        setSelectedErdId(null);
                        setSelectedArchId(null);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      style={{
                        left: zone.x,
                        top: zone.y,
                        width: zone.width,
                        height: zone.height
                      }}
                      className={`absolute rounded-xl z-10 cursor-move transition-colors ${getZoneToneClasses(
                        zone.tone,
                        isZoneSelected
                      )}`}
                    >
                      <div className="px-3.5 py-2 border-b border-line flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-ink truncate">{zone.title}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-muted truncate max-w-[150px]">{zone.subtitle}</span>
                          <button
                            type="button"
                            title="영역 속성 편집"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedZoneId((prev) => (prev === zone.id ? null : zone.id));
                              setSelectedUxId(null);
                              setSelectedErdId(null);
                              setSelectedArchId(null);
                            }}
                            className="p-1 rounded hover:bg-surface text-muted hover:text-ink cursor-pointer"
                          >
                            <Settings className="w-3 h-3" />
                          </button>
                          {isZoneSelected && (
                            <button
                              type="button"
                              title="이 영역 삭제"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteZone(zone.id);
                              }}
                              className="p-0.5 rounded hover:bg-surface text-muted hover:text-danger cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div
                        title="드래그하여 영역 크기 조절"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleMouseDownZoneResize(e, zone);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          handleTouchStartZoneResize(e, zone);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        className="absolute right-0 bottom-0 w-5 h-5 cursor-nwse-resize flex items-end justify-end p-1 text-muted hover:text-accent"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                          <path
                            d="M 9 1 L 1 9 M 9 5 L 5 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}

              {/* 2. SVG Edges Layer (z-10: below node cards) */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              >
                <defs>
                  <marker
                    id="erd-crowsfoot"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                  >
                    <path
                      d="M 0 6 L 10 6 M 10 1 L 3 6 L 10 11"
                      stroke={theme === 'light' ? '#0066CC' : '#2997FF'}
                      strokeWidth="1.8"
                      fill="none"
                    />
                  </marker>
                  <marker
                    id="erd-one"
                    markerWidth="10"
                    markerHeight="10"
                    refX="2"
                    refY="5"
                    orient="auto"
                  >
                    <path
                      d="M 4 1 L 4 9"
                      stroke={theme === 'light' ? '#0066CC' : '#2997FF'}
                      strokeWidth="1.8"
                      fill="none"
                    />
                  </marker>
                  <marker
                    id="arch-arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto"
                  >
                    <path
                      d="M 0 1 L 8 5 L 0 9 z"
                      fill={theme === 'light' ? '#0066CC' : '#2997FF'}
                    />
                  </marker>
                  <marker
                    id="ux-arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto"
                  >
                    <path
                      d="M 0 1 L 8 5 L 0 9 z"
                      fill={theme === 'light' ? '#0066CC' : '#2997FF'}
                    />
                  </marker>
                </defs>

                {/* Step 03: UX Screen Transition Edges */}
                {isUx &&
                  uxEdges.map((edge) => {
                    const src = uxNodes.find((n) => n.id === edge.source);
                    const tgt = uxNodes.find((n) => n.id === edge.target);
                    if (!src || !tgt) return null;

                    const srcBounds = getUxNodeBounds(src);
                    const tgtBounds = getUxNodeBounds(tgt);
                    const autoPorts = inferBestPorts(srcBounds, tgtBounds);
                    const sPort = edge.sourcePort || autoPorts.sourcePort;
                    const tPort = edge.targetPort || autoPorts.targetPort;

                    const p1 = getPortPoint(srcBounds, sPort);
                    const p2 = getPortPoint(tgtBounds, tPort);
                    const { path } = buildPortBezier(p1, sPort, p2, tPort);

                    return (
                      <path
                        key={edge.id}
                        d={path}
                        stroke={theme === 'light' ? '#0066CC' : '#2997FF'}
                        strokeOpacity={0.85}
                        strokeWidth="1.8"
                        fill="none"
                        markerEnd="url(#ux-arrow)"
                      />
                    );
                  })}

                {/* Step 04: ERD Relations */}
                {isErd &&
                  erdRelations.map((rel) => {
                    const src = erdTables.find((t) => t.id === rel.source);
                    const tgt = erdTables.find((t) => t.id === rel.target);
                    if (!src || !tgt) return null;

                    const srcBounds = getErdNodeBounds(src);
                    const tgtBounds = getErdNodeBounds(tgt);
                    const autoPorts = inferBestPorts(srcBounds, tgtBounds);
                    const sPort = rel.sourcePort || autoPorts.sourcePort;
                    const tPort = rel.targetPort || autoPorts.targetPort;

                    const p1 = getPortPoint(srcBounds, sPort);
                    const p2 = getPortPoint(tgtBounds, tPort);
                    const { path } = buildPortBezier(p1, sPort, p2, tPort);

                    return (
                      <path
                        key={rel.id}
                        d={path}
                        stroke={theme === 'light' ? '#0066CC' : '#2997FF'}
                        strokeOpacity={0.85}
                        strokeWidth="1.8"
                        fill="none"
                        markerStart="url(#erd-one)"
                        markerEnd={
                          rel.cardinality === '1:1' ? 'url(#erd-one)' : 'url(#erd-crowsfoot)'
                        }
                      />
                    );
                  })}

                {/* Step 05: Architecture Edges */}
                {isArch &&
                  archEdges.map((edge) => {
                    const src = archNodes.find((n) => n.id === edge.source);
                    const tgt = archNodes.find((n) => n.id === edge.target);
                    if (!src || !tgt) return null;

                    const srcBounds = getArchNodeBounds(src);
                    const tgtBounds = getArchNodeBounds(tgt);
                    const autoPorts = inferBestPorts(srcBounds, tgtBounds);
                    const sPort = edge.sourcePort || autoPorts.sourcePort;
                    const tPort = edge.targetPort || autoPorts.targetPort;

                    const p1 = getPortPoint(srcBounds, sPort);
                    const p2 = getPortPoint(tgtBounds, tPort);
                    const { path } = buildPortBezier(p1, sPort, p2, tPort);

                    return (
                      <path
                        key={edge.id}
                        d={path}
                        stroke={theme === 'light' ? '#0066CC' : '#2997FF'}
                        strokeOpacity={0.85}
                        strokeWidth="1.8"
                        strokeDasharray={edge.isOptionalV15 ? '5 3' : undefined}
                        fill="none"
                        markerEnd="url(#ux-arrow)"
                      />
                    );
                  })}

                {/* Live Rubber-Band Edge Preview While Dragging a Port */}
                {portDrag &&
                  (() => {
                    const targetSide =
                      portDrag.hoverTargetPort ||
                      (Math.abs(portDrag.currX - portDrag.startX) >=
                      Math.abs(portDrag.currY - portDrag.startY)
                        ? portDrag.currX >= portDrag.startX
                          ? 'left'
                          : 'right'
                        : portDrag.currY >= portDrag.startY
                        ? 'top'
                        : 'bottom');
                    const { path } = buildPortBezier(
                      { x: portDrag.startX, y: portDrag.startY },
                      portDrag.sourcePort,
                      { x: portDrag.currX, y: portDrag.currY },
                      targetSide
                    );
                    return (
                      <path
                        d={path}
                        stroke={theme === 'light' ? '#0066CC' : '#2997FF'}
                        strokeWidth="2"
                        strokeDasharray="5 3"
                        fill="none"
                        markerEnd="url(#ux-arrow)"
                      />
                    );
                  })()}
              </svg>

              {/* 3A. STEP 03: DRAGGABLE UI/UX SCREEN FLOW NODES */}
              {isUx &&
                uxNodes.map((screen, idx) => {
                  const isSelected = !selectedZoneId && selectedUxId === screen.id;
                  const isHoveredTarget = portDrag?.hoverTargetId === screen.id;
                  const bounds = getUxNodeBounds(screen);

                  return (
                    <div
                      key={screen.id}
                      onMouseDown={(e) => handleMouseDownNode(e, 'ux', screen.id, screen.x, screen.y)}
                      onTouchStart={(e) => handleTouchStartNode(e, 'ux', screen.id, screen.x, screen.y)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (didDragRef.current) return;
                        setSelectedZoneId(null);
                        setSelectedUxId((prev) => (prev === screen.id ? null : screen.id));
                      }}
                      style={{ left: screen.x, top: screen.y, width: 240, height: 104 }}
                      className="group absolute z-20 cursor-grab active:cursor-grabbing"
                    >
                      {renderNodePorts(screen.id, bounds, isHoveredTarget)}

                      <div
                        className={`h-full rounded-xl bg-surface flex flex-col justify-between overflow-hidden transition-colors ${
                          isHoveredTarget || isSelected
                            ? 'border-2 border-accent shadow-md'
                            : 'border border-line group-hover:border-line-strong'
                        }`}
                      >
                        {/* 1. 화면명 & 권한 배지 (Guest/Member) */}
                        <div
                          className={`h-8 px-3 border-b flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-accent-soft border-accent-line'
                              : 'bg-well border-line'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Monitor className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="font-bold text-ink truncate">
                              0{idx + 1}. {screen.name}
                            </span>
                          </div>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold shrink-0 ${
                              screen.auth === 'Guest'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {screen.auth || 'Member'}
                          </span>
                        </div>

                        {/* 2. 프론트 엔드포인트 */}
                        <div className="px-3 py-1.5 min-w-0">
                          <code className="block font-mono text-[11px] font-semibold text-accent truncate">
                            {screen.route}
                          </code>
                        </div>

                        {/* 3. 하단 상태 표시 바 */}
                        <div className="px-3 py-1 border-t border-line bg-well/40 flex items-center justify-between text-[10px] text-muted">
                          <span>{screen.screenType}</span>
                          <span className="text-ink-2 font-medium">
                            컴포넌트 {screen.subComponents?.length || screen.keyElements?.length || 0}개
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* 3B. STEP 04: DRAGGABLE ERD TABLE NODES */}
              {isErd &&
                erdTables.map((table) => {
                  const isSelected = !selectedZoneId && selectedErdId === table.id;
                  const isHoveredTarget = portDrag?.hoverTargetId === table.id;
                  const bounds = getErdNodeBounds(table);

                  return (
                    <div
                      key={table.id}
                      onMouseDown={(e) => handleMouseDownNode(e, 'erd', table.id, table.x, table.y)}
                      onTouchStart={(e) => handleTouchStartNode(e, 'erd', table.id, table.x, table.y)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (didDragRef.current) return;
                        setSelectedZoneId(null);
                        setSelectedErdId((prev) => (prev === table.id ? null : table.id));
                      }}
                      style={{ left: table.x, top: table.y, width: 276 }}
                      className="group absolute z-20 cursor-grab active:cursor-grabbing"
                    >
                      {renderNodePorts(table.id, bounds, isHoveredTarget)}

                      <div
                        className={`rounded-xl bg-surface overflow-hidden transition-colors ${
                          isHoveredTarget || isSelected
                            ? 'border-2 border-accent'
                            : 'border border-line group-hover:border-line-strong'
                        }`}
                      >
                        <div
                          className={`h-9 px-3.5 border-b flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-accent-soft border-accent-line'
                              : 'bg-well border-line'
                          }`}
                        >
                          <code className="font-mono text-xs font-semibold text-ink truncate">
                            {table.name}
                          </code>
                          <span className="text-xs text-muted truncate max-w-[110px]">
                            {table.logicalName}
                          </span>
                        </div>

                        <div className="p-1.5 divide-y divide-line text-xs">
                          {table.columns.map((col) => (
                            <div
                              key={col.id}
                              className="h-[26px] px-2 flex items-center justify-between hover:bg-well rounded"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <code
                                  className={`w-5 font-mono text-xs shrink-0 ${
                                    col.isPk
                                      ? 'text-warn font-semibold'
                                      : col.isFk
                                      ? 'text-accent font-medium'
                                      : 'text-subtle'
                                  }`}
                                >
                                  {col.isPk ? 'PK' : col.isFk ? 'FK' : '-'}
                                </code>
                                <code
                                  className={`truncate font-mono ${
                                    col.isPk ? 'text-ink font-semibold' : 'text-ink-2'
                                  }`}
                                >
                                  {col.name}
                                </code>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <code className="text-xs font-mono text-muted">{col.type}</code>
                                {!col.nullable && (
                                  <span className="text-xs text-subtle" title="NOT NULL">
                                    NN
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* 3C. STEP 05: DRAGGABLE ARCHITECTURE NODES */}
              {isArch &&
                archNodes.map((node) => {
                  const isSelected = !selectedZoneId && selectedArchId === node.id;
                  const isHoveredTarget = portDrag?.hoverTargetId === node.id;
                  const isV15Node = node.status === 'v15_planned';
                  const bounds = getArchNodeBounds(node);

                  const IconComp =
                    node.category === 'Client'
                      ? Globe
                      : node.category === 'Application'
                      ? Server
                      : node.category === 'Database'
                      ? Database
                      : node.category === 'Cache'
                      ? Cpu
                      : HardDrive;

                  return (
                    <div
                      key={node.id}
                      onMouseDown={(e) => handleMouseDownNode(e, 'arch', node.id, node.x, node.y)}
                      onTouchStart={(e) => handleTouchStartNode(e, 'arch', node.id, node.x, node.y)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (didDragRef.current) return;
                        setSelectedZoneId(null);
                        setSelectedArchId((prev) => (prev === node.id ? null : node.id));
                      }}
                      style={{ left: node.x, top: node.y, width: 228, height: 118 }}
                      className="group absolute z-20 cursor-grab active:cursor-grabbing"
                    >
                      {renderNodePorts(node.id, bounds, isHoveredTarget)}

                      <div
                        className={`h-full rounded-xl bg-surface p-3.5 flex flex-col justify-between ${
                          isHoveredTarget || isSelected
                            ? 'border-2 border-accent'
                            : 'border border-line group-hover:border-line-strong'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                            <span className="flex items-center gap-1.5 font-medium">
                              <IconComp className="w-3.5 h-3.5 text-ink-2" />
                              <span>{node.category}</span>
                            </span>
                            <span className={isV15Node ? 'text-ok font-medium' : 'text-muted'}>
                              {isV15Node ? 'V1.5 확장' : 'V1.0 기본'}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-ink truncate">{node.name}</div>
                          <div className="text-xs text-muted mt-0.5 truncate">{node.techStack}</div>
                        </div>

                        <div className="text-xs text-muted pt-2 border-t border-line flex items-center justify-between font-mono">
                          <span className="truncate">{node.metrics.latency}</span>
                          <span className="text-ink-2 truncate ml-2">{node.metrics.throughput}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* 4. Top SVG Edge Labels Layer (z-30: always renders on top of node cards) */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
              >
                {/* Step 03: UX Screen Transition Labels */}
                {isUx &&
                  uxEdges.map((edge) => {
                    const src = uxNodes.find((n) => n.id === edge.source);
                    const tgt = uxNodes.find((n) => n.id === edge.target);
                    if (!src || !tgt) return null;

                    const srcBounds = getUxNodeBounds(src);
                    const tgtBounds = getUxNodeBounds(tgt);
                    const autoPorts = inferBestPorts(srcBounds, tgtBounds);
                    const sPort = edge.sourcePort || autoPorts.sourcePort;
                    const tPort = edge.targetPort || autoPorts.targetPort;

                    const p1 = getPortPoint(srcBounds, sPort);
                    const p2 = getPortPoint(tgtBounds, tPort);
                    const { midX, midY } = buildPortBezier(p1, sPort, p2, tPort);
                    const pillW = Math.max(76, Math.min(160, edge.triggerLabel.length * 7 + 22));

                    return (
                      <g
                        key={edge.id}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditUxEdge(edge, sPort, tPort);
                        }}
                        className="pointer-events-auto cursor-pointer"
                      >
                        <rect
                          x={midX - pillW / 2}
                          y={midY - 10}
                          width={pillW}
                          height={20}
                          rx={6}
                          fill={theme === 'light' ? '#FFFFFF' : '#1D1D1F'}
                          stroke={theme === 'light' ? 'rgba(0,102,204,0.35)' : 'rgba(41,151,255,0.4)'}
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY}
                          dominantBaseline="central"
                          textAnchor="middle"
                          fill={theme === 'light' ? '#0066CC' : '#2997FF'}
                          fontSize="10"
                          fontWeight="600"
                        >
                          {edge.triggerLabel}
                        </text>
                      </g>
                    );
                  })}

                {/* Step 04: ERD Relation Labels */}
                {isErd &&
                  erdRelations.map((rel) => {
                    const src = erdTables.find((t) => t.id === rel.source);
                    const tgt = erdTables.find((t) => t.id === rel.target);
                    if (!src || !tgt) return null;

                    const srcBounds = getErdNodeBounds(src);
                    const tgtBounds = getErdNodeBounds(tgt);
                    const autoPorts = inferBestPorts(srcBounds, tgtBounds);
                    const sPort = rel.sourcePort || autoPorts.sourcePort;
                    const tPort = rel.targetPort || autoPorts.targetPort;

                    const p1 = getPortPoint(srcBounds, sPort);
                    const p2 = getPortPoint(tgtBounds, tPort);
                    const { midX, midY } = buildPortBezier(p1, sPort, p2, tPort);
                    const pillW = Math.max(76, Math.min(180, rel.label.length * 7 + 22));

                    return (
                      <g
                        key={rel.id}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditErdRelation(rel, sPort, tPort);
                        }}
                        className="pointer-events-auto cursor-pointer"
                      >
                        <rect
                          x={midX - pillW / 2}
                          y={midY - 10}
                          width={pillW}
                          height={20}
                          rx={6}
                          fill={theme === 'light' ? '#FFFFFF' : '#1D1D1F'}
                          stroke={theme === 'light' ? 'rgba(0,102,204,0.35)' : 'rgba(41,151,255,0.4)'}
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY}
                          dominantBaseline="central"
                          textAnchor="middle"
                          fill={theme === 'light' ? '#0066CC' : '#2997FF'}
                          fontSize="10"
                          fontWeight="600"
                        >
                          {rel.label}
                        </text>
                      </g>
                    );
                  })}

                {/* Step 05: Architecture Edge Labels */}
                {isArch &&
                  archEdges.map((edge) => {
                    const src = archNodes.find((n) => n.id === edge.source);
                    const tgt = archNodes.find((n) => n.id === edge.target);
                    if (!src || !tgt) return null;

                    const srcBounds = getArchNodeBounds(src);
                    const tgtBounds = getArchNodeBounds(tgt);
                    const autoPorts = inferBestPorts(srcBounds, tgtBounds);
                    const sPort = edge.sourcePort || autoPorts.sourcePort;
                    const tPort = edge.targetPort || autoPorts.targetPort;

                    const p1 = getPortPoint(srcBounds, sPort);
                    const p2 = getPortPoint(tgtBounds, tPort);
                    const { midX, midY } = buildPortBezier(p1, sPort, p2, tPort);
                    const pillW = Math.max(76, Math.min(180, edge.protocol.length * 7 + 22));

                    return (
                      <g
                        key={edge.id}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditArchEdge(edge, sPort, tPort);
                        }}
                        className="pointer-events-auto cursor-pointer"
                      >
                        <rect
                          x={midX - pillW / 2}
                          y={midY - 10}
                          width={pillW}
                          height={20}
                          rx={6}
                          fill={theme === 'light' ? '#FFFFFF' : '#1D1D1F'}
                          stroke={theme === 'light' ? 'rgba(0,102,204,0.35)' : 'rgba(41,151,255,0.4)'}
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY}
                          dominantBaseline="central"
                          textAnchor="middle"
                          fill={theme === 'light' ? '#0066CC' : '#2997FF'}
                          fontSize="10"
                          fontWeight="600"
                        >
                          {edge.protocol}
                        </text>
                      </g>
                    );
                  })}
              </svg>
            </div>
          </div>

          {/* Bottom-Left Zoom Controls */}
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute bottom-4 left-4 z-30 flex items-center gap-2"
          >
            <div className="flex items-center bg-surface border border-line rounded-lg p-1 text-xs text-ink-2">
              <button
                type="button"
                onClick={() =>
                  setViewTransform((p) => ({
                    ...p,
                    zoom: Math.max(0.4, +(p.zoom - 0.1).toFixed(2))
                  }))
                }
                className="p-1.5 hover:bg-well rounded cursor-pointer"
                title="축소 (마우스 휠 아래로)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <code className="px-2 font-mono text-xs tabular-nums">
                {Math.round(zoom * 100)}%
              </code>
              <button
                type="button"
                onClick={() =>
                  setViewTransform((p) => ({
                    ...p,
                    zoom: Math.min(2.0, +(p.zoom + 0.1).toFixed(2))
                  }))
                }
                className="p-1.5 hover:bg-well rounded cursor-pointer"
                title="확대 (마우스 휠 위로)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewTransform({ zoom: 1, panX: 0, panY: 0 })}
                className="p-1.5 hover:bg-well rounded cursor-pointer border-l border-line ml-0.5"
                title="배율 및 시점 초기화"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="hidden xl:inline-flex bg-surface/90 border border-line rounded-lg px-2.5 py-1.5 text-xs text-muted">
              휠: 확대 및 축소 / 노드 클릭: 편집 / 포인터 드래그: 간선 연결
            </span>
          </div>

          {/* INSPECTOR A: ZONE PROPERTY EDITOR */}
          {selectedZone && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 right-4 w-[calc(100%-2rem)] sm:w-80 bg-surface border border-line-strong rounded-xl z-30 overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-well border-b border-line flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">영역(Zone) 속성 편집</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="이 영역 삭제"
                    onClick={() => handleDeleteZone(selectedZone.id)}
                    className="p-1 text-muted hover:text-danger cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="영역 편집기 닫기"
                    onClick={() => setSelectedZoneId(null)}
                    className="p-1 text-muted hover:text-ink cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div>
                  <label className="text-muted block mb-1">영역 제목</label>
                  <input
                    type="text"
                    aria-label="영역 제목 입력"
                    value={selectedZone.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setActiveZones((prev) =>
                        prev.map((z) => (z.id === selectedZone.id ? { ...z, title: val } : z))
                      );
                    }}
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1">보조 설명</label>
                  <input
                    type="text"
                    aria-label="영역 보조 설명 입력"
                    value={selectedZone.subtitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setActiveZones((prev) =>
                        prev.map((z) => (z.id === selectedZone.id ? { ...z, subtitle: val } : z))
                      );
                    }}
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-mono text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-muted block mb-1">가로 너비 (px)</label>
                    <input
                      type="number"
                      aria-label="영역 가로 너비 입력"
                      min={180}
                      max={1600}
                      value={selectedZone.width}
                      onChange={(e) => {
                        const val = Math.max(180, Number(e.target.value) || 180);
                        setActiveZones((prev) =>
                          prev.map((z) => (z.id === selectedZone.id ? { ...z, width: val } : z))
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-muted block mb-1">세로 높이 (px)</label>
                    <input
                      type="number"
                      aria-label="영역 세로 높이 입력"
                      min={140}
                      max={1200}
                      value={selectedZone.height}
                      onChange={(e) => {
                        const val = Math.max(140, Number(e.target.value) || 140);
                        setActiveZones((prev) =>
                          prev.map((z) => (z.id === selectedZone.id ? { ...z, height: val } : z))
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 font-mono text-xs text-ink"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-muted block mb-1.5">테두리 강조 색상</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(
                      [
                        { id: 'neutral', label: '기본' },
                        { id: 'accent', label: '블루' },
                        { id: 'ok', label: '그린' },
                        { id: 'warn', label: '앰버' }
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          setActiveZones((prev) =>
                            prev.map((z) => (z.id === selectedZone.id ? { ...z, tone: t.id } : z))
                          )
                        }
                        className={`py-1 rounded-md text-xs font-medium cursor-pointer ${
                          selectedZone.tone === t.id
                            ? 'bg-ink text-paper'
                            : 'bg-well text-ink-2 hover:bg-control'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSPECTOR B: STEP 03 UX SCREEN NODE INSPECTOR */}
          {selectedUxNode && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[420px] max-h-[82%] flex flex-col bg-surface border border-line-strong rounded-xl z-30 overflow-hidden shadow-lg"
            >
              <div className="px-4 py-2.5 bg-well border-b border-line flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Monitor className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-xs font-bold text-ink truncate">
                    {selectedUxNode.name} 화면 상세 명세
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    title="이 화면 노드 삭제"
                    onClick={handleDeleteSelectedNode}
                    className="p-1 text-muted hover:text-danger cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="화면 편집기 닫기"
                    onClick={() => setSelectedUxId(null)}
                    className="p-1 text-muted hover:text-ink cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4 text-xs overflow-y-auto">
                {/* Basic Fields: Name, Endpoint Route, Auth */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-muted block mb-1">화면 이름</label>
                    <input
                      type="text"
                      aria-label="화면 이름 입력"
                      value={selectedUxNode.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUxNodes((prev) =>
                          prev.map((n) => (n.id === selectedUxNode.id ? { ...n, name: val } : n))
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-muted block mb-1">접근 권한 (Auth)</label>
                    <select
                      aria-label="접근 권한 선택"
                      value={selectedUxNode.authLevel || selectedUxNode.auth || 'Member'}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const val: 'Public' | 'Guest' | 'Member' =
                          raw === 'Guest' ? 'Guest' : raw === 'Member' ? 'Member' : 'Public';
                        setUxNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedUxNode.id ? { ...n, auth: val, authLevel: val } : n
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2 py-1.5 text-xs text-ink"
                    >
                      <option value="Public">Public (공개)</option>
                      <option value="Guest">Guest (비로그인)</option>
                      <option value="Member">Member (일반 회원)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-muted block mb-1">프론트 엔드포인트 라우트</label>
                  <input
                    type="text"
                    aria-label="화면 라우트 경로 입력"
                    value={selectedUxNode.route}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUxNodes((prev) =>
                        prev.map((n) => (n.id === selectedUxNode.id ? { ...n, route: val } : n))
                      );
                    }}
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 font-mono text-xs text-accent"
                  />
                </div>

                {/* 1. 하위 UI 컴포넌트 목록 */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-ink block">
                    1. 하위 UI 컴포넌트 목록
                  </span>
                  <div className="space-y-1">
                    {(selectedUxNode.subComponents || selectedUxNode.keyElements || []).map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-well border border-line text-ink-2 font-mono text-[11px]"
                      >
                        <span className="truncate">❖ {comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 주요 State 및 쿼리 파라미터 */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-ink block">
                    2. 주요 State 및 쿼리 파라미터
                  </span>
                  <div className="p-2.5 rounded-lg bg-well border border-line space-y-1 font-mono text-[11px] text-ink-2">
                    {(selectedUxNode.stateQueryParams || [
                      'activeTab: "list" | "map"',
                      'selectedStoreId: string | null',
                      'page: number',
                      'searchKeyword: string'
                    ]).map((param, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-accent">•</span>
                        <span>{param}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 이 화면에서 호출하는 백엔드 API 엔드포인트 매핑 */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-ink block">
                    3. 호출 백엔드 API 매핑
                  </span>
                  <div className="p-2.5 rounded-lg bg-well border border-line font-mono text-[11px] text-accent flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="truncate">
                      {selectedUxNode.backendApiEndpoint || 'GET /v1/stores/:id/inventory'}
                    </span>
                  </div>
                </div>

                {/* 4. 액션별 이동할 다음 라우트 */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-ink block">
                    4. 액션별 이동 다음 라우트
                  </span>
                  <div className="space-y-1">
                    {(selectedUxNode.nextRouteActions || [
                      { action: '매장 상세 진입', targetRoute: '/stores/:id' },
                      { action: '장바구니 이동', targetRoute: '/cart' }
                    ]).map((act, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1.5 rounded-lg bg-well border border-line text-[11px] flex items-center justify-between"
                      >
                        <span className="text-muted">{act.action}</span>
                        <span className="font-mono text-accent font-medium">➔ {act.targetRoute}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSPECTOR C: STEP 04 ERD TABLE INSPECTOR */}
          {selectedErdTable && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 max-h-[78%] flex flex-col bg-surface border border-line-strong rounded-xl z-30 overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-well border-b border-line flex items-center justify-between shrink-0">
                <code className="text-xs font-semibold text-ink font-mono">
                  {selectedErdTable.name} 테이블 편집
                </code>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="이 테이블 삭제"
                    onClick={handleDeleteSelectedNode}
                    className="p-1 text-muted hover:text-danger cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="테이블 속성 편집기 닫기"
                    onClick={() => setSelectedErdId(null)}
                    className="p-1 text-muted hover:text-ink cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="erd-phys-name-input" className="text-xs text-muted block mb-1">
                      물리 테이블명 (SQL)
                    </label>
                    <input
                      id="erd-phys-name-input"
                      aria-label="테이블 물리명 입력"
                      type="text"
                      value={selectedErdTable.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setErdTables((prev) =>
                          prev.map((t) =>
                            t.id === selectedErdTable.id ? { ...t, name: val } : t
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-mono text-ink"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="erd-logical-name-input"
                      className="text-xs text-muted block mb-1"
                    >
                      논리명 (설명)
                    </label>
                    <input
                      id="erd-logical-name-input"
                      aria-label="테이블 논리명 입력"
                      type="text"
                      value={selectedErdTable.logicalName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setErdTables((prev) =>
                          prev.map((t) =>
                            t.id === selectedErdTable.id ? { ...t, logicalName: val } : t
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs text-ink"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>컬럼 편집 ({selectedErdTable.columns.length})</span>
                    <span>이름, 타입, 제약조건</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {selectedErdTable.columns.map((col) => (
                      <div
                        key={col.id}
                        className="flex items-center gap-1 bg-well rounded-lg px-2 py-1.5 text-xs"
                      >
                        <input
                          type="text"
                          aria-label="컬럼명 수정"
                          value={col.name}
                          onChange={(e) =>
                            handleUpdateColumn(selectedErdTable.id, col.id, {
                              name: e.target.value
                            })
                          }
                          className="w-24 min-w-0 bg-surface border border-line rounded px-1.5 py-0.5 font-mono text-xs text-ink"
                        />
                        <input
                          type="text"
                          aria-label="컬럼 타입 수정"
                          value={col.type}
                          onChange={(e) =>
                            handleUpdateColumn(selectedErdTable.id, col.id, {
                              type: e.target.value
                            })
                          }
                          className="w-20 min-w-0 bg-surface border border-line rounded px-1.5 py-0.5 font-mono text-xs text-muted"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateColumn(selectedErdTable.id, col.id, { isPk: !col.isPk })
                          }
                          className={`px-1.5 py-0.5 rounded text-xs cursor-pointer ${
                            col.isPk
                              ? 'bg-warn-soft text-warn font-semibold'
                              : 'text-subtle hover:text-ink'
                          }`}
                        >
                          PK
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateColumn(selectedErdTable.id, col.id, { isFk: !col.isFk })
                          }
                          className={`px-1.5 py-0.5 rounded text-xs cursor-pointer ${
                            col.isFk
                              ? 'bg-accent-soft text-accent font-semibold'
                              : 'text-subtle hover:text-ink'
                          }`}
                        >
                          FK
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateColumn(selectedErdTable.id, col.id, {
                              nullable: !col.nullable
                            })
                          }
                          className={`px-1.5 py-0.5 rounded text-xs cursor-pointer ${
                            !col.nullable
                              ? 'bg-surface text-ink font-semibold'
                              : 'text-subtle hover:text-ink'
                          }`}
                        >
                          NN
                        </button>
                        <button
                          type="button"
                          aria-label={`${col.name} 컬럼 삭제`}
                          onClick={() => handleDeleteColumn(selectedErdTable.id, col.id)}
                          className="ml-auto text-muted hover:text-danger cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-line space-y-2">
                  <label htmlFor="erd-new-col-name-input" className="text-xs text-muted block">
                    새 컬럼 추가
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      id="erd-new-col-name-input"
                      aria-label="새 컬럼명 입력"
                      type="text"
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      placeholder="cancel_reason"
                      className="flex-1 min-w-0 bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs text-ink font-mono"
                    />
                    <select
                      aria-label="새 컬럼 데이터 타입 선택"
                      value={newColType}
                      onChange={(e) => setNewColType(e.target.value)}
                      className="bg-well border border-line rounded-lg px-2 py-1.5 text-xs text-ink font-mono"
                    >
                      <option value="VARCHAR(50)">VARCHAR(50)</option>
                      <option value="INTEGER">INTEGER</option>
                      <option value="BIGINT">BIGINT</option>
                      <option value="TIMESTAMPTZ">TIMESTAMPTZ</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                      <option value="TEXT">TEXT</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddColumnToSelected}
                      className="px-3 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium cursor-pointer whitespace-nowrap"
                    >
                      추가
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSPECTOR D: STEP 05 ARCHITECTURE NODE INSPECTOR */}
          {selectedArchNode && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 right-4 w-[calc(100%-2rem)] sm:w-96 max-h-[78%] flex flex-col bg-surface border border-line-strong rounded-xl z-30 overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-well border-b border-line flex items-center justify-between shrink-0">
                <span className="text-xs font-semibold text-ink">
                  {selectedArchNode.name} 노드 편집
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="이 노드 삭제"
                    onClick={handleDeleteSelectedNode}
                    className="p-1 text-muted hover:text-danger cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="인스펙터 패널 닫기"
                    onClick={() => setSelectedArchId(null)}
                    className="p-1 text-muted hover:text-ink cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="arch-node-name-input" className="text-xs text-muted block mb-1">
                      노드 이름
                    </label>
                    <input
                      id="arch-node-name-input"
                      aria-label="노드 이름 입력"
                      type="text"
                      value={selectedArchNode.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setArchNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedArchNode.id ? { ...n, name: val } : n
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs text-ink font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="arch-node-cat-select" className="text-xs text-muted block mb-1">
                      컴포넌트 분류
                    </label>
                    <select
                      id="arch-node-cat-select"
                      aria-label="컴포넌트 분류 선택"
                      value={selectedArchNode.category}
                      onChange={(e) => {
                        const val = e.target.value as ArchNode['category'];
                        setArchNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedArchNode.id ? { ...n, category: val } : n
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2 py-1.5 text-xs text-ink"
                    >
                      <option value="Client">Client</option>
                      <option value="Application">Application</option>
                      <option value="Database">Database</option>
                      <option value="Cache">Cache</option>
                      <option value="External">External</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="arch-tech-spec-input" className="text-xs text-muted block mb-1">
                      기술 스택 명세
                    </label>
                    <input
                      id="arch-tech-spec-input"
                      aria-label="컴포넌트 기술 스택 스펙 입력"
                      type="text"
                      value={selectedArchNode.techStack}
                      onChange={(e) => {
                        const val = e.target.value;
                        setArchNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedArchNode.id ? { ...n, techStack: val } : n
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs text-ink font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="arch-zone-input" className="text-xs text-muted block mb-1">
                      네트워크 영역 (Zone)
                    </label>
                    <select
                      id="arch-zone-input"
                      aria-label="네트워크 영역 선택"
                      value={selectedArchNode.zone}
                      onChange={(e) => {
                        const val = e.target.value as ArchNode['zone'];
                        setArchNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedArchNode.id ? { ...n, zone: val } : n
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2 py-1.5 text-xs text-ink"
                    >
                      <option value="Public Zone">Public Zone</option>
                      <option value="Private App Zone">Private App Zone</option>
                      <option value="Private Data Zone">Private Data Zone</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="arch-latency-input" className="text-xs text-muted block mb-1">
                      지연 시간 (Latency)
                    </label>
                    <input
                      id="arch-latency-input"
                      aria-label="지연 시간 입력"
                      type="text"
                      value={selectedArchNode.metrics.latency}
                      onChange={(e) => {
                        const val = e.target.value;
                        setArchNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedArchNode.id
                              ? { ...n, metrics: { ...n.metrics, latency: val } }
                              : n
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-mono text-ink"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="arch-throughput-input"
                      className="text-xs text-muted block mb-1"
                    >
                      처리량 (Throughput)
                    </label>
                    <input
                      id="arch-throughput-input"
                      aria-label="처리량 입력"
                      type="text"
                      value={selectedArchNode.metrics.throughput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setArchNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedArchNode.id
                              ? { ...n, metrics: { ...n.metrics, throughput: val } }
                              : n
                          )
                        );
                      }}
                      className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 text-xs font-mono text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="arch-note-textarea" className="text-xs text-muted block mb-1">
                    아키텍처 설계 메모
                  </label>
                  <textarea
                    id="arch-note-textarea"
                    aria-label="아키텍처 설계 메모 입력"
                    rows={2}
                    value={selectedArchNode.metrics.note}
                    onChange={(e) => {
                      const val = e.target.value;
                      setArchNodes((prev) =>
                        prev.map((n) =>
                          n.id === selectedArchNode.id
                            ? { ...n, metrics: { ...n.metrics, note: val } }
                            : n
                        )
                      );
                    }}
                    className="w-full bg-well border border-line rounded-lg p-2 text-xs text-ink leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EDGE CONFIGURATION MODAL (UX Flow / ERD / Architecture) */}
      {edgeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edge-config-modal-title"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleSaveEdgeModal}
            className="bg-surface border border-line rounded-2xl w-full max-w-md overflow-hidden text-xs"
          >
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div>
                <h2 id="edge-config-modal-title" className="text-sm font-semibold text-ink">
                  {edgeModal.mode === 'create'
                    ? isUx
                      ? '새 화면 전환 동선 설정'
                      : isErd
                      ? '새 ERD 관계선 설정'
                      : '새 아키텍처 간선 설정'
                    : isUx
                    ? '화면 전환 동선 편집'
                    : isErd
                    ? 'ERD 관계선 편집'
                    : '아키텍처 간선 편집'}
                </h2>
                <p className="text-muted mt-0.5">
                  연결 포인터 위치와 {isUx ? '전환 이벤트 조건' : isErd ? '참조 컬럼 및 카디널리티' : '통신 프로토콜 및 포트'}을 지정합니다.
                </p>
              </div>
              <button
                type="button"
                aria-label="간선 설정 모달 닫기"
                onClick={() => setEdgeModal(null)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-well">
                <div>
                  <span className="text-muted block mb-1">출발 노드 및 포인터</span>
                  <div className="font-mono font-semibold text-ink truncate">
                    {findNodeDisplayName(edgeModal.sourceId)}
                  </div>
                  <select
                    aria-label="출발 포인터 위치 선택"
                    value={edgeModal.sourcePort}
                    onChange={(e) =>
                      setEdgeModal({ ...edgeModal, sourcePort: e.target.value as PortSide })
                    }
                    className="mt-1.5 w-full bg-surface border border-line rounded-md px-2 py-1 text-xs text-ink"
                  >
                    <option value="top">상단 (Top)</option>
                    <option value="right">우측 (Right)</option>
                    <option value="bottom">하단 (Bottom)</option>
                    <option value="left">좌측 (Left)</option>
                  </select>
                </div>

                <div>
                  <span className="text-muted block mb-1">도착 노드 및 포인터</span>
                  <div className="font-mono font-semibold text-ink truncate">
                    {findNodeDisplayName(edgeModal.targetId)}
                  </div>
                  <select
                    aria-label="도착 포인터 위치 선택"
                    value={edgeModal.targetPort}
                    onChange={(e) =>
                      setEdgeModal({ ...edgeModal, targetPort: e.target.value as PortSide })
                    }
                    className="mt-1.5 w-full bg-surface border border-line rounded-md px-2 py-1 text-xs text-ink"
                  >
                    <option value="top">상단 (Top)</option>
                    <option value="right">우측 (Right)</option>
                    <option value="bottom">하단 (Bottom)</option>
                    <option value="left">좌측 (Left)</option>
                  </select>
                </div>
              </div>

              {isUx ? (
                <>
                  <div>
                    <label className="text-ink-2 font-medium block mb-1">
                      화면 전환 트리거 라벨
                    </label>
                    <input
                      type="text"
                      aria-label="화면 전환 트리거 라벨 입력"
                      value={edgeModal.triggerLabel}
                      onChange={(e) =>
                        setEdgeModal({ ...edgeModal, triggerLabel: e.target.value })
                      }
                      placeholder="예: 설계 시작 클릭, 결제 완료"
                      className="w-full bg-well border border-line rounded-lg px-3 py-1.5 text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-ink-2 font-medium block mb-1">
                      전환 가드 조건 (선택)
                    </label>
                    <input
                      type="text"
                      aria-label="화면 전환 가드 조건 입력"
                      value={edgeModal.guardCondition}
                      onChange={(e) =>
                        setEdgeModal({ ...edgeModal, guardCondition: e.target.value })
                      }
                      placeholder="예: 게스트 토큰 유효, 필수 입력 충족"
                      className="w-full bg-well border border-line rounded-lg px-3 py-1.5 text-ink"
                    />
                  </div>
                </>
              ) : isErd ? (
                <>
                  <div>
                    <span className="text-ink-2 font-medium block mb-1.5">
                      관계 유형 (Cardinality)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['1:N', '1:1', 'N:M'] as const).map((card) => (
                        <button
                          key={card}
                          type="button"
                          onClick={() => setEdgeModal({ ...edgeModal, cardinality: card })}
                          className={`py-1.5 rounded-lg font-mono font-semibold cursor-pointer ${
                            edgeModal.cardinality === card
                              ? 'bg-ink text-paper'
                              : 'bg-well text-ink-2 hover:bg-control'
                          }`}
                        >
                          {card}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-ink-2 font-medium block mb-1">
                        출발 기준 컬럼 (PK)
                      </label>
                      <input
                        type="text"
                        aria-label="출발 컬럼 입력"
                        value={edgeModal.sourceCol}
                        onChange={(e) =>
                          setEdgeModal({ ...edgeModal, sourceCol: e.target.value })
                        }
                        className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 font-mono text-ink"
                      />
                    </div>
                    <div>
                      <label className="text-ink-2 font-medium block mb-1">
                        도착 외래키 컬럼 (FK)
                      </label>
                      <input
                        type="text"
                        aria-label="도착 외래키 컬럼 입력"
                        value={edgeModal.targetCol}
                        onChange={(e) =>
                          setEdgeModal({ ...edgeModal, targetCol: e.target.value })
                        }
                        className="w-full bg-well border border-line rounded-lg px-2.5 py-1.5 font-mono text-ink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-ink-2 font-medium block mb-1">관계선 표시 라벨</label>
                    <input
                      type="text"
                      aria-label="관계선 라벨 입력"
                      value={edgeModal.label}
                      onChange={(e) => setEdgeModal({ ...edgeModal, label: e.target.value })}
                      placeholder="예: 고객 주문 (1:N)"
                      className="w-full bg-well border border-line rounded-lg px-3 py-1.5 text-ink"
                    />
                  </div>

                  {edgeModal.mode === 'create' && (
                    <label className="flex items-center gap-2 text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={edgeModal.autoCreateFk}
                        onChange={(e) =>
                          setEdgeModal({ ...edgeModal, autoCreateFk: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span>도착 테이블에 해당 외래키(FK) 컬럼이 없으면 자동 추가</span>
                    </label>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="text-ink-2 font-medium block mb-1.5">통신 프로토콜</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {['HTTPS REST', 'SSE Stream', 'JDBC / SQL', 'RESP Cache', 'gRPC'].map(
                        (p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setEdgeModal({ ...edgeModal, protocol: p })}
                            className={`px-2 py-1 rounded-md text-xs cursor-pointer ${
                              edgeModal.protocol === p
                                ? 'bg-accent-soft text-accent font-medium'
                                : 'bg-well text-muted hover:text-ink'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    </div>
                    <input
                      type="text"
                      aria-label="프로토콜 입력"
                      value={edgeModal.protocol}
                      onChange={(e) =>
                        setEdgeModal({ ...edgeModal, protocol: e.target.value })
                      }
                      className="w-full bg-well border border-line rounded-lg px-3 py-1.5 font-mono text-ink"
                    />
                  </div>

                  <div>
                    <label className="text-ink-2 font-medium block mb-1">포트 명세</label>
                    <input
                      type="text"
                      aria-label="포트 명세 입력"
                      value={edgeModal.port}
                      onChange={(e) => setEdgeModal({ ...edgeModal, port: e.target.value })}
                      placeholder="예: 443 → 8080, TCP 5432"
                      className="w-full bg-well border border-line rounded-lg px-3 py-1.5 font-mono text-ink"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edgeModal.isOptionalV15}
                      onChange={(e) =>
                        setEdgeModal({ ...edgeModal, isOptionalV15: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span>보조 연결선(점선)으로 표시</span>
                  </label>
                </>
              )}
            </div>

            <div className="px-5 py-3.5 bg-well border-t border-line flex items-center justify-between gap-2">
              {edgeModal.mode === 'edit' ? (
                <button
                  type="button"
                  onClick={handleDeleteEdgeFromModal}
                  className="px-3 py-1.5 rounded-lg text-danger hover:bg-danger-soft font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>간선 삭제</span>
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEdgeModal(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-control text-ink font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium cursor-pointer"
                >
                  {edgeModal.mode === 'create' ? '간선 연결하기' : '변경사항 저장'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
