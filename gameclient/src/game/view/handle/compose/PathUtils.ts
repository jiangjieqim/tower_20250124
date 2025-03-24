// //   // 使用例子
// //   let path = "0,0 50,50 100,0"; // 一个简单的不规则三角形路径
// //   let segments = 5; // 等分成5段
// //   let equalPath = equalSplitPath(path, segments);
// //   console.log(equalPath);
// export class PathUtils {
//     static equalSplitPath(path, segments) {
//         let points = path.split(' ');
//         let totalLength = 0;
//         let distances = [];
//         let cumulativeDistances = [];

//         // 计算总长度和每段的目标长度
//         for (let i = 1; i < points.length; i++) {
//             let start = points[i - 1];
//             let end = points[i];
//             let dx = parseFloat(end.split(',')[0]) - parseFloat(start.split(',')[0]);
//             let dy = parseFloat(end.split(',')[1]) - parseFloat(start.split(',')[1]);
//             let segmentLength = Math.sqrt(dx * dx + dy * dy);
//             totalLength += segmentLength;
//             distances.push(segmentLength);
//         }

//         let targetLength = totalLength / segments;

//         // 计算累计距离数组
//         let lengthSoFar = 0;
//         for (let distance of distances) {
//             lengthSoFar += distance;
//             cumulativeDistances.push(lengthSoFar);
//         }

//         // 使用线性插值计算等分点
//         let equalSegments = [];
//         for (let i = 1; i < segments; i++) {
//             let index = cumulativeDistances.findIndex(dist => dist > (i / segments) * totalLength);
//             let previousPoint = points[index - 1];
//             let nextPoint = points[index];
//             let segmentFraction = ((i / segments) * totalLength - cumulativeDistances[index - 1]) / (cumulativeDistances[index] - cumulativeDistances[index - 1]);
//             let x = (1 - segmentFraction) * parseFloat(previousPoint.split(',')[0]) + segmentFraction * parseFloat(nextPoint.split(',')[0]);
//             let y = (1 - segmentFraction) * parseFloat(previousPoint.split(',')[1]) + segmentFraction * parseFloat(nextPoint.split(',')[1]);
//             equalSegments.push(`${x},${y}`);
//         }
//         return equalSegments;
//     }
// }
