/*
* Simple Shader for exercise 8-2
* The student should make this more interesting, but the interesting parts
* might be the fragment shader.
*/

/* pass interpolated variables to the fragment */
varying vec2 v_uv;
uniform sampler2D heightmap;
uniform sampler2D colormap;
varying vec3 v_normal;
varying vec3 fNormal;
varying vec3 fPosition;

/* the vertex shader just passes stuff to the fragment shader after doing the
* appropriate transformations of the vertex information
*/
void main(){
  float height=texture2D(heightmap,uv).b;// get the blue value
  vec3 pos_dis=position+height*normal*0.5;
  // alter the position by raising it by the height
  // we know the direction from the normal (which should be a unit vector)
  vec4 pos=modelViewMatrix*vec4(pos_dis,1.);
  
  gl_Position=projectionMatrix*pos;
  
  // pass the texture coordinate to the fragment
  v_uv=uv;
  v_normal=normalMatrix*normal;
  fNormal=normalize(v_normal);
  fPosition=pos.xyz;
}
