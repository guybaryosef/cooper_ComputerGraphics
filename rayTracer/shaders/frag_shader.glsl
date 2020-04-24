precision mediump float;


varying vec3    curPos;

// sphere uniforms
uniform float   sphereRadii[9];
uniform vec3    sphereCenters[9];
uniform int     sphereValues[9];
uniform int     sphereCount;


#define MAX_DISTANCE    100
#define SPHERE_OBJECT   1
#define CUBE_OBJECT     2


vec4    traceRay(vec3 rayOrigin, vec3 direction);
vec2    closestIntersectionObject();
float   doesSphereIntersect(vec3 center, float radius);
vec4    calculateIntersectionResult();


void main()
{
        gl_FragColor = traceRay(curPos, vec3(0, 0, -1.0));
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vec4 traceRay(vec3 rayOrigin, vec3 rayDirection)
{
        vec2 intersectingObj = closestIntersectionObject(rayOrigin, rayDirection);

        if (intersectingObj.y > 0.0)
                return calculateIntersectionResult(intersectingObj);
        else
                return vec4(1.0, 1.0, 1.0, 1.0);        // for now the background color will all be white.
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vec2 closestIntersectionObject(vec3 rayOrigin, vec3 rayDirection)
{
        vec2 ret          = vec2(0.0, -1.0);
        float minDistance = MAX_DISTANCE;

        // run through sphere objects
        for (int i=0; i<sphereCount; ++i)
        {
                float distance = doesSphereIntersect(rayOrigin, rayDirection, sphereCenters[i], sphereRadii[i]);

                if (distance > minDistance)
                {
                        ret = vec2(SPHERE_OBJECT, float(i));
                        minDistance = distance;
                }
        }

        // run through cube objects

        return ret;
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
float doesSphereIntersect(vec3 rayOrigin, vec3 direction, vec3 center, float radius)
{
        vec3 poi;      // point of intersection
        bool  intersect = false;

        // figure out if the sphere intersects, and if so at which point.

        if (intersect)
                return sqrt(pow(poi.x - rayOrigin.x) + pow(poi.y - rayOrigin.y) + pow(poi.z - rayOrigin.z) );
        else
                return MAX_DISTANCE;
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vec4 calculateIntersectionResult()
{
        return vec4(0.0, 0.0, 0.0, 1.0);
}