/* Procedural shading example for Exercise 8-2 */
/* the student should make this more interesting */

/* pass interpolated variables to from the vertex */
uniform sampler2D heightmap;
uniform sampler2D colormap;

varying vec2 v_uv;

/* parameters for lighting */
varying vec3 v_normal;
// const vec3 lightDir = vec3(0.5,1,1);

uniform vec3 ambientLightColor;
uniform struct DirectionalLight{
    vec3 color;
    vec3 direction;
    bool shadow;
    int shadowBias;
    vec2 shadowMapSize;
    int shadowRadius;
}directionalLights[NUM_DIR_LIGHTS];

varying vec3 fPosition;
varying vec3 fNormal;

void main()
{
    vec4 color = texture2D(colormap,v_uv);
    
    // /* renormalize the normal */
    
    float diffuse=0.3;
    float intensity;
    DirectionalLight dl;
    // Here, we calculate the light contributions from each directional light,
    // and then each point light.
    for(int i=0;i<NUM_DIR_LIGHTS;i++){
        dl=directionalLights[i];
        // the light intensity is encoded by threejs as the max of any component of
        // the light color.
        intensity=max(max(dl.color.r,dl.color.g),dl.color.b);
        // we add up the diffuse light by taking the dot of the normal with the
        // direction, multiplied by light intensity.
        diffuse=
        diffuse+max(0.,dot(fNormal,normalize(dl.direction))*intensity);
    }
    // vec3 objectColor=vec3(.8,.3,.23);
    vec3 objectColor=color.xyz;
    vec3 ambientColor=objectColor;
    vec3 diffuseColor=objectColor*diffuse;
    // vec3 finalColor = 1.0*(light*color)+(.15*ambientColor*ambientLightColor+.85*diffuseColor);
    vec3 finalColor=
    .15*ambientColor*ambientLightColor+.85*diffuseColor;
    /* brighten the base color */
    gl_FragColor=vec4(finalColor,1);
    // gl_FragColor=vec4(vec3(.8,.3,.23),1);
    
}
