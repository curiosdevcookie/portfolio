
document.addEventListener('DOMContentLoaded', (event) => {

  const slices = [
    { percent: 0.20, color: 'purple', label: "Elixir" },
    { percent: 0.25, color: 'blue', label: "Other" },
    { percent: 0.15, color: 'green', label: "Python" },
    { percent: 0.30, color: 'yellow', label: "JavaScript" },
    { percent: 0.10, color: 'black', label: "C" }
  ];

  const svgNamespace = "http://www.w3.org/2000/svg";
  const radius = 100;
  const cx = 150;
  const cy = 150;
  let angleStart = 0;

  const svgElement = document.createElementNS(svgNamespace, "svg");
  svgElement.setAttribute("id", "pie-container");
  svgElement.setAttribute("width", "300");
  svgElement.setAttribute("height", "300");
  svgElement.setAttribute("viewBox", "0 0 300 300");

  slices.forEach(slice => {
    const angleEnd = angleStart + slice.percent * 360;

    const pathData = calculatePieSlice(radius, angleStart, angleEnd, cx, cy);
    const pathElement = document.createElementNS(svgNamespace, "path");
    pathElement.setAttribute("d", pathData);
    pathElement.setAttribute("fill", slice.color);

    svgElement.appendChild(pathElement);

    angleStart = angleEnd;  // Updates the start angle for the next slice
  });

  // svgElement.style.transform = "rotate3d(1, 1, 1, -100deg)";

  document.querySelector('.pie-section').appendChild(svgElement);

  createLegend(slices);

});

function calculatePieSlice(radius, angleStart, angleEnd, cx, cy) {
  const x1 = cx + radius * Math.cos(Math.PI * angleStart / 180);
  const y1 = cy + radius * Math.sin(Math.PI * angleStart / 180);
  const x2 = cx + radius * Math.cos(Math.PI * angleEnd / 180);
  const y2 = cy + radius * Math.sin(Math.PI * angleEnd / 180);

  // This flag is used for SVG arc command (describes which part of the circle is used)
  const largeArcFlag = angleEnd - angleStart <= 180 ? "0" : "1";

  // Constructing the path data using SVG commands
  const d = [
    "M", cx, cy,
    "L", x1, y1,
    "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
    "Z"
  ].join(" ");

  return d;
}

// function calculatePieSlice(radius, angleStart, angleEnd, cx, cy) {
//   const innerRadius = radius * 0.8; 
//   const outerRadius = radius;

//   const x1_inner = cx + innerRadius * Math.cos(Math.PI * angleStart / 180);
//   const y1_inner = cy + innerRadius * Math.sin(Math.PI * angleStart / 180);
//   const x2_inner = cx + innerRadius * Math.cos(Math.PI * angleEnd / 180);
//   const y2_inner = cy + innerRadius * Math.sin(Math.PI * angleEnd / 180);

//   const x1_outer = cx + outerRadius * Math.cos(Math.PI * angleStart / 180);
//   const y1_outer = cy + outerRadius * Math.sin(Math.PI * angleStart / 180);
//   const x2_outer = cx + outerRadius * Math.cos(Math.PI * angleEnd / 180);
//   const y2_outer = cy + outerRadius * Math.sin(Math.PI * angleEnd / 180);

//   const largeArcFlag = angleEnd - angleStart <= 180 ? "0" : "1";

//   const d = [
//     "M", x1_inner, y1_inner,
//     "A", innerRadius, innerRadius, 0, largeArcFlag, 1, x2_inner, y2_inner,
//     "L", x2_outer, y2_outer,
//     "A", outerRadius, outerRadius, 0, largeArcFlag, 0, x1_outer, y1_outer,
//     "Z"
//   ].join(" ");

//   return d;
// }

function createLegend(slices) {
  const legendContainer = document.createElement('ul');
  legendContainer.style.listStyle = 'none';
  legendContainer.classList.add('legend-container');


  slices.forEach(slice => {
    const legendItem = document.createElement('li');
    legendItem.style.display = 'flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.gap = '2rem';

    const colorBox = document.createElement('div');
    colorBox.style.width = '2rem';
    colorBox.style.height = '2rem';
    colorBox.style.backgroundColor = slice.color;

    const label = document.createElement('p');
    label.textContent = slice.label;
    label.style.color = 'white';

    legendItem.appendChild(colorBox);
    legendItem.appendChild(label);

    legendContainer.appendChild(legendItem);
  });

  document.getElementById("pie-container").after(legendContainer);
}