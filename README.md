## Overview

It's a small village during the Christmas time! The village has just been established so there is construction going on, reclaiming land from the forest. There is a amusement park and firework to celebrate the Christmas festival.

The whole town was built and animated with JavaScript (THREE.js).

This is based on my COMP SCI 559 final project at UW-Madison.

## Screenshots

-   Locates in the directory `Pictures\`

-   `firework.png`: The helicopter shoots out firework while flying. The firework "balls" (before explosion),  are shooting towards random angel in the air (with the constraint that the initial speed of the ball always flies upwards). After the balls leave the helicopter, the balls are attracted by the gravity following Newton's second law. After a certain amount of time, the ball will explode into particles. The particles are also attracted by the gravity following Newton's second law, except that the air resistance is larger for the particles so they fall down slower. The particles will gradually fade away with time. In addition, the color of the firework is random and the particles could emit colors (have emissive material properties).

-   `mini-loader.png`: The mini-loader is scooping snow in the construction site near the forest. The mini-loader dumps the snow in the nearby mound.

-   `vehicles.png`: The bus and the truck are following a road (which is composed of cubic splines) that goes through the town. Note that when the bus moves, the speed is constant (with arc-length parameterization).

-   `houses.png`: The houses are decorated with snowmen guards.

## Attributions

-   Skybox
    -   The picture for the skybox is from: <https://hdrihaven.com/hdri/?c=outdoor&h=winter_lake_01>.
    -   The function to load the skybox cubeTextureHelp() is modified from: <https://cs559.github.io/S20-FrameworkDemos/texture/m4-skybox.html>
-   shaders for the ground plane.
    -   based on workbook 11, page 7-2 and workbook 11, page 8-2.
-   The horse in the carousel:
    -   <https://clara.io/view/6a20fb1f-764a-498e-81ba-5b88f7569562#>

Source for the texture images:

-   Brick
    -   <https://www.designtrends.com/graphic-web/textures/brick.html>
-   Wood
    -   <https://www.vecteezy.com/vector-art/190576-white-wood-texture>
-   Doors
    -   <https://www.pinterest.com/pin/811844270305918769/>
    -   <https://www.wayfair.com/Creative-Entryways--Paneled-Solid-Wood-Finish-Standard-Door-GA2242-L6477-K~CVES1017.html?refid=GX105610134562-CVES1017&device=c&ptid=402810735526&network=g&targetid=pla-402810735526&channel=GooglePLA&ireid=47336361&fdid=1817&PiID%5B%5D=26030683&gclid=CjwKCAjw4KD0BRBUEiwA7MFNTTV9gDaY4LHKLu4VndqK3w6G8SAQrT7lLyYEXv4WrIwW6HjpdJJ4jRoCifUQAvD_BwE>
-   Windows
    -   <http://texturelib.com/texture/?path=/Textures/windows/windows_0035>
    -   <https://bloch-kormos.hu/hu/galeria/kulteri-nyilaszarok1/#lg=1&slide=0>
-   Truck
    -   <https://opengameart.org/content/shipping-container-texture-pack>
