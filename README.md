# README.md file for Workbook 12

Note: filling out this file is extremely important. If you don't describe your assignment here, we may not be able to give you points for things.

-   ** Name: Chuang, Yun-Shiuan **
-   ** GitHub ID: yunshiuan **
-   ** WiscID: ychuang26 **

See README-example.md in the examples directory for ideas on what we are looking for.

## Artist Statement

Describe what you were trying to make:

It's a small village during the Christmas time! The village has just been established so there is construction going on, reclaiming land from the forest. There is a amusement park and firework to celebrate the Christmas festival.

## Straightforward Checks

Please list how your assignment fills the requirements. In cases where you have more than the requirements (e.g., 2,3,5,6) just list the most interesting ones. A short description (a few words) is probably sufficient. Leave blank or say "N/A" for things you didn't do.

Note: the other checks we can see easily.

2.  2 different kinds of objects that you made (just list 2)

    1.  Wood houses
    2.  Brick Houses

3.  5 different kinds of objects beyond #2. (just list 5)

    1.  A bus
    2.  A mini-loader
    3.  A tree
    4.  A helicopter
    5.  A mound made of snow
    6.  A pond that reflects the sky

4.  3 different behaviors. (just list 3)

    1.  The helicopter flies in a shape of 8, while shooting out firework at the same time.
    2.  The bus is following a road (which is composed of cubic splines) that goes through the town. Note that when the bus moves, the speed is constant (with arc-length parameterization).
    3.  The mini-loader is digging dirt from where the forest is.

5.  At least 3 objects must be "rideable"

    1.  The helicopter
    2.  The bus
    3.  The mini-loader
    4.  The horse in the carousel

6.  "train track" with a "train" (tell us how we know its a spline)

    1.  The bus is following the track. The track is composed of cubic cardinal splines. The lines on the ground illustrate the track. To further verify it, feel free to check out the source codes in `for_students\myLib\track.js`.

7.  One object from each category

    -   buildings:
        -   wood houses
        -   brick houses
    -   natural elements:     
        -   trees
        -   a mound nearby the mini-loader that is made of a pile of snow balls, which were scooped up by the mini-loader.
        -   a pond
    -   vehicles:
        -   a helicopter
        -   a bus
        -   a mini-loader
        -   a truck

8.  There is at least one model loaded from a file. (e.g. loading a `.obj` or `.fbx` file)

    1.  The horse in the carousel is loaded from `standing-horse.obj`.

9.  There is at least one shader that you wrote.

    -   what object is it on: The ground plane
    -   describe: There is a displacement map on the ground plane that defines the thickness of snow on the land. The construction site and the amusement park are on a higher ground due to thick snow. Note how the fallen trees are partially buried in the snow. Note the ground still interact with the lights defined by THREE.
    -   filename:
        -   `./shaders/groundPlane.vs"`, `"./shaders/groundPlane.fs`

10. SkyBox or some other texture (list one - and say why you didn't have skybox if you don't have one)
    -   I added the skybox with proper license.

## Complexity Points

Describe each thing that you did that you think is worth complexity points.

If possible, order them from most interesting to least interesting.

Describe what the thing is, where we can see it, and why it deserves complexity points.

Note: put "####" (4 hash marks) and number the complex things to make it easier for us to identify them, but put the description on a separate line. We've given you the first 2 headers

#### Complex Thing 1:

Complex behavior: The bus and the truck is following a road (which is composed of cubic splines) that goes through the town. Note that when the bus moves, the speed is constant (with arc-length parameterization).

#### Complex Thing 2:

Particle System: The helicopter flies in a shape of 8, while shooting out firework at the same time. The firework "balls" (before explosion),  are shooting towards random angel in the air (with the constraint that the initial speed of the ball always flies upwards). After the balls leave the helicopter, the balls are attracted by the gravity following Newton's second law. After a certain amount of time, the ball will explode into particles. The particles are also attracted by the gravity following Newton's second law, except that the air resistance is larger for the particles so they fall down slower. The particles will gradually fade away with time. In addition, the color of the firework is random and the particles could emit colors (have emissive material properties).

#### Complex Thing 3:

Complex behavior: The mini-loader is scooping snow in the construction site near the forest. The mini-loader dumps the snow in the nearby mound.

## Screenshots

List the pictures that you made with a brief description

-   `firework.png`: The helicopter shoots out firework while flying. The firework "balls" (before explosion),  are shooting towards random angel in the air (with the constraint that the initial speed of the ball always flies upwards). After the balls leave the helicopter, the balls are attracted by the gravity following Newton's second law. After a certain amount of time, the ball will explode into particles. The particles are also attracted by the gravity following Newton's second law, except that the air resistance is larger for the particles so they fall down slower. The particles will gradually fade away with time. In addition, the color of the firework is random and the particles could emit colors (have emissive material properties).

-   `mini-loader.png`: The mini-loader is scooping snow in the construction site near the forest. The mini-loader dumps the snow in the nearby mound.

-   `vehicles.png`: The bus and the truck are following a road (which is composed of cubic splines) that goes through the town. Note that when the bus moves, the speed is constant (with arc-length parameterization).

-   `houses.png`: The houses are decorated with snowmen guards.

## Other Notes to the Graders

## Attributions (including self-attributions)

-   The brick houses
    -   From my workbook 9, page 6-1
-   The wood houses
    -   From my workbook 9, page 6-1
-   The bus
    -   From my workbook 9, page 7-1
-   The truck
    -   From my workbook 9, page 7-1     
-   The snowmen
    -   From my workbook 7, page 8-1    
-   The carousel
    -   From my workbook 8, page 8-1
-   The helicopter
    -   From my workbook 8, page 6-1
-   The track (with the arc-length parameterization)
    -   From my workbook 6, page 2-1
-   The mini-loader
    -   From my workbook 8. page 9-1
-   The firework
    -   From my workbook 2, page 5-2
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
        ## Consent

The student consents to having their assignment shown in Galleries and Peer Review.
