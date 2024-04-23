uniform vec3 uColor;
uniform float uIntensity;

varying vec3 vNormal;

#include ../includes/ambientLight
#include ../includes/directionalLight

void main()
{
    vec3 color = uColor;

    //lights
    // vec3 light = vec3( 0.0 );
    // light += ambientLight(uColor, uIntensity);
    // color *= light;

    vec3 light = vec3( 0.0 );
    light += directionalLight(vec3(0.1, 0.1,1.0), // light colour
    1.0, // light intensity
    vNormal,
    vec3(0.0, 0.0, 3.0) // light position
    );
    color *= light;


    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}