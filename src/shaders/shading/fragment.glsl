uniform vec3 uColor;
uniform float uIntensity;

uniform vec3 uDirLightPosition;
uniform vec3 uDirLightColour;

uniform vec3 uPointLightPosition;
uniform vec3 uPointLightColour;
uniform float uPointLightDecay;



varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight
#include ../includes/directionalLight
#include ../includes/pointLight.glsl

void main()
{

    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 color = uColor;

    //lights
    vec3 light = vec3( 0.0 );


    light += ambientLight(uColor, uIntensity);


    light += directionalLight(
        uDirLightColour, // Light color
        1.0, // light intensity
        normal, // normal
        uDirLightPosition, // light position
        viewDirection, // view direction,
        20.0                 // Specular power
    );

    light += pointLight(
        uPointLightColour, // Light color
        1.0, // light intensity
        normal, // normal
        uPointLightPosition, // light position
        viewDirection, // view direction,
        20.0,   // Specular power
        vPosition, // Position
        uPointLightDecay // Decay             
    );

    color *= light;


    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}