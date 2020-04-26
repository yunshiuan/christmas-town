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
