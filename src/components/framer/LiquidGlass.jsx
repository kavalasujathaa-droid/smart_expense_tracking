import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  startTransition,
} from 'react';

/**
 * LiquidGlass Refraction Engine
 * Adapted from the official Framer component source:
 * https://framer.com/m/Liquid-Glass-Nav-Pro-bjAIfL.js@qTWwt82O7SiWRgChNZRM
 * (Internal engine: https://framerusercontent.com/modules/ceHZQZuHMpX58bHqDkQ2/vMU1qWalXXeclk79XZs2/LiquidGlass.js)
 * 
 * Features:
 * - Signed Distance Field (SDF) displacement map generated via WebWorker
 * - Dynamic SVG feDisplacementMap + feGaussianBlur + feColorMatrix filter
 * - Graceful fallback to CSS backdrop-filter: blur() saturate() brightness()
 * - Automatic hardware-accelerated viewport sizing via ResizeObserver
 */

export default function LiquidGlass({
  cornerRadius = 32,
  refraction = 36,
  bezelWidth = 14,
  blur = 16,
  saturation = 1.45,
  brightness = 1.05,
  tint = 'rgba(255, 255, 255, 0.04)',
  tintOpacity = 1,
  style = {},
  className = '',
}) {
  const containerRef = useRef(null);
  const workerRef = useRef(null);
  const workerUrlRef = useRef(null);
  const lastSizeRef = useRef({ width: 1, height: 1 });
  const latestTaskIdRef = useRef(0);
  const generationDebounceRef = useRef(null);

  const [size, setSize] = useState({ width: 1, height: 1 });
  const [mapDataUrl, setMapDataUrl] = useState('');
  const [supportsBackdropFilterUrl, setSupportsBackdropFilterUrl] = useState(false);

  const safeFilterId = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      const supports =
        CSS.supports('backdrop-filter', 'url(#x)') ||
        CSS.supports('-webkit-backdrop-filter', 'url(#x)');
      startTransition(() => setSupportsBackdropFilterUrl(supports));
    } else {
      startTransition(() => setSupportsBackdropFilterUrl(false));
    }
  }, []);

  const getMapGenerationSpec = useCallback(
    (width, height) => {
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.25) : 1;
      const sourceWidth = Math.max(2, Math.round(width * dpr));
      const sourceHeight = Math.max(2, Math.round(height * dpr));
      const maxInternalDimension = 320;
      const scale = Math.min(1, maxInternalDimension / Math.max(sourceWidth, sourceHeight));
      const pixelWidth = Math.max(2, Math.round(sourceWidth * scale));
      const pixelHeight = Math.max(2, Math.round(sourceHeight * scale));
      const scaledDpr = dpr * scale;
      const radius = Math.min(cornerRadius * scaledDpr, pixelWidth * 0.5, pixelHeight * 0.5);
      const bezel = Math.max(1, bezelWidth * scaledDpr);
      return { pixelWidth, pixelHeight, radius, bezel };
    },
    [cornerRadius, bezelWidth]
  );

  const generateDisplacementPixels = useCallback((pixelWidth, pixelHeight, radius, bezel) => {
    const data = new Uint8ClampedArray(pixelWidth * pixelHeight * 4);
    const hw = pixelWidth / 2;
    const hh = pixelHeight / 2;
    const bx = Math.max(0, hw - radius);
    const by = Math.max(0, hh - radius);
    const maxChannelOffset = 118;

    for (let y = 0; y < pixelHeight; y++) {
      const py = y + 0.5 - hh;
      for (let x = 0; x < pixelWidth; x++) {
        const px = x + 0.5 - hw;
        const qx = Math.abs(px) - bx;
        const qy = Math.abs(py) - by;
        const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
        const inside = Math.min(Math.max(qx, qy), 0);
        const sdf = outside + inside - radius;
        const inwardDistance = Math.max(0, -sdf);
        const edgeFactor = Math.max(0, Math.min(1, 1 - inwardDistance / bezel));
        const strength = edgeFactor * edgeFactor;
        const nxBase = px / Math.max(1, hw);
        const nyBase = py / Math.max(1, hh);
        const nLen = Math.hypot(nxBase, nyBase) || 1;
        const nx = nxBase / nLen;
        const ny = nyBase / nLen;
        const channelOffset = maxChannelOffset * strength;
        const r = Math.max(0, Math.min(255, Math.round(128 + nx * channelOffset)));
        const g = Math.max(0, Math.min(255, Math.round(128 + ny * channelOffset)));
        const i = (y * pixelWidth + x) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = 128;
        data[i + 3] = 255;
      }
    }
    return data;
  }, []);

  const pixelsToDataUrl = useCallback((pixelWidth, pixelHeight, data) => {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    const imageData = ctx.createImageData(pixelWidth, pixelHeight);
    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const node = containerRef.current;
    if (!node) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      if (lastSizeRef.current.width === width && lastSizeRef.current.height === height) return;
      lastSizeRef.current = { width, height };
      startTransition(() => setSize({ width, height }));
    };

    updateSize();
    const observer = new ResizeObserver(() => updateSize());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') return;
    const workerSource = `
      self.onmessage = function(event) {
        var payload = event.data || {};
        var taskId = payload.taskId;
        var pixelWidth = payload.pixelWidth;
        var pixelHeight = payload.pixelHeight;
        var radius = payload.radius;
        var bezel = payload.bezel;
        try {
          var data = new Uint8ClampedArray(pixelWidth * pixelHeight * 4);
          var hw = pixelWidth / 2;
          var hh = pixelHeight / 2;
          var bx = Math.max(0, hw - radius);
          var by = Math.max(0, hh - radius);
          var maxChannelOffset = 118;

          for (var y = 0; y < pixelHeight; y++) {
            var py = y + 0.5 - hh;
            for (var x = 0; x < pixelWidth; x++) {
              var px = x + 0.5 - hw;
              var qx = Math.abs(px) - bx;
              var qy = Math.abs(py) - by;
              var outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
              var inside = Math.min(Math.max(qx, qy), 0);
              var sdf = outside + inside - radius;
              var inwardDistance = Math.max(0, -sdf);
              var edgeFactor = Math.max(0, Math.min(1, 1 - inwardDistance / bezel));
              var strength = edgeFactor * edgeFactor;
              var nxBase = px / Math.max(1, hw);
              var nyBase = py / Math.max(1, hh);
              var nLen = Math.hypot(nxBase, nyBase) || 1;
              var nx = nxBase / nLen;
              var ny = nyBase / nLen;
              var channelOffset = maxChannelOffset * strength;
              var r = Math.max(0, Math.min(255, Math.round(128 + nx * channelOffset)));
              var g = Math.max(0, Math.min(255, Math.round(128 + ny * channelOffset)));
              var i = (y * pixelWidth + x) * 4;
              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = 128;
              data[i + 3] = 255;
            }
          }
          self.postMessage({ taskId: taskId, pixelWidth: pixelWidth, pixelHeight: pixelHeight, buffer: data.buffer }, [data.buffer]);
        } catch (error) {
          self.postMessage({ taskId: taskId, error: String(error) });
        }
      };
    `;
    const blob = new Blob([workerSource], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    workerUrlRef.current = url;
    const worker = new Worker(url);
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const payload = event.data || {};
      const taskId = payload.taskId;
      if (typeof taskId !== 'number' || taskId !== latestTaskIdRef.current) return;
      if (!payload.buffer || typeof payload.pixelWidth !== 'number' || typeof payload.pixelHeight !== 'number') return;
      const data = new Uint8ClampedArray(payload.buffer);
      const next = pixelsToDataUrl(payload.pixelWidth, payload.pixelHeight, data);
      if (!next) return;
      startTransition(() => setMapDataUrl(next));
    };

    worker.onerror = () => {
      workerRef.current = null;
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
      if (workerUrlRef.current) {
        URL.revokeObjectURL(workerUrlRef.current);
        workerUrlRef.current = null;
      }
    };
  }, [pixelsToDataUrl]);

  useEffect(() => {
    if (size.width <= 1 || size.height <= 1) return;
    if (typeof window === 'undefined') return;
    const taskId = latestTaskIdRef.current + 1;
    latestTaskIdRef.current = taskId;
    const spec = getMapGenerationSpec(size.width, size.height);

    const runWorkerTask = () => {
      if (!workerRef.current) return;
      workerRef.current.postMessage({
        taskId,
        pixelWidth: spec.pixelWidth,
        pixelHeight: spec.pixelHeight,
        radius: spec.radius,
        bezel: spec.bezel,
      });
    };

    const runSyncFallback = () => {
      const pixels = generateDisplacementPixels(spec.pixelWidth, spec.pixelHeight, spec.radius, spec.bezel);
      if (taskId !== latestTaskIdRef.current) return;
      const next = pixelsToDataUrl(spec.pixelWidth, spec.pixelHeight, pixels);
      if (!next) return;
      startTransition(() => setMapDataUrl(next));
    };

    if (!mapDataUrl) {
      runSyncFallback();
      runWorkerTask();
      return;
    }

    if (generationDebounceRef.current !== null) {
      window.clearTimeout(generationDebounceRef.current);
      generationDebounceRef.current = null;
    }

    generationDebounceRef.current = window.setTimeout(() => {
      if (workerRef.current) {
        runWorkerTask();
      } else {
        runSyncFallback();
      }
    }, 120);

    return () => {
      if (generationDebounceRef.current !== null) {
        window.clearTimeout(generationDebounceRef.current);
        generationDebounceRef.current = null;
      }
    };
  }, [size, cornerRadius, bezelWidth, mapDataUrl, getMapGenerationSpec, generateDisplacementPixels, pixelsToDataUrl]);

  const filterId = useMemo(() => {
    const versionInput = [refraction, blur, saturation, brightness, mapDataUrl].join('|');
    let hash = 2166136261;
    for (let i = 0; i < versionInput.length; i++) {
      hash ^= versionInput.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const versionToken = (hash >>> 0).toString(36);
    return `${safeFilterId}-v${versionToken}`;
  }, [safeFilterId, refraction, blur, saturation, brightness, mapDataUrl]);

  const computedBackdropFilter = useMemo(() => {
    if (supportsBackdropFilterUrl && mapDataUrl) {
      return `url(#${filterId})`;
    }
    return `blur(${blur}px) saturate(${saturation}) brightness(${brightness})`;
  }, [supportsBackdropFilterUrl, mapDataUrl, filterId, blur, saturation, brightness]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: `${cornerRadius}px`,
        pointerEvents: 'none',
        backdropFilter: computedBackdropFilter,
        WebkitBackdropFilter: computedBackdropFilter,
        zIndex: 0,
        ...style,
      }}
    >
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            {mapDataUrl ? (
              <feImage href={mapDataUrl} x={0} y={0} width={size.width} height={size.height} result="map" />
            ) : null}
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(0, blur)} result="softBackdrop" />
            <feDisplacementMap
              in="softBackdrop"
              in2="map"
              scale={refraction}
              xChannelSelector="R"
              yChannelSelector="G"
              result="refracted"
            />
            <feColorMatrix in="refracted" type="saturate" values={String(saturation)} result="saturated" />
            <feComponentTransfer in="saturated">
              <feFuncR type="linear" slope={brightness} />
              <feFuncG type="linear" slope={brightness} />
              <feFuncB type="linear" slope={brightness} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      {/* Translucent tinted surface */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: `${cornerRadius}px`,
          backgroundColor: tint,
          opacity: tintOpacity,
        }}
      />
    </div>
  );
}
