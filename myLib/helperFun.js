/*jshint esversion: 6 */
// @ts-check
/**
 * Helpfer functions
 */
// translate an object
export function shift(grobj, x, y, z) {
    grobj.objects.forEach(element => {
        element.position.x = x;
        element.position.y = y;
        element.position.z = z;
    });
    return grobj;
}
// rotate an object (with euler angle)
export function rotate(grobj, x, y, z) {
    grobj.objects.forEach(element => {
        element.rotateX(degreesToRadians(x));
        element.rotateY(degreesToRadians(y));
        element.rotateZ(degreesToRadians(z));
    });
    return grobj;
}
export function degreesToRadians(deg) {
    return (deg * Math.PI) / 180;
}
/**
* A function that converts hex to RGB array.
* 
* @param {string} hexString - the hex value as a string (starting with "#")
* @return {Array<number>} RGB - an Array<number> that contains three integers (R, G, B values)
*/
export function hexToRGB(hexString) {
    hexString = hexString.substring(1, hexString.length);
    let R = parseInt(hexString[0] + hexString[1], 16);
    let G = parseInt(hexString[2] + hexString[3], 16);
    let B = parseInt(hexString[4] + hexString[5], 16);
    return [R, G, B];
}