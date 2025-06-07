import { Vector3, CatmullRomCurve3 } from "three";

// Create a giant circle ring
const radius = 25;
const numPoints = 32; // Number of points around the circle
const curvePath = [];

for (let i = 0; i < numPoints; i++)
{
    const angle = (i / numPoints) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = 0;
    const z = Math.sin(angle) * radius;

    curvePath.push(x, y, z);
}

const points = [];
const len = curvePath.length;

for (let i = 0; i < len; i += 3)
{
    points.push(new Vector3(
        curvePath[i],
        curvePath[i + 1],
        curvePath[i + 2]
    ));
}

const spline = new CatmullRomCurve3(points, true);

export default spline;