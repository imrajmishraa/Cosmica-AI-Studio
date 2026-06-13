"use client";

export default function Loader() {
  return (
    <div className="flex content-center items-center justify-center m-60">
      <div className="loading-content">
        <div className="liquid"></div>
        <div className="liquid"></div>
        <div className="liquid"></div>
        <div className="liquid"></div>
      </div>
      <svg className="svg">
        <filter id="gooey">
          <feGaussianBlur stdDeviation="10" in="SourceGraphic"></feGaussianBlur>
          <feColorMatrix
            values={
              "1 0 0 0 0\n        0 1 0 0 0\n        0 0 1 0 0\n        0 0 0 20 -10"
            }
          ></feColorMatrix>
        </filter>
      </svg>
    </div>
  );
}
